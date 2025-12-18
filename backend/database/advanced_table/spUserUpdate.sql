-- =============================================
-- Stored Procedure: spUserUpdate
-- Description: Updates user information
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserUpdate') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserUpdate
GO

CREATE PROCEDURE advanced_table.spUserUpdate
    @id INT,
    @name VARCHAR(200),
    @email VARCHAR(255),
    @status VARCHAR(20),
    @type VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate user exists
        IF NOT EXISTS (SELECT 1 FROM advanced_table.Users WHERE id = @id AND deleted = 0)
        BEGIN
            RAISERROR('User not found', 16, 1);
            RETURN;
        END
        
        -- Validate name
        IF LEN(TRIM(@name)) < 3
        BEGIN
            RAISERROR('Name must be at least 3 characters', 16, 1);
            RETURN;
        END
        
        -- Validate email format
        IF @email NOT LIKE '%_@__%.__%'
        BEGIN
            RAISERROR('Invalid email format', 16, 1);
            RETURN;
        END
        
        -- Check email uniqueness (excluding current user)
        IF EXISTS (SELECT 1 FROM advanced_table.Users WHERE email = @email AND id != @id AND deleted = 0)
        BEGIN
            RAISERROR('Email already in use', 16, 1);
            RETURN;
        END
        
        -- Validate status
        IF @status NOT IN ('Ativo', 'Inativo', 'Pendente')
        BEGIN
            RAISERROR('Invalid status', 16, 1);
            RETURN;
        END
        
        -- Validate type
        IF @type NOT IN ('Cliente', 'Fornecedor', 'Parceiro', 'Admin')
        BEGIN
            RAISERROR('Invalid type', 16, 1);
            RETURN;
        END
        
        -- Update user
        UPDATE advanced_table.Users
        SET 
            name = @name,
            email = @email,
            status = @status,
            type = @type,
            date_modified = GETUTCDATE()
        WHERE id = @id AND deleted = 0;
        
        COMMIT TRANSACTION;
        
        -- Return updated user
        SELECT 
            id,
            name,
            email,
            status,
            type,
            date_created,
            last_login,
            date_modified
        FROM advanced_table.Users
        WHERE id = @id;
        
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
