-- =============================================
-- Complex Form Schema Structure
-- Feature: Formulários Complexos
-- =============================================

-- Create schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'complex_form')
BEGIN
    EXEC('CREATE SCHEMA complex_form')
END
GO

-- =============================================
-- Table: complex_form.Drafts
-- Description: Stores form drafts in progress
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'complex_form.Drafts') AND type = 'U')
BEGIN
    CREATE TABLE complex_form.Drafts (
        id VARCHAR(50) PRIMARY KEY,
        user_id INT NOT NULL,
        current_step INT NOT NULL DEFAULT 1,
        progress_percentage INT NOT NULL DEFAULT 0,
        form_data NVARCHAR(MAX) NOT NULL, -- JSON data
        last_saved DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Drafts_Users FOREIGN KEY (user_id) REFERENCES security.Users(id) ON DELETE CASCADE
    )

    CREATE INDEX IX_Drafts_UserId ON complex_form.Drafts(user_id)
END
GO

-- =============================================
-- Table: complex_form.Submissions
-- Description: Stores final form submissions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'complex_form.Submissions') AND type = 'U')
BEGIN
    CREATE TABLE complex_form.Submissions (
        id VARCHAR(50) PRIMARY KEY,
        protocol_number VARCHAR(20) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        form_data NVARCHAR(MAX) NOT NULL, -- JSON data
        submitted_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        CONSTRAINT FK_Submissions_Users FOREIGN KEY (user_id) REFERENCES security.Users(id)
    )

    CREATE INDEX IX_Submissions_UserId ON complex_form.Submissions(user_id)
    CREATE INDEX IX_Submissions_Protocol ON complex_form.Submissions(protocol_number)
END
GO
