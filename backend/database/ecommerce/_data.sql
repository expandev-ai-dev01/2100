-- =============================================
-- E-commerce Schema Seed Data
-- Feature: Fluxos de E-commerce
-- =============================================

BEGIN TRANSACTION;

BEGIN TRY
    -- Insert test coupons (only if table is empty)
    IF NOT EXISTS (SELECT 1 FROM ecommerce.Coupons)
    BEGIN
        INSERT INTO ecommerce.Coupons (coupon_code, discount_type, discount_value, minimum_order_value, expiry_date, usage_limit)
        VALUES 
            ('DESCONTO10', 'percentage', 10.00, 100.00, DATEADD(MONTH, 6, GETUTCDATE()), 100),
            ('FRETE15', 'fixed', 15.00, 50.00, DATEADD(MONTH, 3, GETUTCDATE()), 50),
            ('BEMVINDO20', 'percentage', 20.00, 200.00, DATEADD(YEAR, 1, GETUTCDATE()), NULL);
        
        PRINT 'Test coupons created successfully';
    END
    ELSE
    BEGIN
        PRINT 'Coupons table already contains data - skipping seed data';
    END
    
    -- Insert test products (only if table is empty)
    IF NOT EXISTS (SELECT 1 FROM ecommerce.Products)
    BEGIN
        DECLARE @i INT = 1;
        DECLARE @maxProducts INT = 60;
        DECLARE @categories TABLE (category VARCHAR(50));
        
        INSERT INTO @categories VALUES ('Eletrônicos'), ('Roupas'), ('Casa & Jardim'), ('Livros'), ('Esportes');
        
        WHILE @i <= @maxProducts
        BEGIN
            DECLARE @randomCategory VARCHAR(50);
            DECLARE @randomRating DECIMAL(2,1) = CAST((RAND() * 4 + 1) AS DECIMAL(2,1));
            DECLARE @randomPrice DECIMAL(10,2) = CAST((RAND() * 900 + 100) AS DECIMAL(10,2));
            DECLARE @randomStock INT;
            
            -- 20% of products have limited stock (1-5)
            IF RAND() < 0.2
                SET @randomStock = FLOOR(RAND() * 5) + 1;
            ELSE
                SET @randomStock = FLOOR(RAND() * 50) + 10;
            
            SELECT TOP 1 @randomCategory = category FROM @categories ORDER BY NEWID();
            
            DECLARE @productImages NVARCHAR(MAX) = '[
                "https://via.placeholder.com/600x400/0066cc/ffffff?text=Product+' + CAST(@i AS VARCHAR(10)) + '+Image+1",
                "https://via.placeholder.com/600x400/0066cc/ffffff?text=Product+' + CAST(@i AS VARCHAR(10)) + '+Image+2",
                "https://via.placeholder.com/600x400/0066cc/ffffff?text=Product+' + CAST(@i AS VARCHAR(10)) + '+Image+3"
            ]';
            
            DECLARE @techSpecs NVARCHAR(MAX) = '{
                "Marca": "Marca ' + CAST(@i AS VARCHAR(10)) + '",
                "Modelo": "Modelo ' + CAST(@i AS VARCHAR(10)) + '",
                "Garantia": "12 meses",
                "Origem": "Nacional"
            }';
            
            INSERT INTO ecommerce.Products (
                product_name, 
                price, 
                category, 
                rating, 
                stock_quantity, 
                main_image_url, 
                product_images,
                product_description,
                technical_specifications
            )
            VALUES (
                'Produto ' + CAST(@i AS VARCHAR(10)),
                @randomPrice,
                @randomCategory,
                @randomRating,
                @randomStock,
                'https://via.placeholder.com/600x400/0066cc/ffffff?text=Product+' + CAST(@i AS VARCHAR(10)),
                @productImages,
                'Descrição detalhada do produto ' + CAST(@i AS VARCHAR(10)) + '. Este é um excelente produto da categoria ' + @randomCategory + ' com ótima qualidade e durabilidade.',
                @techSpecs
            );
            
            SET @i = @i + 1;
        END
        
        PRINT 'Test products created successfully';
    END
    ELSE
    BEGIN
        PRINT 'Products table already contains data - skipping seed data';
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