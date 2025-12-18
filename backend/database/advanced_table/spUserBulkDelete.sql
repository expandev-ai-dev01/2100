-- =============================================
-- Stored Procedure: spUserBulkDelete
-- Description: Soft deletes multiple users
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserBulkDelete') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserBulkDelete
GO

CREATE PROCEDURE advanced_table.spUserBulkDelete
    @ids VARCHAR(MAX) -- Comma-separated list of IDs
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @deletedCount INT = 0;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Create temp table for IDs
        CREATE TABLE #TempIds (id INT);
        
        -- Parse comma-separated IDs
        INSERT INTO #TempIds (id)
        SELECT CAST(value AS INT)
        FROM STRING_SPLIT(@ids, ',');
        
        -- Soft delete users
        UPDATE advanced_table.Users
        SET 
            deleted = 1,
            date_modified = GETUTCDATE()
        WHERE id IN (SELECT id FROM #TempIds)
            AND deleted = 0;
        
        SET @deletedCount = @@ROWCOUNT;
        
        DROP TABLE #TempIds;
        
        COMMIT TRANSACTION;
        
        SELECT 
            @deletedCount AS deleted_count,
            'Users deleted successfully' AS message;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        IF OBJECT_ID('tempdb..#TempIds') IS NOT NULL
            DROP TABLE #TempIds;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
