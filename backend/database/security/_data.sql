-- =============================================
-- Security Schema Seed Data
-- Sistema de Autenticação Completo
-- =============================================

-- Note: This file contains optional seed data for testing
-- Password hashes are bcrypt with 12 rounds
-- Test password for all users: Test@123

BEGIN TRANSACTION;

BEGIN TRY
    -- Insert test users (only if table is empty)
    IF NOT EXISTS (SELECT 1 FROM security.Users)
    BEGIN
        INSERT INTO security.Users (email, password, name, status)
        VALUES 
            ('admin@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Ciu3zu', 'Admin User', 'ativo'),
            ('user@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Ciu3zu', 'Test User', 'ativo'),
            ('inactive@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Ciu3zu', 'Inactive User', 'inativo');
        
        PRINT 'Test users created successfully';
    END
    ELSE
    BEGIN
        PRINT 'Users table already contains data - skipping seed data';
    END
    
    COMMIT TRANSACTION;
    
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
    DECLARE @ErrorState INT = ERROR_STATE();
    
    RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH
GO