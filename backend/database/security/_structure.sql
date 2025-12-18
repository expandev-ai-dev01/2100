-- =============================================
-- Security Schema Structure
-- Sistema de Autenticação Completo
-- =============================================

-- Create security schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security')
END
GO

-- =============================================
-- Table: security.Users
-- Description: Stores user account information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.Users') AND type = 'U')
BEGIN
    CREATE TABLE security.Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        status VARCHAR(10) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'))
    )

    -- Create indexes for optimization
    CREATE UNIQUE INDEX IX_Users_Email ON security.Users(email)
    CREATE INDEX IX_Users_Status ON security.Users(status)
END
GO

-- =============================================
-- Table: security.Sessions
-- Description: Stores active user sessions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.Sessions') AND type = 'U')
BEGIN
    CREATE TABLE security.Sessions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME2 NOT NULL,
        last_activity DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        remember_me BIT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Sessions_Users FOREIGN KEY (user_id) REFERENCES security.Users(id)
    )

    -- Create indexes for optimization
    CREATE INDEX IX_Sessions_UserId ON security.Sessions(user_id)
    CREATE UNIQUE INDEX IX_Sessions_Token ON security.Sessions(session_token)
    CREATE INDEX IX_Sessions_ExpiresAt ON security.Sessions(expires_at)
END
GO

-- =============================================
-- Table: security.Login_Attempts
-- Description: Tracks login attempts for rate limiting
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.Login_Attempts') AND type = 'U')
BEGIN
    CREATE TABLE security.Login_Attempts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        email_attempted VARCHAR(255) NULL,
        success BIT NOT NULL,
        attempted_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        user_agent TEXT NULL
    )

    -- Create indexes for optimization
    CREATE INDEX IX_LoginAttempts_IpAddress ON security.Login_Attempts(ip_address)
    CREATE INDEX IX_LoginAttempts_AttemptedAt ON security.Login_Attempts(attempted_at)
    CREATE INDEX IX_LoginAttempts_IpSuccess ON security.Login_Attempts(ip_address, success, attempted_at)
END
GO

-- =============================================
-- Trigger: Update updated_at on Users table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Users_UpdateTimestamp')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Users_UpdateTimestamp
    ON security.Users
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE security.Users
        SET updated_at = GETUTCDATE()
        FROM security.Users u
        INNER JOIN inserted i ON u.id = i.id
    END
    ')
END
GO

-- =============================================
-- Trigger: Update last_activity on Sessions table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Sessions_UpdateActivity')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Sessions_UpdateActivity
    ON security.Sessions
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        IF NOT UPDATE(last_activity)
        BEGIN
            UPDATE security.Sessions
            SET last_activity = GETUTCDATE()
            FROM security.Sessions s
            INNER JOIN inserted i ON s.id = i.id
        END
    END
    ')
END
GO