-- =============================================
-- Stored Procedure: spUserExport
-- Description: Exports users based on filters (for CSV/Excel/PDF generation)
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUserExport') AND type = 'P')
    DROP PROCEDURE advanced_table.spUserExport
GO

CREATE PROCEDURE advanced_table.spUserExport
    @scope VARCHAR(20) = 'all', -- 'all', 'filtered', 'selected'
    @ids VARCHAR(MAX) = NULL, -- For 'selected' scope
    @searchTerm VARCHAR(255) = NULL,
    @statusFilter VARCHAR(20) = NULL,
    @typeFilter VARCHAR(20) = NULL,
    @dateFrom DATETIME2 = NULL,
    @dateTo DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Build dynamic WHERE clause
        DECLARE @whereClause NVARCHAR(MAX) = 'WHERE deleted = 0';
        
        IF @scope = 'selected' AND @ids IS NOT NULL
        BEGIN
            -- Create temp table for selected IDs
            CREATE TABLE #TempIds (id INT);
            INSERT INTO #TempIds (id)
            SELECT CAST(value AS INT)
            FROM STRING_SPLIT(@ids, ',');
            
            SET @whereClause = @whereClause + ' AND id IN (SELECT id FROM #TempIds)';
        END
        ELSE IF @scope = 'filtered'
        BEGIN
            IF @searchTerm IS NOT NULL AND LEN(@searchTerm) >= 3
            BEGIN
                SET @whereClause = @whereClause + ' AND (name LIKE ''%' + @searchTerm + '%'' OR email LIKE ''%' + @searchTerm + '%'' OR CAST(id AS VARCHAR) LIKE ''%' + @searchTerm + '%'')';
            END
            
            IF @statusFilter IS NOT NULL
            BEGIN
                SET @whereClause = @whereClause + ' AND status = ''' + @statusFilter + '''';
            END
            
            IF @typeFilter IS NOT NULL
            BEGIN
                SET @whereClause = @whereClause + ' AND type = ''' + @typeFilter + '''';
            END
            
            IF @dateFrom IS NOT NULL
            BEGIN
                SET @whereClause = @whereClause + ' AND date_created >= ''' + CONVERT(VARCHAR, @dateFrom, 120) + '''';
            END
            
            IF @dateTo IS NOT NULL
            BEGIN
                SET @whereClause = @whereClause + ' AND date_created <= ''' + CONVERT(VARCHAR, @dateTo, 120) + '''';
            END
        END
        
        -- Build and execute query
        DECLARE @query NVARCHAR(MAX) = '
            SELECT 
                id,
                name,
                email,
                status,
                type,
                CONVERT(VARCHAR, date_created, 120) AS date_created,
                CONVERT(VARCHAR, last_login, 120) AS last_login
            FROM advanced_table.Users
            ' + @whereClause + '
            ORDER BY id DESC';
        
        EXEC sp_executesql @query;
        
        -- Cleanup
        IF OBJECT_ID('tempdb..#TempIds') IS NOT NULL
            DROP TABLE #TempIds;
        
    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#TempIds') IS NOT NULL
            DROP TABLE #TempIds;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
