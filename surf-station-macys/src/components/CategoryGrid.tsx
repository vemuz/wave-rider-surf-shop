import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CategoryGrid = () => {
  const categories = [
    {
      title: "Trending Surfboards",
      subtitle: "Latest shapes & designs",
      image: "https://ext.same-assets.com/2623672561/3270404196.jpeg",
      href: "/collections/new-surfboards",
      cta: "Shop All"
    },
    {
      title: "Best Sellers",
      subtitle: "Most popular gear",
      image: "https://ext.same-assets.com/2623672561/2281932006.jpeg",
      href: "/collections/surfboard-accessories",
      cta: "Shop All"
    },
    {
      title: "Summer Wetsuits",
      subtitle: "Stay warm in style",
      image: "https://ext.same-assets.com/2623672561/3705052174.jpeg",
      href: "/collections/mens-surfing-wetsuits",
      cta: "Shop All"
    },
    {
      title: "Beach Essentials",
      subtitle: "Everything for the beach",
      image: "https://ext.same-assets.com/2623672561/3913721285.jpeg",
      href: "/collections/beach-accessories",
      cta: "Shop All"
    },
    {
      title: "Skate Culture",
      subtitle: "Complete boards & parts",
      image: "https://ext.same-assets.com/2623672561/1127906608.jpeg",
      href: "/collections/complete-skateboards",
      cta: "Shop All"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Picks for You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated collections featuring the best surf, skate, and beach gear.
            From expert-recommended surfboards to must-have accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large featured category */}
          <div className="md:col-span-2 lg:row-span-2">
            <Link
              href={categories[0].href}
              className="group block h-full"
            >
              <div className="relative h-96 lg:h-full rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={categories[0].image}
                  alt={categories[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{categories[0].title}</h3>
                  <p className="text-lg mb-4 opacity-90">{categories[0].subtitle}</p>
                  <Button
                    variant="secondary"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    {categories[0].cta}
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Smaller category cards */}
          {categories.slice(1).map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group block"
            >
              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{category.subtitle}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-black hover:bg-gray-100 text-xs"
                  >
                    {category.cta}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional category tiles */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Men\'s Clothing', href: '/collections/mens-surf-clothing', color: 'bg-blue-100 text-blue-700' },
            { name: 'Women\'s Clothing', href: '/collections/womens-surf-clothing', color: 'bg-pink-100 text-pink-700' },
            { name: 'Kids Gear', href: '/collections/youth-boys-surf-clothing', color: 'bg-green-100 text-green-700' },
            { name: 'Sale Items', href: '/collections/clearance', color: 'bg-red-100 text-red-700' }
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${item.color} p-6 rounded-lg text-center font-semibold hover:opacity-80 transition-opacity`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
