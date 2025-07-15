'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, User, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from '@/components/CartSidebar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, toggleCart } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search triggered with query:', searchQuery); // Debug log
    if (searchQuery.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      console.log('Navigating to:', searchUrl); // Debug log
      router.push(searchUrl);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top promotional banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto">
          <div className="hidden sm:flex items-center justify-center space-x-6">
            <span>🏄‍♂️ Free shipping on orders $75+</span>
            <span>🏄‍♀️ Up to 60% off summer gear</span>
            <span>🛹 New arrivals daily</span>
          </div>
          <div className="sm:hidden">
            <span>🏄‍♂️ Free shipping $75+ • 🏄‍♀️ Up to 60% off</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 fill-current" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900 ml-1">scrole</span>
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Sign In</span>
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex items-center space-x-1">
              <Heart className="h-5 w-5" />
              <span className="hidden md:inline">Favorites</span>
            </Button>

            <CartSidebar>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="hidden md:inline">Bag</span>
                {state.totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.totalQuantity}
                  </span>
                )}
              </Button>
            </CartSidebar>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4">
              <div className="space-y-4">
                <Link href="/collections/new-surfboards" className="block text-gray-900 font-medium">Surf</Link>
                <Link href="/collections/mens-clothing-t-shirts-ss" className="block text-gray-900 font-medium">Men</Link>
                <Link href="/collections/womens-clothing-shirts-ss" className="block text-gray-900 font-medium">Women</Link>
                <Link href="/collections/complete-skateboards" className="block text-gray-900 font-medium">Skate</Link>
                <Link href="/collections/youth-boys-surf-clothing" className="block text-gray-900 font-medium">Kids</Link>
                <Link href="/collections/beach-accessories" className="block text-gray-900 font-medium">Beach Gear</Link>
                <Link href="/collections/clearance" className="block text-red-600 font-medium">Sale</Link>
                <Link href="/brands" className="block text-gray-900 font-medium">Brands</Link>
                <hr className="my-4" />
                <Link href="#" className="block text-gray-900">Sign In</Link>
                <Link href="#" className="block text-gray-900">Favorites</Link>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop navigation menu */}
        <div className="hidden md:block border-t border-gray-200">
          <NavigationMenu className="max-w-none">
            <NavigationMenuList className="flex space-x-8 py-3">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-900 hover:text-red-600 font-medium">
                  Surf
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[800px] grid-cols-4">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Surfboards</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/new-surfboards">New Surfboards</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/used-surfboards">Used Surfboards</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/longboard-surfboard">Longboards</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/shortboard-surfboards">Shortboards</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/fish-surfboards">Fish</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Gear</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/surfboard-fins">Fins</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/surfboard-leashes">Leashes</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/surfboard-wax">Wax</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/surfboard-bags">Board Bags</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Wetsuits</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/mens-fullsuit-wetsuits">Men's Fullsuits</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-fullsuits">Women's Fullsuits</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/wetsuits-mens-springsuits">Spring Suits</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Brands</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/brands/channel-islands">Channel Islands</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/brands/lost">Lost</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/brands/firewire">Firewire</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/brands/torq">Torq</NavigationMenuLink></li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-900 hover:text-red-600 font-medium">
                  Men
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Clothing</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/mens-clothing-t-shirts-ss">T-Shirts</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-clothing-hoodies">Hoodies</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-clothing-walkshorts">Shorts</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-clothing-jeans">Jeans</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Swimwear</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/mens-swimwear-boardshorts">Boardshorts</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-swimwear-rashguards">Rashguards</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Accessories</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/mens-sunglasses">Sunglasses</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-accessories-hats">Hats</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/mens-footwear-sandals">Sandals</NavigationMenuLink></li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-900 hover:text-red-600 font-medium">
                  Women
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Clothing</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/womens-clothing-shirts-ss">T-Shirts</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-clothing-hoodies">Hoodies</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-clothing-dresses">Dresses</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-clothing-shorts">Shorts</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Swimwear</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/womens-swimwear-bikinis">Bikinis</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-swimwear-one-piece">One-Piece</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-swimwear-rashguards">Rashguards</NavigationMenuLink></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-900">Accessories</h3>
                      <ul className="space-y-2 text-sm">
                        <li><NavigationMenuLink href="/collections/womens-sunglasses">Sunglasses</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-accessories-hats">Hats</NavigationMenuLink></li>
                        <li><NavigationMenuLink href="/collections/womens-footwear-sandals">Sandals</NavigationMenuLink></li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/collections/complete-skateboards" className="text-gray-900 hover:text-red-600 font-medium">
                  Skate
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/collections/youth-boys-surf-clothing" className="text-gray-900 hover:text-red-600 font-medium">
                  Kids
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/collections/beach-accessories" className="text-gray-900 hover:text-red-600 font-medium">
                  Beach Gear
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/collections/clearance" className="text-red-600 hover:text-red-700 font-medium">
                  Sale
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/brands" className="text-gray-900 hover:text-red-600 font-medium">
                  Brands
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
