-- =============================================
-- Advanced Table Schema Seed Data
-- Feature: Sistema de Tabelas Avançado
-- =============================================

BEGIN TRANSACTION;

BEGIN TRY
    -- Insert test users (only if table is empty)
    IF NOT EXISTS (SELECT 1 FROM advanced_table.Users)
    BEGIN
        DECLARE @i INT = 1;
        DECLARE @maxUsers INT = 150;
        DECLARE @statuses TABLE (status VARCHAR(20));
        DECLARE @types TABLE (type VARCHAR(20));
        
        INSERT INTO @statuses VALUES ('Ativo'), ('Inativo'), ('Pendente');
        INSERT INTO @types VALUES ('Cliente'), ('Fornecedor'), ('Parceiro'), ('Admin');
        
        WHILE @i <= @maxUsers
        BEGIN
            DECLARE @randomStatus VARCHAR(20);
            DECLARE @randomType VARCHAR(20);
            DECLARE @randomDaysAgo INT = FLOOR(RAND() * 365);
            DECLARE @randomLastLogin DATETIME2 = CASE 
                WHEN RAND() > 0.3 THEN DATEADD(DAY, -FLOOR(RAND() * 30), GETUTCDATE())
                ELSE NULL
            END;
            
            SELECT TOP 1 @randomStatus = status FROM @statuses ORDER BY NEWID();
            SELECT TOP 1 @randomType = type FROM @types ORDER BY NEWID();
            
            INSERT INTO advanced_table.Users (name, email, status, type, date_created, last_login)
            VALUES (
                'User ' + CAST(@i AS VARCHAR(10)),
                'user' + CAST(@i AS VARCHAR(10)) + '@test.com',
                @randomStatus,
                @randomType,
                DATEADD(DAY, -@randomDaysAgo, GETUTCDATE()),
                @randomLastLogin
            );
            
            SET @i = @i + 1;
        END
        
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
