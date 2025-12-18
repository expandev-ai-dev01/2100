-- =============================================
-- Advanced Table Schema Structure
-- Feature: Sistema de Tabelas Avançado
-- =============================================

-- Create schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'advanced_table')
BEGIN
    EXEC('CREATE SCHEMA advanced_table')
END
GO

-- =============================================
-- Table: advanced_table.Users
-- Description: Stores user data for advanced table feature
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.Users') AND type = 'U')
BEGIN
    CREATE TABLE advanced_table.Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Ativo', 'Inativo', 'Pendente')),
        type VARCHAR(20) NOT NULL CHECK (type IN ('Cliente', 'Fornecedor', 'Parceiro', 'Admin')),
        date_created DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        last_login DATETIME2 NULL,
        date_modified DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        deleted BIT NOT NULL DEFAULT 0
    )

    -- Create indexes for optimization
    CREATE INDEX IX_Users_Email ON advanced_table.Users(email)
    CREATE INDEX IX_Users_Status ON advanced_table.Users(status)
    CREATE INDEX IX_Users_Type ON advanced_table.Users(type)
    CREATE INDEX IX_Users_DateCreated ON advanced_table.Users(date_created)
    CREATE INDEX IX_Users_Deleted ON advanced_table.Users(deleted)
END
GO

-- =============================================
-- Trigger: Update date_modified on Users table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Users_UpdateTimestamp')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Users_UpdateTimestamp
    ON advanced_table.Users
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE advanced_table.Users
        SET date_modified = GETUTCDATE()
        FROM advanced_table.Users u
        INNER JOIN inserted i ON u.id = i.id
    END
    ')
END
GO
