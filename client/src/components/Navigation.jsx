import { useState } from "react";
import { Menu, X, Plus, Search, Shield } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Report Issue", href: "/", icon: Plus },
    { name: "Track Issues", href: "/track", icon: Search },
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
  ];

  return (
    <nav className="bg-white dark:bg-[#1E1E1E] border-b border-[#E6E6E6] dark:border-[#333333] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white font-sora">
                  CivicConnect
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                  Community Issue Reporting
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 font-inter font-medium"
                  >
                    <Icon size={18} />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => {
                if (document.documentElement.classList.contains('dark')) {
                  document.documentElement.classList.remove('dark');
                                    document.documentElement.classList.add('white');


                } else {
                  document.documentElement.classList.add('dark');
                }
              }}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-lg">🌙</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-[#1E1E1E] border-t border-[#E6E6E6] dark:border-[#333333]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 font-inter font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </a>
              );
            })}
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                if (document.documentElement.classList.contains('dark')) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full font-inter font-medium"
            >
              <span className="text-lg">🌙</span>
              Toggle Dark Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}


