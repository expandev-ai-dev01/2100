-- =============================================
-- Stored Procedure: spProductGet
-- Description: Retrieves a single product with full details
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.spProductGet') AND type = 'P')
    DROP PROCEDURE ecommerce.spProductGet
GO

CREATE PROCEDURE ecommerce.spProductGet
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if product exists and is not deleted
        IF NOT EXISTS (SELECT 1 FROM ecommerce.Products WHERE id = @id AND deleted = 0)
        BEGIN
            RAISERROR('Product not found', 16, 1);
            RETURN;
        END
        
        -- Return product data
        SELECT 
            id,
            product_name,
            price,
            category,
            rating,
            stock_quantity,
            main_image_url,
            product_images,
            product_description,
            technical_specifications,
            date_created,
            date_modified
        FROM ecommerce.Products
        WHERE id = @id AND deleted = 0;
        
        -- Return related products (same category, similar price range)
        SELECT TOP 4
            id,
            product_name,
            price,
            category,
            rating,
            main_image_url
        FROM ecommerce.Products
        WHERE category = (SELECT category FROM ecommerce.Products WHERE id = @id)
            AND id != @id
            AND deleted = 0
            AND price BETWEEN 
                (SELECT price * 0.7 FROM ecommerce.Products WHERE id = @id) AND 
                (SELECT price * 1.3 FROM ecommerce.Products WHERE id = @id)
        ORDER BY NEWID();
        
        -- Return reviews summary
        SELECT 
            COUNT(*) AS total_reviews,
            AVG(CAST(rating_stars AS FLOAT)) AS average_rating,
            SUM(CASE WHEN rating_stars = 5 THEN 1 ELSE 0 END) AS five_stars,
            SUM(CASE WHEN rating_stars = 4 THEN 1 ELSE 0 END) AS four_stars,
            SUM(CASE WHEN rating_stars = 3 THEN 1 ELSE 0 END) AS three_stars,
            SUM(CASE WHEN rating_stars = 2 THEN 1 ELSE 0 END) AS two_stars,
            SUM(CASE WHEN rating_stars = 1 THEN 1 ELSE 0 END) AS one_star
        FROM ecommerce.Product_Reviews
        WHERE product_id = @id;
        
        -- Return latest 3 reviews
        SELECT TOP 3
            r.id,
            r.rating_stars,
            r.review_comment,
            r.review_date,
            u.name AS user_name
        FROM ecommerce.Product_Reviews r
        INNER JOIN security.Users u ON r.user_id = u.id
        WHERE r.product_id = @id
        ORDER BY r.review_date DESC;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO