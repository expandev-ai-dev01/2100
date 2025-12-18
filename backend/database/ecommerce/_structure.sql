-- =============================================
-- E-commerce Schema Structure
-- Feature: Fluxos de E-commerce
-- =============================================

-- Create schema if not exists
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'ecommerce')
BEGIN
    EXEC('CREATE SCHEMA ecommerce')
END
GO

-- =============================================
-- Table: ecommerce.Products
-- Description: Stores product catalog information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Products') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL CHECK (price > 0),
        category VARCHAR(50) NOT NULL CHECK (category IN ('Eletrônicos', 'Roupas', 'Casa & Jardim', 'Livros', 'Esportes')),
        rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
        stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
        main_image_url VARCHAR(500) NOT NULL,
        product_images NVARCHAR(MAX) NOT NULL, -- JSON array of image URLs
        product_description NVARCHAR(1000) NOT NULL,
        technical_specifications NVARCHAR(MAX) NOT NULL, -- JSON object
        date_created DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        date_modified DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        deleted BIT NOT NULL DEFAULT 0
    )

    CREATE INDEX IX_Products_Category ON ecommerce.Products(category)
    CREATE INDEX IX_Products_Rating ON ecommerce.Products(rating)
    CREATE INDEX IX_Products_StockQuantity ON ecommerce.Products(stock_quantity)
    CREATE INDEX IX_Products_Deleted ON ecommerce.Products(deleted)
END
GO

-- =============================================
-- Table: ecommerce.Product_Reviews
-- Description: Stores product reviews and ratings
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Product_Reviews') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Product_Reviews (
        id INT IDENTITY(1,1) PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        rating_stars INT NOT NULL CHECK (rating_stars >= 1 AND rating_stars <= 5),
        review_comment NVARCHAR(500) NULL,
        review_date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_ProductReviews_Products FOREIGN KEY (product_id) REFERENCES ecommerce.Products(id),
        CONSTRAINT FK_ProductReviews_Users FOREIGN KEY (user_id) REFERENCES security.Users(id),
        CONSTRAINT UQ_ProductReviews_UserProduct UNIQUE (product_id, user_id)
    )

    CREATE INDEX IX_ProductReviews_ProductId ON ecommerce.Product_Reviews(product_id)
    CREATE INDEX IX_ProductReviews_UserId ON ecommerce.Product_Reviews(user_id)
END
GO

-- =============================================
-- Table: ecommerce.Carts
-- Description: Stores shopping cart sessions
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Carts') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Carts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Carts_Users FOREIGN KEY (user_id) REFERENCES security.Users(id)
    )

    CREATE INDEX IX_Carts_UserId ON ecommerce.Carts(user_id)
END
GO

-- =============================================
-- Table: ecommerce.Cart_Items
-- Description: Stores items in shopping carts
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Cart_Items') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Cart_Items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 10),
        unit_price DECIMAL(10,2) NOT NULL,
        added_at DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_CartItems_Carts FOREIGN KEY (cart_id) REFERENCES ecommerce.Carts(id) ON DELETE CASCADE,
        CONSTRAINT FK_CartItems_Products FOREIGN KEY (product_id) REFERENCES ecommerce.Products(id)
    )

    CREATE INDEX IX_CartItems_CartId ON ecommerce.Cart_Items(cart_id)
    CREATE INDEX IX_CartItems_ProductId ON ecommerce.Cart_Items(product_id)
END
GO

-- =============================================
-- Table: ecommerce.Coupons
-- Description: Stores discount coupons
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Coupons') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Coupons (
        id INT IDENTITY(1,1) PRIMARY KEY,
        coupon_code VARCHAR(12) NOT NULL UNIQUE,
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL,
        minimum_order_value DECIMAL(10,2) NULL,
        expiry_date DATETIME2 NOT NULL,
        usage_limit INT NULL,
        usage_count INT NOT NULL DEFAULT 0,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    )

    CREATE INDEX IX_Coupons_Code ON ecommerce.Coupons(coupon_code)
    CREATE INDEX IX_Coupons_Active ON ecommerce.Coupons(active)
END
GO

