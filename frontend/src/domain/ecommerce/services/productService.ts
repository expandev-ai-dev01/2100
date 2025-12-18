/**
 * @summary
 * Product service with mock data.
 * Simulates product catalog, search, and details.
 *
 * @service productService
 * @domain ecommerce
 */

import type { Product, ProductFilters, Review } from '../types/models';

const categories = ['Eletrônicos', 'Roupas', 'Casa & Jardim', 'Livros', 'Esportes'] as const;

const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const names = {
    Eletrônicos: ['Smartphone', 'Notebook', 'Tablet', 'Fone de Ouvido', 'Smartwatch'],
    Roupas: ['Camiseta', 'Calça Jeans', 'Jaqueta', 'Vestido', 'Tênis'],
    'Casa & Jardim': ['Sofá', 'Mesa', 'Cadeira', 'Luminária', 'Tapete'],
    Livros: ['Romance', 'Ficção Científica', 'Biografia', 'Autoajuda', 'Técnico'],
    Esportes: ['Bola', 'Raquete', 'Bicicleta', 'Patins', 'Halteres'],
  };

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const nameBase = names[category][Math.floor(i / categories.length) % names[category].length];
    const stock =
      Math.random() < 0.2 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 50) + 10;

    let badge_type: 'available' | 'limited' | 'unavailable' = 'available';
    let badge_text = '';
    let badge_color = 'transparent';

    if (stock === 0) {
      badge_type = 'unavailable';
      badge_text = 'Indisponível';
      badge_color = 'red';
    } else if (stock <= 5) {
      badge_type = 'limited';
      badge_text = 'Últimas unidades';
      badge_color = 'orange';
    }

    const images = Array.from(
      { length: Math.floor(Math.random() * 6) + 3 },
      (_, idx) => `https://picsum.photos/seed/${i}-${idx}/800/600`
    );

    products.push({
      product_id: `prod-${i + 1}`,
      product_name: `${nameBase} ${Math.floor(i / categories.length) + 1}`,
      price: Math.floor(Math.random() * 2000) + 50,
      category,
      rating: Math.floor(Math.random() * 20 + 30) / 10,
      stock_quantity: stock,
      main_image_url: images[0],
      product_images: images,
      stock_badge_type: badge_type,
      stock_badge_text: badge_text,
      stock_badge_color: badge_color,
      product_description: `Descrição detalhada do produto ${nameBase}. Este é um excelente produto com características premium e qualidade garantida.`,
      technical_specifications: {
        Marca: 'Premium Brand',
        Modelo: `${nameBase}-${i + 1}`,
        Garantia: '12 meses',
        Origem: 'Nacional',
        Peso: `${Math.floor(Math.random() * 5) + 1}kg`,
      },
    });
  }

  return products;
};

let mockProducts = generateMockProducts(80);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  async list(filters?: ProductFilters): Promise<Product[]> {
    await delay(500);

    let filtered = [...mockProducts];

    if (filters?.search && filters.search.length >= 2) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.product_name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters?.min_price !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.min_price!);
    }

    if (filters?.max_price !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.max_price!);
    }

    if (filters?.min_rating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= filters.min_rating!);
    }

    return filtered;
  },

  async getById(id: string): Promise<Product | null> {
    await delay(300);
    return mockProducts.find((p) => p.product_id === id) || null;
  },

  async getRelated(productId: string): Promise<Product[]> {
    await delay(400);
    const product = mockProducts.find((p) => p.product_id === productId);
    if (!product) return [];

    return mockProducts
      .filter(
        (p) =>
          p.product_id !== productId &&
          p.category === product.category &&
          Math.abs(p.price - product.price) <= product.price * 0.3
      )
      .slice(0, 4);
  },

  async getReviews(productId: string): Promise<Review[]> {
    await delay(300);
    const names = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Souza'];
    const comments = [
      'Produto excelente, recomendo!',
      'Muito bom, atendeu minhas expectativas.',
      'Qualidade superior, vale a pena.',
      'Entrega rápida e produto conforme descrito.',
      'Ótimo custo-benefício.',
    ];

    return Array.from({ length: 5 }, (_, i) => ({
      review_id: `rev-${productId}-${i}`,
      product_id: productId,
      user_name: names[i],
      rating_stars: Math.floor(Math.random() * 2) + 4,
      review_comment: Math.random() > 0.3 ? comments[i] : undefined,
      review_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  },
};
