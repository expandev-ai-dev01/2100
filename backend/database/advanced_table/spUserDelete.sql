-- =============================================
-- Stored Procedure: spUserDelete
-- Description: Soft deletes a user
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserDelete') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserDelete
GO

CREATE PROCEDURE advanced_table.spUserDelete
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if user exists
        IF NOT EXISTS (SELECT 1 FROM advanced_table.Users WHERE id = @id AND deleted = 0)
        BEGIN
            RAISERROR('User not found', 16, 1);
            RETURN;
        END
        
        -- Soft delete user
        UPDATE advanced_table.Users
        SET 
            deleted = 1,
            date_modified = GETUTCDATE()
        WHERE id = @id;
        
        COMMIT TRANSACTION;
        
        SELECT 'User deleted successfully' AS message;
        
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
