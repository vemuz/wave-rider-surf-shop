'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchCollections, type ShopifyCollection } from '@/lib/shopify';

const CollectionsPage = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCollections, setFilteredCollections] = useState<ShopifyCollection[]>([]);

  useEffect(() => {
    const fetchCollectionsData = async () => {
      try {
        setLoading(true);
        const data = await fetchCollections();
        setCollections(data);
        setFilteredCollections(data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionsData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = collections.filter(collection =>
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  }, [searchQuery, collections]);

  const getCollectionImage = (handle: string) => {
    // Map collection handles to representative images
    const imageMap: Record<string, string> = {
      'surfboards': 'https://ext.same-assets.com/2623672561/3270404196.jpeg',
      'new-surfboards': 'https://ext.same-assets.com/2623672561/3705052174.jpeg',
      'used-surfboards': 'https://ext.same-assets.com/2623672561/2281932006.jpeg',
      'longboard-surfboard': 'https://ext.same-assets.com/2623672561/3873134087.jpeg',
      'shortboard-surfboards': 'https://ext.same-assets.com/2623672561/3913721285.jpeg',
      'mens-surf-clothing': 'https://ext.same-assets.com/2623672561/1506430465.png',
      'womens-surf-clothing': 'https://ext.same-assets.com/2623672561/1125579468.jpeg',
      'complete-skateboards': 'https://ext.same-assets.com/2623672561/1127906608.jpeg',
      'beach-accessories': 'https://ext.same-assets.com/2623672561/2195586386.jpeg',
      'clearance': 'https://ext.same-assets.com/2623672561/1822755246.jpeg',
      'mens-surfing-wetsuits': 'https://ext.same-assets.com/2623672561/4283301873.jpeg',
      'womens-surfing-wetsuits': 'https://ext.same-assets.com/2623672561/2721568419.jpeg',
    };

    return imageMap[handle] || 'https://ext.same-assets.com/2623672561/3270404196.jpeg';
  };

  const getCollectionColor = (handle: string) => {
    // Assign colors based on category type
    if (handle.includes('surf')) return 'from-blue-500 to-blue-600';
    if (handle.includes('skate')) return 'from-orange-500 to-orange-600';
    if (handle.includes('women')) return 'from-pink-500 to-pink-600';
    if (handle.includes('men')) return 'from-green-500 to-green-600';
    if (handle.includes('clearance') || handle.includes('sale')) return 'from-red-500 to-red-600';
    if (handle.includes('wetsuit')) return 'from-purple-500 to-purple-600';
    if (handle.includes('beach')) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop All Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our complete range of surf, skate, and beach gear.
            From professional equipment to everyday essentials.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCollections.map((collection) => (
              <Card key={collection.id} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getCollectionImage(collection.handle)}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${getCollectionColor(collection.handle)} opacity-60 group-hover:opacity-40 transition-opacity`} />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {collection.description || `Discover our ${collection.title.toLowerCase()} collection featuring the latest gear and accessories.`}
                  </p>

                  <Button asChild className="w-full">
                    <Link href={`/collections/${collection.handle}`}>
                      Shop Collection
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No collections found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse all collections.
            </p>
            <Button onClick={() => setSearchQuery('')}>
              Show All Collections
            </Button>
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Surfboards', href: '/collections/surfboards', emoji: '🏄‍♂️', color: 'bg-blue-100 text-blue-700' },
              { name: 'Wetsuits', href: '/collections/mens-surfing-wetsuits', emoji: '🏄‍♀️', color: 'bg-purple-100 text-purple-700' },
              { name: 'Skateboards', href: '/collections/complete-skateboards', emoji: '🛹', color: 'bg-orange-100 text-orange-700' },
              { name: 'Beach Gear', href: '/collections/beach-accessories', emoji: '🏖️', color: 'bg-yellow-100 text-yellow-700' },
              { name: "Men's Clothing", href: '/collections/mens-surf-clothing', emoji: '👕', color: 'bg-green-100 text-green-700' },
              { name: "Women's Clothing", href: '/collections/womens-surf-clothing', emoji: '👗', color: 'bg-pink-100 text-pink-700' },
              { name: 'New Arrivals', href: '/collections/new-surfboards', emoji: '✨', color: 'bg-indigo-100 text-indigo-700' },
              { name: 'Sale Items', href: '/collections/clearance', emoji: '🏷️', color: 'bg-red-100 text-red-700' }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`${category.color} p-6 rounded-lg text-center hover:opacity-80 transition-opacity group`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {category.emoji}
                </div>
                <div className="font-semibold text-sm">
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Collection Stats */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            World's Largest Surf Selection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-red-600">{collections.length}+</div>
              <div className="text-gray-600">Collections</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">10,000+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">100+</div>
              <div className="text-gray-600">Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">40+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollectionsPage;
