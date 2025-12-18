-- =============================================
-- Stored Procedure: spUserGet
-- Description: Retrieves a single user by ID
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserGet') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserGet
GO

CREATE PROCEDURE advanced_table.spUserGet
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if user exists and is not deleted
        IF NOT EXISTS (SELECT 1 FROM advanced_table.Users WHERE id = @id AND deleted = 0)
        BEGIN
            RAISERROR('User not found', 16, 1);
            RETURN;
        END
        
        -- Return user data
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
        WHERE id = @id AND deleted = 0;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
