'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { searchProducts, formatPrice, type ShopifyProduct } from '@/lib/shopify';

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

        {/* Heart icon for favorites */}
        <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10">
          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Sale badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white text-xs sm:text-sm z-10">
            Sale
          </Badge>
        )}

        {/* Quick shop button - hidden on mobile for better UX */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button asChild className="w-full bg-white text-black hover:bg-gray-100">
            <Link href={`/products/${product.handle}`}>
              Quick Shop
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-1 sm:mb-2">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">{product.vendor}</p>
        </div>

        <Link
          href={`/products/${product.handle}`}
          className="block hover:text-red-600 transition-colors"
        >
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2 text-sm sm:text-base">
            {product.title}
          </h3>
        </Link>

        {/* Star rating placeholder */}
        <div className="flex items-center mb-1 sm:mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-1 sm:ml-2">(1)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              {formatPrice(mainVariant?.price || '0')}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(mainVariant?.compare_at_price || '0')}
              </span>
            )}
          </div>

          {mainVariant?.available && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 px-1 py-0.5">
              In Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Search className="h-6 w-6 text-gray-600 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>

          {query && (
            <div className="flex items-center text-gray-600">
              <span className="text-sm sm:text-base">
                Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
              </span>
              {!loading && (
                <span className="ml-4 text-sm text-gray-500">
                  {products.length} {products.length === 1 ? 'result' : 'results'} found
                </span>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Search
            </h2>
            <p className="text-gray-600 mb-6">
              Enter keywords to find surfboards, wetsuits, and beach gear
            </p>
            <Button asChild>
              <Link href="/">Browse All Products</Link>
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Show more results suggestion */}
            {products.length >= 50 && (
              <div className="text-center mt-12 p-6 bg-white rounded-lg border">
                <p className="text-gray-600 mb-4">
                  Showing top 50 results. Try refining your search for more specific results.
                </p>
                <Button asChild variant="outline">
                  <Link href="/collections">Browse All Categories</Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border p-8">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/collections">Browse Categories</Link>
                </Button>
                <Button asChild>
                  <Link href="/collections/clearance">Shop Sale Items</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
