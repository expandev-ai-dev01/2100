-- =============================================
-- Stored Procedure: spUsersList
-- Description: Lists users with pagination, sorting, and filtering
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'advanced_table.spUsersList') AND type = 'P')
    DROP PROCEDURE advanced_table.spUsersList
GO

CREATE PROCEDURE advanced_table.spUsersList
    @page INT = 1,
    @pageSize INT = 10,
    @sortColumn VARCHAR(50) = 'id',
    @sortDirection VARCHAR(4) = 'DESC',
    @searchTerm VARCHAR(255) = NULL,
    @statusFilter VARCHAR(20) = NULL,
    @typeFilter VARCHAR(20) = NULL,
    @dateFrom DATETIME2 = NULL,
    @dateTo DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @offset INT = (@page - 1) * @pageSize;
    DECLARE @totalCount INT;
    
    BEGIN TRY
        -- Build dynamic WHERE clause
        DECLARE @whereClause NVARCHAR(MAX) = 'WHERE deleted = 0';
        
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
        
        -- Get total count
        DECLARE @countQuery NVARCHAR(MAX) = 'SELECT @totalCount = COUNT(*) FROM advanced_table.Users ' + @whereClause;
        EXEC sp_executesql @countQuery, N'@totalCount INT OUTPUT', @totalCount OUTPUT;
        
        -- Validate sort column
        IF @sortColumn NOT IN ('id', 'name', 'email', 'status', 'type', 'date_created', 'last_login')
            SET @sortColumn = 'id';
        
        IF @sortDirection NOT IN ('ASC', 'DESC')
            SET @sortDirection = 'DESC';
        
        -- Build and execute main query
        DECLARE @query NVARCHAR(MAX) = '
            SELECT 
                id,
                name,
                email,
                status,
                type,
                date_created,
                last_login,
                date_modified
            FROM advanced_table.Users
            ' + @whereClause + '
            ORDER BY ' + @sortColumn + ' ' + @sortDirection + '
            OFFSET ' + CAST(@offset AS VARCHAR) + ' ROWS
            FETCH NEXT ' + CAST(@pageSize AS VARCHAR) + ' ROWS ONLY';
        
        EXEC sp_executesql @query;
        
        -- Return metadata
        SELECT 
            @totalCount AS total,
            @page AS page,
            @pageSize AS pageSize,
            CEILING(CAST(@totalCount AS FLOAT) / @pageSize) AS totalPages;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
