import React from 'react';
import Link from 'next/link';
import { Star, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter signup */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Be the first to know with our emails</h3>
              <p className="text-gray-300">Get the latest surf reports, new gear alerts, and exclusive deals.</p>
            </div>
            <div className="flex w-full md:w-auto md:min-w-96">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-r-none bg-white text-black border-gray-600"
              />
              <Button className="rounded-l-none bg-red-600 hover:bg-red-700">
                Sign Me Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/pages/contact-us" className="hover:text-white transition-colors">FAQs and Help</Link></li>
                <li><Link href="/pages/returns-and-exchanges" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/pages/domestic-international-shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="/pages/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/pages/locations-hours" className="hover:text-white transition-colors">Head Quarter</Link></li>
                <li><Link href="/pages/surf-station-price-match-guarantee" className="hover:text-white transition-colors">Price Match Promise</Link></li>
              </ul>
            </div>

            {/* Shopping */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Shopping</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/collections/new-surfboards" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="/collections/clearance" className="hover:text-white transition-colors">Sale & Clearance</Link></li>
                <li><Link href="/collections/surfboards" className="hover:text-white transition-colors">Surfboards</Link></li>
                <li><Link href="/collections/mens-surf-clothing" className="hover:text-white transition-colors">Men's Clothing</Link></li>
                <li><Link href="/collections/womens-surf-clothing" className="hover:text-white transition-colors">Women's Clothing</Link></li>
                <li><Link href="/collections/youth-boys-surf-clothing" className="hover:text-white transition-colors">Kids & Baby</Link></li>
              </ul>
            </div>

            {/* About Scrole */}
            <div>
              <h4 className="font-semibold text-lg mb-4">About Scrole</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/pages/st-augustine-surf-shop" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link href="/blogs/general" className="hover:text-white transition-colors">Surf News & Blogs</Link></li>
                <li><Link href="/pages/locations-hours" className="hover:text-white transition-colors">Head Quarter</Link></li>
                <li><Link href="/pages/custom-surfboard-orders" className="hover:text-white transition-colors">Custom Boards</Link></li>
                <li><Link href="/collections/surf-station-originals" className="hover:text-white transition-colors">Scrole Originals</Link></li>
                <li><Link href="/collections/local-florida-surfboard-shapers" className="hover:text-white transition-colors">Local Shapers</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
              <p className="text-gray-300 mb-4">
                Follow us for daily surf updates, new gear drops, and behind-the-scenes content from the world's largest surf shop.
              </p>
              <div className="flex space-x-4 mb-6">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Youtube className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>

          {/* Payment and company info */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">

              {/* Logo and tagline */}
              <div className="flex items-center mb-4 lg:mb-0">
                <Star className="h-8 w-8 text-red-600 fill-current mr-2" />
                <div>
                  <span className="text-2xl font-bold">scrole</span>
                  <p className="text-sm text-gray-400">World's Largest Surfboard Selection</p>
                </div>
              </div>

              {/* Payment icons */}
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <span className="text-sm text-gray-400 mr-4">We Accept:</span>
                <div className="flex space-x-2">
                  {['💳', '💳', '💳', '💳', '💳'].map((icon, index) => (
                    <div key={index} className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer service */}
              <div className="text-sm text-gray-400 text-center lg:text-right">
                <p>Questions? Call (888) 555-1212</p>
                <p>Customer Service is #1</p>
              </div>
            </div>
          </div>

          {/* Bottom links and copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div className="flex flex-wrap justify-center md:justify-start space-x-6 mb-4 md:mb-0">
                <Link href="/pages/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/pages/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <Link href="/pages/domestic-international-shipping" className="hover:text-white transition-colors">Shipping Info</Link>
                <Link href="/pages/returns-and-exchanges" className="hover:text-white transition-colors">Returns</Link>
              </div>
              <div className="text-center md:text-right">
                <p>© 2025 Scrole. All rights reserved.</p>
                <p>Powered by surf, sun, and endless stoke.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
