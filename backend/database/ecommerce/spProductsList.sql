-- =============================================
-- Stored Procedure: spProductsList
-- Description: Lists products with pagination, sorting, and filtering
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.spProductsList') AND type = 'P')
    DROP PROCEDURE ecommerce.spProductsList
GO

CREATE PROCEDURE ecommerce.spProductsList
    @page INT = 1,
    @pageSize INT = 12,
    @sortColumn VARCHAR(50) = 'id',
    @sortDirection VARCHAR(4) = 'DESC',
    @searchTerm VARCHAR(255) = NULL,
    @categoryFilter VARCHAR(50) = NULL,
    @minPrice DECIMAL(10,2) = NULL,
    @maxPrice DECIMAL(10,2) = NULL,
    @minRating DECIMAL(2,1) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @offset INT = (@page - 1) * @pageSize;
    DECLARE @totalCount INT;
    
    BEGIN TRY
        -- Build dynamic WHERE clause
        DECLARE @whereClause NVARCHAR(MAX) = 'WHERE deleted = 0';
        
        IF @searchTerm IS NOT NULL AND LEN(@searchTerm) >= 2
        BEGIN
            SET @whereClause = @whereClause + ' AND (product_name LIKE ''%' + @searchTerm + '%'' OR product_description LIKE ''%' + @searchTerm + '%'')';
        END
        
        IF @categoryFilter IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + ' AND category = ''' + @categoryFilter + '''';
        END
        
        IF @minPrice IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + ' AND price >= ' + CAST(@minPrice AS VARCHAR);
        END
        
        IF @maxPrice IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + ' AND price <= ' + CAST(@maxPrice AS VARCHAR);
        END
        
        IF @minRating IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + ' AND rating >= ' + CAST(@minRating AS VARCHAR);
        END
        
        -- Get total count
        DECLARE @countQuery NVARCHAR(MAX) = 'SELECT @totalCount = COUNT(*) FROM ecommerce.Products ' + @whereClause;
        EXEC sp_executesql @countQuery, N'@totalCount INT OUTPUT', @totalCount OUTPUT;
        
        -- Validate sort column
        IF @sortColumn NOT IN ('id', 'product_name', 'price', 'rating', 'stock_quantity', 'date_created')
            SET @sortColumn = 'id';
        
        IF @sortDirection NOT IN ('ASC', 'DESC')
            SET @sortDirection = 'DESC';
        
        -- Build and execute main query
        DECLARE @query NVARCHAR(MAX) = '
            SELECT 
                id,
                product_name,
                price,
                category,
                rating,
                stock_quantity,
                main_image_url,
                product_images,
                CASE 
                    WHEN stock_quantity = 0 THEN ''unavailable''
                    WHEN stock_quantity <= 5 THEN ''limited''
                    ELSE ''available''
                END AS stock_badge_type,
                CASE 
                    WHEN stock_quantity = 0 THEN ''Indisponível''
                    WHEN stock_quantity <= 5 THEN ''Últimas unidades''
                    ELSE ''''
                END AS stock_badge_text,
                CASE 
                    WHEN stock_quantity = 0 THEN ''red''
                    WHEN stock_quantity <= 5 THEN ''orange''
                    ELSE ''transparent''
                END AS stock_badge_color,
                date_created
            FROM ecommerce.Products
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