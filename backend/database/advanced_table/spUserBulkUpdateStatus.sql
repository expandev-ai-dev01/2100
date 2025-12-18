-- =============================================
-- Stored Procedure: spUserBulkUpdateStatus
-- Description: Updates status for multiple users
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserBulkUpdateStatus') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserBulkUpdateStatus
GO

CREATE PROCEDURE advanced_table.spUserBulkUpdateStatus
    @ids VARCHAR(MAX), -- Comma-separated list of IDs
    @status VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @updatedCount INT = 0;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate status
        IF @status NOT IN ('Ativo', 'Inativo', 'Pendente')
        BEGIN
            RAISERROR('Invalid status', 16, 1);
            RETURN;
        END
        
        -- Create temp table for IDs
        CREATE TABLE #TempIds (id INT);
        
        -- Parse comma-separated IDs
        INSERT INTO #TempIds (id)
        SELECT CAST(value AS INT)
        FROM STRING_SPLIT(@ids, ',');
        
        -- Update users
        UPDATE advanced_table.Users
        SET 
            status = @status,
            date_modified = GETUTCDATE()
        WHERE id IN (SELECT id FROM #TempIds)
            AND deleted = 0;
        
        SET @updatedCount = @@ROWCOUNT;
        
        DROP TABLE #TempIds;
        
        COMMIT TRANSACTION;
        
        SELECT 
            @updatedCount AS updated_count,
            'Users updated successfully' AS message;
        
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
