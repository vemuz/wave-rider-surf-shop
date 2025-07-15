// Shopify API client for Surf Station Store
const SHOPIFY_STORE_URL = 'https://www.surfstationstore.com';

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options: ShopifyOption[];
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ShopifyVariant {
  id: number;
  title: string;
  option1?: string;
  option2?: string;
  option3?: string;
  sku: string;
  price: string;
  compare_at_price?: string;
  available: boolean;
  featured_image?: ShopifyImage;
  grams: number;
}

export interface ShopifyImage {
  id: number;
  src: string;
  alt?: string;
  width: number;
  height: number;
  position: number;
}

export interface ShopifyOption {
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyCollection {
  id: number;
  handle: string;
  title: string;
  description: string;
  published_at: string;
  sort_order: string;
  template_suffix: string;
  disjunctive: boolean;
  rules: unknown[];
  published_scope: string;
  admin_graphql_api_id: string;
}

// Fetch all products
export async function fetchProducts(limit = 250): Promise<ShopifyProduct[]> {
  try {
    const response = await fetch(`${SHOPIFY_STORE_URL}/products.json?limit=${limit}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by collection
export async function fetchProductsByCollection(collectionHandle: string, limit = 250): Promise<ShopifyProduct[]> {
  try {
    const response = await fetch(`${SHOPIFY_STORE_URL}/collections/${collectionHandle}/products.json?limit=${limit}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products for collection: ${collectionHandle}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error(`Error fetching products for collection ${collectionHandle}:`, error);
    return [];
  }
}

// Fetch single product
export async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const response = await fetch(`${SHOPIFY_STORE_URL}/products/${handle}.json`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${handle}`);
    }

    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

// Fetch collections
export async function fetchCollections(limit = 250): Promise<ShopifyCollection[]> {
  try {
    const response = await fetch(`${SHOPIFY_STORE_URL}/collections.json?limit=${limit}`, {
      next: { revalidate: 600 } // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }

    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

// Search products
export async function searchProducts(query: string, limit = 50): Promise<ShopifyProduct[]> {
  try {
    const allProducts = await fetchProducts(250);
    const searchTerm = query.toLowerCase();

    return allProducts
      .filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        product.product_type.toLowerCase().includes(searchTerm) ||
        product.vendor.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Get featured products (new arrivals)
export async function getFeaturedProducts(limit = 12): Promise<ShopifyProduct[]> {
  try {
    const products = await fetchProducts(50);
    // Sort by published date (newest first) and return limited results
    return products
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Get sale products (products with compare_at_price)
export async function getSaleProducts(limit = 12): Promise<ShopifyProduct[]> {
  try {
    const products = await fetchProducts(100);
    return products
      .filter(product =>
        product.variants.some(variant =>
          variant.compare_at_price &&
          parseFloat(variant.compare_at_price) > parseFloat(variant.price)
        )
      )
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }
}

// Utility function to format price
export function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numPrice);
}

// Utility function to calculate discount percentage
export function getDiscountPercentage(price: string, comparePrice: string): number {
  const originalPrice = parseFloat(comparePrice);
  const salePrice = parseFloat(price);
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
