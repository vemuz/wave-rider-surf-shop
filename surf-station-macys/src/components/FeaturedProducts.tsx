'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { getFeaturedProducts, formatPrice, type ShopifyProduct } from '@/lib/shopify';

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

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFeaturedProducts(12);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              New Arrivals
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Discover the latest surf gear and apparel
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
            <Link href="/collections/all">
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </Link>
          </Button>
        </div>

        {loading ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        )}

        {/* Categories quick access */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Surfboards', href: '/collections/surfboards', emoji: '🏄‍♂️' },
            { name: 'Wetsuits', href: '/collections/mens-surfing-wetsuits', emoji: '🏄‍♀️' },
            { name: 'Skateboards', href: '/collections/complete-skateboards', emoji: '🛹' },
            { name: 'Beach Gear', href: '/collections/beach-accessories', emoji: '🏖️' }
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-4xl mb-2">{category.emoji}</span>
              <span className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
