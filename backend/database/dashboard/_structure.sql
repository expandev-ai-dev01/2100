-- =============================================
-- Dashboard Schema Structure
-- Feature: Dashboard Interativo
-- =============================================

-- Create dashboard schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'dashboard')
BEGIN
    EXEC('CREATE SCHEMA dashboard')
END
GO

-- =============================================
-- Table: dashboard.Widget_Preferences
-- Description: Stores user preferences for dashboard widgets visibility
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dashboard.Widget_Preferences') AND type = 'U')
BEGIN
    CREATE TABLE dashboard.Widget_Preferences (
        user_id INT NOT NULL,
        preferences_json NVARCHAR(MAX) NOT NULL,
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT PK_Widget_Preferences PRIMARY KEY (user_id),
        CONSTRAINT FK_Widget_Preferences_Users FOREIGN KEY (user_id) REFERENCES security.Users(id) ON DELETE CASCADE
    )
END
GO