-- =============================================
-- Table: ecommerce.Orders
-- Description: Stores order information
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Orders') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Orders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_number VARCHAR(20) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        delivery_address NVARCHAR(MAX) NOT NULL, -- JSON object
        delivery_option VARCHAR(20) NOT NULL CHECK (delivery_option IN ('Normal', 'Expressa', 'Agendada')),
        delivery_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
        payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Boleto')),
        payment_status VARCHAR(20) NOT NULL DEFAULT 'Processando' CHECK (payment_status IN ('Processando', 'Aprovado', 'Recusado', 'Erro')),
        payment_id VARCHAR(255) NULL,
        authorization_code VARCHAR(8) NULL,
        coupon_id INT NULL,
        discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        subtotal DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        order_status VARCHAR(20) NOT NULL DEFAULT 'Aguardando Pagamento' CHECK (order_status IN ('Aguardando Pagamento', 'Pago', 'Preparando', 'Enviado', 'Entregue', 'Cancelado')),
        tracking_code VARCHAR(13) NULL,
        estimated_delivery DATE NULL,
        order_date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id) REFERENCES security.Users(id),
        CONSTRAINT FK_Orders_Coupons FOREIGN KEY (coupon_id) REFERENCES ecommerce.Coupons(id)
    )

    CREATE INDEX IX_Orders_UserId ON ecommerce.Orders(user_id)
    CREATE INDEX IX_Orders_OrderNumber ON ecommerce.Orders(order_number)
    CREATE INDEX IX_Orders_OrderStatus ON ecommerce.Orders(order_status)
    CREATE INDEX IX_Orders_OrderDate ON ecommerce.Orders(order_date)
END
GO

-- =============================================
-- Table: ecommerce.Order_Items
-- Description: Stores items in orders
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Order_Items') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Order_Items (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id) REFERENCES ecommerce.Orders(id) ON DELETE CASCADE,
        CONSTRAINT FK_OrderItems_Products FOREIGN KEY (product_id) REFERENCES ecommerce.Products(id)
    )

    CREATE INDEX IX_OrderItems_OrderId ON ecommerce.Order_Items(order_id)
    CREATE INDEX IX_OrderItems_ProductId ON ecommerce.Order_Items(product_id)
END
GO

-- =============================================
-- Table: ecommerce.Order_Tracking
-- Description: Stores order tracking timeline
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Order_Tracking') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Order_Tracking (
        id INT IDENTITY(1,1) PRIMARY KEY,
        order_id INT NOT NULL,
        status VARCHAR(20) NOT NULL,
        location VARCHAR(200) NULL,
        description NVARCHAR(500) NOT NULL,
        timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_OrderTracking_Orders FOREIGN KEY (order_id) REFERENCES ecommerce.Orders(id) ON DELETE CASCADE
    )

    CREATE INDEX IX_OrderTracking_OrderId ON ecommerce.Order_Tracking(order_id)
    CREATE INDEX IX_OrderTracking_Timestamp ON ecommerce.Order_Tracking(timestamp)
END
GO

-- =============================================
-- Table: ecommerce.Wishlists
-- Description: Stores user wishlists
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'ecommerce.Wishlists') AND type = 'U')
BEGIN
    CREATE TABLE ecommerce.Wishlists (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        added_date DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Wishlists_Users FOREIGN KEY (user_id) REFERENCES security.Users(id) ON DELETE CASCADE,
        CONSTRAINT FK_Wishlists_Products FOREIGN KEY (product_id) REFERENCES ecommerce.Products(id),
        CONSTRAINT UQ_Wishlists_UserProduct UNIQUE (user_id, product_id)
    )

    CREATE INDEX IX_Wishlists_UserId ON ecommerce.Wishlists(user_id)
    CREATE INDEX IX_Wishlists_ProductId ON ecommerce.Wishlists(product_id)
END
GO

-- =============================================
-- Trigger: Update date_modified on Products table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Products_UpdateTimestamp')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Products_UpdateTimestamp
    ON ecommerce.Products
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE ecommerce.Products
        SET date_modified = GETUTCDATE()
        FROM ecommerce.Products p
        INNER JOIN inserted i ON p.id = i.id
    END
    ')
END
GO

-- =============================================
-- Trigger: Update updated_at on Carts table
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Carts_UpdateTimestamp')
BEGIN
    EXEC('
    CREATE TRIGGER TR_Carts_UpdateTimestamp
    ON ecommerce.Carts
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE ecommerce.Carts
        SET updated_at = GETUTCDATE()
        FROM ecommerce.Carts c
        INNER JOIN inserted i ON c.id = i.id
    END
    ')
END
GO