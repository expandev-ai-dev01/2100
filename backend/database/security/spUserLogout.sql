-- =============================================
-- Stored Procedure: spUserLogout
-- Description: Invalidates user session
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.spUserLogout') AND type = 'P')
    DROP PROCEDURE security.spUserLogout
GO

CREATE PROCEDURE security.spUserLogout
    @sessionToken VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if session exists
        IF NOT EXISTS (SELECT 1 FROM security.Sessions WHERE session_token = @sessionToken)
        BEGIN
            RAISERROR('Invalid or expired session', 16, 1);
            RETURN;
        END
        
        -- Delete session
        DELETE FROM security.Sessions
        WHERE session_token = @sessionToken;
        
        COMMIT TRANSACTION;
        
        SELECT 'Logout successful' AS message;
        
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