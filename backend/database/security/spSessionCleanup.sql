-- =============================================
-- Stored Procedure: spSessionCleanup
-- Description: Removes expired sessions (job to run hourly)
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spSessionCleanup') AND type = 'P')
    DROP PROCEDURE security.spSessionCleanup
GO

CREATE PROCEDURE security.spSessionCleanup
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @deletedCount INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Delete expired sessions
        DELETE FROM security.Sessions
        WHERE expires_at < GETUTCDATE()
            OR DATEDIFF(MINUTE, last_activity, GETUTCDATE()) > 30;
        
        SET @deletedCount = @@ROWCOUNT;
        
        COMMIT TRANSACTION;
        
        SELECT 
            @deletedCount AS deleted_sessions,
            GETUTCDATE() AS cleanup_timestamp;
        
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