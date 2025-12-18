-- =============================================
-- Stored Procedure: spUserRegister
-- Description: Creates a new user account with validation
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spUserRegister') AND type = 'P')
    DROP PROCEDURE security.spUserRegister
GO

CREATE PROCEDURE security.spUserRegister
    @email VARCHAR(255),
    @password VARCHAR(255),
    @name VARCHAR(100),
    @userId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate email format
        IF @email NOT LIKE '%_@__%.__%'
        BEGIN
            RAISERROR('Invalid email format', 16, 1);
            RETURN;
        END
        
        -- Validate name length
        IF LEN(TRIM(@name)) < 2 OR LEN(@name) > 100
        BEGIN
            RAISERROR('Name must be between 2 and 100 characters', 16, 1);
            RETURN;
        END
        
        -- Validate name contains only letters, spaces and accents
        IF @name LIKE '%[^a-zA-ZÀ-ÿ ]%'
        BEGIN
            RAISERROR('Name must contain only letters, spaces and accents', 16, 1);
            RETURN;
        END
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM security.Users WHERE email = LOWER(@email))
        BEGIN
            RAISERROR('Email already registered', 16, 1);
            RETURN;
        END
        
        -- Insert new user
        INSERT INTO security.Users (email, password, name, status)
        VALUES (LOWER(@email), @password, TRIM(@name), 'ativo');
        
        SET @userId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        SELECT 
            id,
            email,
            name,
            created_at,
            updated_at,
            status
        FROM security.Users
        WHERE id = @userId;
        
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