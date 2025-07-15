import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PromoBanners = () => {
  const promos = [
    {
      title: "Summer Clearance",
      subtitle: "Up to 70% Off",
      description: "Wetsuits, boardshorts & more",
      cta: "Shop Now",
      href: "/collections/clearance",
      bgColor: "from-red-500 to-red-600",
      textColor: "text-white"
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Gear",
      description: "Fresh surfboards & accessories",
      cta: "Explore",
      href: "/collections/new-surfboards",
      bgColor: "from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "Free Shipping",
      subtitle: "$75 & Up",
      description: "On all surf and skate gear",
      cta: "Shop All",
      href: "/collections/all",
      bgColor: "from-green-500 to-green-600",
      textColor: "text-white"
    },
    {
      title: "Local Shapers",
      subtitle: "Florida Made",
      description: "Support local surfboard craftsmen",
      cta: "Discover",
      href: "/collections/local-florida-surfboard-shapers",
      bgColor: "from-orange-500 to-orange-600",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {promos.map((promo, index) => (
            <Link
              key={index}
              href={promo.href}
              className="group block"
            >
              <div className={`bg-gradient-to-br ${promo.bgColor} rounded-lg p-6 h-48 flex flex-col justify-between transform transition-transform group-hover:scale-105 shadow-lg`}>
                <div>
                  <h3 className={`text-lg font-bold ${promo.textColor} mb-1`}>
                    {promo.title}
                  </h3>
                  <p className={`text-2xl font-extrabold ${promo.textColor} mb-2`}>
                    {promo.subtitle}
                  </p>
                  <p className={`text-sm ${promo.textColor} opacity-90`}>
                    {promo.description}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="self-start bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                >
                  {promo.cta}
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
