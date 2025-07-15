import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
      {/* Background pattern/image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://images.stockcake.com/public/9/5/d/95d6ac8b-8ec4-48b4-9922-20e92125b7b0_large/sunset-beach-surfing-stockcake.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Ride the Wave of
            <span className="block text-yellow-300">Summer Style</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed px-2 sm:px-0">
            Discover the world's largest selection of surfboards, wetsuits, and beach gear.
            From beginner to pro, we've got everything you need to make waves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              <Link href="/collections/new-surfboards">Shop Surfboards</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-green-600 text-white hover:bg-green-700 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              <Link href="/collections/clearance">Shop Sale</Link>
            </Button>
          </div>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-white/80 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xl sm:text-2xl">🚚</span>
              <span className="text-xs sm:text-sm">Free shipping $75+</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xl sm:text-2xl">🏄‍♂️</span>
              <span className="text-xs sm:text-sm">Expert advice</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xl sm:text-2xl">⭐</span>
              <span className="text-xs sm:text-sm">Since 1984</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 text-white fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
