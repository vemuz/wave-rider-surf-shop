'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Heart, Grid, List, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  fetchProductsByCollection,
  formatPrice,
  getDiscountPercentage,
  type ShopifyProduct
} from '@/lib/shopify';

const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const mainVariant = product.variants[0];
  const mainImage = product.images[0];
  const hasDiscount = mainVariant?.compare_at_price &&
    parseFloat(mainVariant.compare_at_price) > parseFloat(mainVariant.price);

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.handle}`} className="block w-full h-full">
          {mainImage && (
            <img
              src={mainImage.src}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </Link>

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>

        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white z-10">
            {getDiscountPercentage(mainVariant.price, mainVariant.compare_at_price!)}% OFF
          </Badge>
        )}

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button asChild className="w-full bg-white text-black hover:bg-gray-100">
            <Link href={`/products/${product.handle}`}>
              Quick Shop
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-600 font-medium">{product.vendor}</p>
        </div>

        <Link
          href={`/products/${product.handle}`}
          className="block hover:text-red-600 transition-colors"
        >
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">(1)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
              {formatPrice(mainVariant?.price || '0')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(mainVariant?.compare_at_price || '0')}
              </span>
            )}
          </div>

          {mainVariant?.available ? (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              In Stock
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-red-600 border-red-200">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CollectionPage = () => {
  const params = useParams();
  const handle = params.handle as string;

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductsByCollection(handle, 250);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchProducts();
    }
  }, [handle]);

  useEffect(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) =>
          parseFloat(a.variants[0]?.price || '0') - parseFloat(b.variants[0]?.price || '0')
        );
        break;
      case 'price-high':
        sorted.sort((a, b) =>
          parseFloat(b.variants[0]?.price || '0') - parseFloat(a.variants[0]?.price || '0')
        );
        break;
      case 'newest':
        sorted.sort((a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) =>
          new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
        );
        break;
      case 'name-az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // featured - keep original order
        break;
    }

    setFilteredProducts(sorted);
  }, [products, sortBy]);

  const getCollectionTitle = (handle: string) => {
    return handle
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/" className="text-gray-600 hover:text-red-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/collections" className="text-gray-600 hover:text-red-600">Collections</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{getCollectionTitle(handle)}</span>
        </nav>

        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getCollectionTitle(handle)}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading products...' : `${filteredProducts.length} products`}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
                <SelectItem value="name-za">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found in this collection.</p>
            <Button asChild>
              <Link href="/collections">Browse All Collections</Link>
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && !loading && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CollectionPage;
