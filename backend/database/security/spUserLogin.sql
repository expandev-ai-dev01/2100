-- =============================================
-- Stored Procedure: spUserLogin
-- Description: Validates user credentials and creates session
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spUserLogin') AND type = 'P')
    DROP PROCEDURE security.spUserLogin
GO

CREATE PROCEDURE security.spUserLogin
    @email VARCHAR(255),
    @password VARCHAR(255),
    @sessionToken VARCHAR(255),
    @rememberMe BIT = 0,
    @ipAddress VARCHAR(45),
    @userAgent TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @userId INT;
    DECLARE @storedPassword VARCHAR(255);
    DECLARE @userStatus VARCHAR(10);
    DECLARE @expiresAt DATETIME2;
    DECLARE @sessionId INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check rate limiting (5 failed attempts in 15 minutes)
        DECLARE @failedAttempts INT;
        SELECT @failedAttempts = COUNT(*)
        FROM security.Login_Attempts
        WHERE ip_address = @ipAddress
            AND success = 0
            AND attempted_at >= DATEADD(MINUTE, -15, GETUTCDATE());
        
        IF @failedAttempts >= 5
        BEGIN
            -- Log blocked attempt
            INSERT INTO security.Login_Attempts (ip_address, email_attempted, success, user_agent)
            VALUES (@ipAddress, @email, 0, @userAgent);
            
            RAISERROR('Too many login attempts. Please try again in 15 minutes', 16, 1);
            RETURN;
        END
        
        -- Get user data
        SELECT 
            @userId = id,
            @storedPassword = password,
            @userStatus = status
        FROM security.Users
        WHERE email = LOWER(@email);
        
        -- Check if user exists and password matches
        IF @userId IS NULL OR @storedPassword != @password
        BEGIN
            -- Log failed attempt
            INSERT INTO security.Login_Attempts (ip_address, email_attempted, success, user_agent)
            VALUES (@ipAddress, @email, 0, @userAgent);
            
            RAISERROR('Invalid email or password', 16, 1);
            RETURN;
        END
        
        -- Check if user is active
        IF @userStatus != 'ativo'
        BEGIN
            -- Log failed attempt
            INSERT INTO security.Login_Attempts (ip_address, email_attempted, success, user_agent)
            VALUES (@ipAddress, @email, 0, @userAgent);
            
            RAISERROR('Account is inactive. Please contact support', 16, 1);
            RETURN;
        END
        
        -- Calculate expiration time
        IF @rememberMe = 1
            SET @expiresAt = DATEADD(DAY, 30, GETUTCDATE());
        ELSE
            SET @expiresAt = DATEADD(HOUR, 2, GETUTCDATE());
        
        -- Create session
        INSERT INTO security.Sessions (user_id, session_token, expires_at, remember_me)
        VALUES (@userId, @sessionToken, @expiresAt, @rememberMe);
        
        SET @sessionId = SCOPE_IDENTITY();
        
        -- Log successful attempt
        INSERT INTO security.Login_Attempts (ip_address, email_attempted, success, user_agent)
        VALUES (@ipAddress, @email, 1, @userAgent);
        
        COMMIT TRANSACTION;
        
        -- Return user and session data
        SELECT 
            u.id,
            u.email,
            u.name,
            u.status,
            s.session_token,
            s.expires_at,
            s.remember_me
        FROM security.Users u
        INNER JOIN security.Sessions s ON u.id = s.user_id
        WHERE s.id = @sessionId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO