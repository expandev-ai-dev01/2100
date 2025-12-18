-- =============================================
-- Dashboard Schema Seed Data
-- Feature: Dashboard Interativo
-- =============================================

BEGIN TRANSACTION;

BEGIN TRY
    -- Insert default preferences for test users if not exists
    -- Assuming user IDs 1 and 2 exist from security seed
    
    IF NOT EXISTS (SELECT 1 FROM dashboard.Widget_Preferences WHERE user_id = 1)
    BEGIN
        INSERT INTO dashboard.Widget_Preferences (user_id, preferences_json)
        VALUES (1, '{"metrics":{"totalUsers":true,"monthlySales":true,"registeredProducts":true,"pendingOrders":true},"charts":{"sales":true,"categories":true,"users":true},"sections":{"activities":true,"notifications":true,"quickAccess":true}}');
    END

    COMMIT TRANSACTION;
    PRINT 'Dashboard seed data executed successfully';
    
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    PRINT 'Error seeding dashboard data';
END CATCH
GO
