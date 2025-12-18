-- =============================================
-- Stored Procedure: spLoginAttemptsCleanup
-- Description: Removes old login attempts (job to run daily)
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spLoginAttemptsCleanup') AND type = 'P')
    DROP PROCEDURE security.spLoginAttemptsCleanup
GO

CREATE PROCEDURE security.spLoginAttemptsCleanup
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @deletedCount INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Delete login attempts older than 24 hours
        DELETE FROM security.Login_Attempts
        WHERE attempted_at < DATEADD(HOUR, -24, GETUTCDATE());
        
        SET @deletedCount = @@ROWCOUNT;
        
        COMMIT TRANSACTION;
        
        SELECT 
            @deletedCount AS deleted_attempts,
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