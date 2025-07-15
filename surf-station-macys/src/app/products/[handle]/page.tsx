'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  fetchProduct,
  formatPrice,
  getDiscountPercentage,
  type ShopifyProduct,
  type ShopifyVariant
} from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

const ProductPage = () => {
  const params = useParams();
  const handle = params.handle as string;
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Mock reviews data - in a real app, this would come from an API
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      author: "Alex R.",
      rating: 5,
      date: "2024-01-15",
      title: "Amazing quality!",
      content: "This product exceeded my expectations. The build quality is excellent and it performs exactly as advertised. Highly recommend!",
      verified: true
    },
    {
      id: 2,
      author: "Sarah M.",
      rating: 4,
      date: "2024-01-10",
      title: "Great value for money",
      content: "Really happy with this purchase. Good quality and fast shipping. Only minor issue is the color was slightly different than expected.",
      verified: true
    },
    {
      id: 3,
      author: "Mike T.",
      rating: 5,
      date: "2024-01-05",
      title: "Perfect for beginners",
      content: "As someone new to this sport, this was exactly what I needed. Great for learning and the customer service was excellent.",
      verified: false
    }
  ]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchProduct(handle);
        if (data) {
          setProduct(data);
          setSelectedVariant(data.variants[0]);

          // Initialize selected options
          const initialOptions: Record<string, string> = {};
          data.options.forEach((option, index) => {
            if (data.variants[0]) {
              const optionKey = `option${index + 1}` as keyof ShopifyVariant;
              const value = data.variants[0][optionKey] as string;
              if (value) {
                initialOptions[option.name] = value;
              }
            }
          });
          setSelectedOptions(initialOptions);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      fetchProductData();
    }
  }, [handle]);

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    // Find matching variant
    const matchingVariant = product?.variants.find(variant => {
      return product.options.every((option, index) => {
        const optionKey = `option${index + 1}` as keyof ShopifyVariant;
        const variantValue = variant[optionKey] as string;
        return variantValue === newOptions[option.name];
      });
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;

    addItem(product, selectedVariant, quantity);
    openCart();
  };

  const hasDiscount = selectedVariant?.compare_at_price &&
    parseFloat(selectedVariant.compare_at_price) > parseFloat(selectedVariant.price);

  const discountPercent = hasDiscount
    ? getDiscountPercentage(selectedVariant.price, selectedVariant.compare_at_price!)
    : 0;

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-12 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-32 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/collections">Browse Collections</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.images[selectedImage] && (
                <img
                  src={product.images[selectedImage].src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded border-2 ${
                      selectedImage === index ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">{product.vendor}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              {/* Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className={`text-3xl font-bold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatPrice(selectedVariant?.price || '0')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(selectedVariant?.compare_at_price || '0')}
                    </span>
                    <Badge className="bg-red-600 text-white">
                      Save {discountPercent}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              {selectedVariant?.available ? (
                <Badge className="bg-green-100 text-green-800 mb-6">
                  ✓ In Stock
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 mb-6">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Product Options */}
            {product.options.map((option) => (
              <div key={option.name}>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {option.name}
                </label>
                <Select
                  value={selectedOptions[option.name] || ''}
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${option.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.available}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart - {formatPrice(selectedVariant?.price || '0')}
              </Button>

              <Button variant="outline" size="lg" className="w-full">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Free shipping $75+</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Easy returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">2-year warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.body_html }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Customer Reviews</h3>
                      <Button>Write a Review</Button>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-600">Based on {reviews.length} reviews</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{review.author}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-600">{review.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Free shipping on orders over $75</li>
                        <li>• Standard shipping: 3-7 business days</li>
                        <li>• Express shipping: 1-3 business days</li>
                        <li>• International shipping available</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Returns & Exchanges</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• 30-day return policy</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free return shipping for defective items</li>
                        <li>• Easy online return process</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
