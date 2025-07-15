'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';
import { getSaleProducts, formatPrice, getDiscountPercentage, type ShopifyProduct } from '@/lib/shopify';

const SaleProductCard = ({ product }: { product: ShopifyProduct }) => {
  const mainVariant = product.variants.find(v =>
    v.compare_at_price && parseFloat(v.compare_at_price) > parseFloat(v.price)
  ) || product.variants[0];

  const mainImage = product.images[0];
  const discountPercent = mainVariant?.compare_at_price
    ? getDiscountPercentage(mainVariant.price, mainVariant.compare_at_price)
    : 0;

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

        {/* Discount badge */}
        {discountPercent > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold z-10">
            {discountPercent}% OFF
          </Badge>
        )}

        {/* Sale tag */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold z-10">
          SALE
        </div>

        {/* Quick shop overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button asChild className="w-full bg-white text-black hover:bg-gray-100">
              <Link href={`/products/${product.handle}`}>
                Quick Shop
              </Link>
            </Button>
          </div>
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

        {/* Star rating */}
        <div className="flex items-center mb-3">
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

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-red-600 text-lg">
              {formatPrice(mainVariant?.price || '0')}
            </span>
            {mainVariant?.compare_at_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(mainVariant.compare_at_price)}
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        {mainVariant?.available ? (
          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
            In Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-red-600 border-red-200">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const SaleSection = () => {
  const [saleProducts, setSaleProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const data = await getSaleProducts(8);
        setSaleProducts(data);
      } catch (error) {
        console.error('Failed to fetch sale products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Sale header with Macy's inspiration */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 px-6 rounded-lg mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 mr-2" />
              <span className="text-sm font-semibold uppercase tracking-wide">Limited Time</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              Clearance 40-70%
              <span className="block text-yellow-300">OFF</span>
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Get it before it's gone!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Surfboards', 'Wetsuits', 'Clothing', 'Gear', 'Shop All'].map((item) => (
                <Button
                  key={item}
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                >
                  <Link href={item === 'Shop All' ? '/collections/clearance' : `/collections/clearance-${item.toLowerCase()}`}>
                    {item}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sale products grid */}
        {loading ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
              <div className="h-10 bg-gray-200 animate-pulse rounded w-32" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
          </>
        ) : saleProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Shop Clearance Now
              </h3>
              <Button asChild variant="outline">
                <Link href="/collections/clearance">
                  View All Sale Items
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <SaleProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Additional sale categories */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Surfboard Sale",
                  description: "New & used boards at unbeatable prices",
                  href: "/collections/clearance-surfboards-sale",
                  bgColor: "bg-blue-600"
                },
                {
                  title: "Wetsuit Clearance",
                  description: "Stay warm for less with discounted wetsuits",
                  href: "/collections/clearance-wetsuits",
                  bgColor: "bg-green-600"
                },
                {
                  title: "Apparel Sale",
                  description: "Surf and skate clothing at reduced prices",
                  href: "/collections/clearance-mens-clothing",
                  bgColor: "bg-orange-600"
                }
              ].map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className={`${category.bgColor} text-white p-6 rounded-lg hover:opacity-90 transition-opacity group`}
                >
                  <h4 className="text-xl font-bold mb-2">{category.title}</h4>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold group-hover:underline">
                    Shop Now →
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Sale Items Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for amazing deals on surf and skate gear!
            </p>
            <Button asChild>
              <Link href="/collections/all">
                Browse All Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SaleSection;
