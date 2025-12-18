-- =============================================
-- Stored Procedure: spSessionValidate
-- Description: Validates session token and updates activity
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spSessionValidate') AND type = 'P')
    DROP PROCEDURE security.spSessionValidate
GO

CREATE PROCEDURE security.spSessionValidate
    @sessionToken VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @userId INT;
    DECLARE @expiresAt DATETIME2;
    DECLARE @lastActivity DATETIME2;
    DECLARE @userStatus VARCHAR(10);
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Get session data
        SELECT 
            @userId = s.user_id,
            @expiresAt = s.expires_at,
            @lastActivity = s.last_activity,
            @userStatus = u.status
        FROM security.Sessions s
        INNER JOIN security.Users u ON s.user_id = u.id
        WHERE s.session_token = @sessionToken;
        
        -- Check if session exists
        IF @userId IS NULL
        BEGIN
            RAISERROR('Invalid session', 16, 1);
            RETURN;
        END
        
        -- Check if session expired
        IF @expiresAt < GETUTCDATE()
        BEGIN
            -- Delete expired session
            DELETE FROM security.Sessions WHERE session_token = @sessionToken;
            RAISERROR('Session expired', 16, 1);
            RETURN;
        END
        
        -- Check inactivity (30 minutes)
        IF DATEDIFF(MINUTE, @lastActivity, GETUTCDATE()) > 30
        BEGIN
            -- Delete inactive session
            DELETE FROM security.Sessions WHERE session_token = @sessionToken;
            RAISERROR('Session expired due to inactivity', 16, 1);
            RETURN;
        END
        
        -- Check if user is active
        IF @userStatus != 'ativo'
        BEGIN
            -- Delete session of inactive user
            DELETE FROM security.Sessions WHERE session_token = @sessionToken;
            RAISERROR('User account is inactive', 16, 1);
            RETURN;
        END
        
        -- Update last activity
        UPDATE security.Sessions
        SET last_activity = GETUTCDATE()
        WHERE session_token = @sessionToken;
        
        COMMIT TRANSACTION;
        
        -- Return user data
        SELECT 
            u.id,
            u.email,
            u.name,
            u.status,
            s.expires_at,
            s.remember_me
        FROM security.Users u
        INNER JOIN security.Sessions s ON u.id = s.user_id
        WHERE s.session_token = @sessionToken;
        
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