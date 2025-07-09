"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, BarChart3, TrendingUp, Calculator, HelpCircle, Phone, Newspaper, BookOpen, Home, Archive, Menu, X, History, Info, Star } from 'lucide-react';
import PredictionsMenu from './PredictionsMenu';

function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoText, setLogoText] = useState('UK49s Results');
  const [logoFontSize, setLogoFontSize] = useState('24');
  const [logoColor, setLogoColor] = useState('#000000');

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/results', label: 'Results', icon: Archive },
    { path: '/history', label: 'History', icon: History },
    { path: '/predictions', label: 'Predictions', icon: TrendingUp },
    { path: '/statistics', label: 'Statistics', icon: BarChart3 },
    { path: '/tools', label: 'Tools', icon: Calculator },
    { path: '/guide', label: 'How to Play', icon: BookOpen },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  useEffect(() => {
    // Load text logo settings from localStorage
    const savedLogoText = localStorage.getItem('siteLogoText');
    const savedFontSize = localStorage.getItem('siteLogoFontSize');
    const savedColor = localStorage.getItem('siteLogoColor');

    if (savedLogoText) setLogoText(savedLogoText);
    if (savedFontSize) setLogoFontSize(savedFontSize);
    if (savedColor) setLogoColor(savedColor);

    // Listen for storage changes to update in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'siteLogoText' && e.newValue) {
        setLogoText(e.newValue);
      } else if (e.key === 'siteLogoFontSize' && e.newValue) {
        setLogoFontSize(e.newValue);
      } else if (e.key === 'siteLogoColor' && e.newValue) {
        setLogoColor(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>

      <header className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-full">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: `${logoFontSize}px`,
                    color: logoColor,
                    fontWeight: 'bold'
                  }}
                  className="flex gap-x-2 items-center text-lg sm:text-2xl font-bold text-gray-900"
                >
                  {/* {logoText} */}
                  <Star fill='yellow'  stroke="yellow"/> Star49s

                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Your trusted lottery companion</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Predictions Menu */}
              <PredictionsMenu />

              {navItems.slice(4, 6).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>


      <div className="hidden md:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-2 overflow-x-auto">
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header