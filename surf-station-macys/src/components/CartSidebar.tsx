'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { X, Plus, Minus, Truck, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/shopify';

const CartSidebar = ({ children }: { children: React.ReactNode }) => {
  const { state, removeItem, updateQuantity, clearCart, closeCart } = useCart();

  const handleCheckout = () => {
    // In a real app, this would redirect to Shopify checkout or payment processor
    alert('Redirecting to checkout...');
  };

  const freeShippingThreshold = 75;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - state.totalPrice);

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">
              Shopping Cart ({state.totalQuantity})
            </SheetTitle>
          </div>

          {/* Free shipping progress */}
          {remainingForFreeShipping > 0 ? (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-blue-700 mb-2">
                <Truck className="h-4 w-4 mr-2" />
                <span>Add {formatPrice(remainingForFreeShipping.toString())} for FREE shipping!</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (state.totalPrice / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-green-700">
                <Truck className="h-4 w-4 mr-2" />
                <span>✓ You qualify for FREE shipping!</span>
              </div>
            </div>
          )}
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Button asChild onClick={closeCart}>
                <Link href="/collections">
                  Start Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <Link
                    href={`/products/${item.product.handle}`}
                    onClick={closeCart}
                    className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden block"
                  >
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0].src}
                        alt={item.product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.handle}`}
                      onClick={closeCart}
                      className="font-medium text-sm text-gray-900 hover:text-red-600 line-clamp-2"
                    >
                      {item.product.title}
                    </Link>

                    <p className="text-xs text-gray-600 mt-1">
                      {item.variant.title !== 'Default Title' && item.variant.title}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice((parseFloat(item.variant.price) * item.quantity).toString())}
                        </p>
                        {item.variant.compare_at_price && parseFloat(item.variant.compare_at_price) > parseFloat(item.variant.price) && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice((parseFloat(item.variant.compare_at_price) * item.quantity).toString())}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {state.items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal:</span>
              <span>{formatPrice(state.totalPrice.toString())}</span>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Checkout - {formatPrice(state.totalPrice.toString())}
              </Button>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/cart" onClick={closeCart}>
                  View Full Cart
                </Link>
              </Button>
            </div>

            {/* Clear Cart */}
            <Button
              variant="ghost"
              onClick={clearCart}
              className="w-full text-sm text-gray-600 hover:text-red-600"
            >
              Clear Cart
            </Button>

            {/* Security Badge */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Checkout
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
