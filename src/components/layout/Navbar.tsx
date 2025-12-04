'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Bookmark, Clock, Home, Play, Calendar, Grid3X3, Clapperboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current page has hero banner (home or anime detail)
  const hasHeroBanner = pathname === '/' || pathname.startsWith('/anime/');
  const isWatchPage = pathname.startsWith('/watch/');

  useEffect(() => {
    const handleScroll = () => {
      if (hasHeroBanner) {
        // Trigger after scrolling ~15% of hero
        const heroHeight = window.innerWidth >= 640 
          ? window.innerHeight * 0.8 
          : window.innerHeight * 0.55;
        const scrollThreshold = heroHeight * 0.15;
        setIsScrolled(window.scrollY > scrollThreshold);
      } else {
        // For other pages, always show solid navbar
        setIsScrolled(true);
      }
    };
    
    // Check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasHeroBanner]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/ongoing', label: 'Ongoing', icon: Play },
    { href: '/complete', label: 'Complete', icon: Grid3X3 },
    { href: '/schedule', label: 'Jadwal', icon: Calendar },
    { href: '/genre', label: 'Genre', icon: Grid3X3 },
    { href: '/bookmark', label: 'Bookmark', icon: Bookmark },
    { href: '/history', label: 'History', icon: Clock },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background layer - smooth transition */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 shadow-lg ${
          isScrolled || isMobileMenuOpen ? 'opacity-100 bg-background' : 'opacity-0 bg-background/95 backdrop-blur-sm'
        }`}
      />
      <div 
        className={`absolute inset-0 transition-opacity duration-300 bg-gradient-to-b from-black/80 to-transparent ${
          isScrolled || isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Content layer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {isWatchPage ? (
              <Clapperboard className="w-7 h-7 text-white/80" />
            ) : (
              <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-primary'}`}>SUKANIME</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari anime..."
                    className="w-40 sm:w-64 bg-black/80 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-2 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Bookmark & History (Desktop) */}
            <div className="hidden md:flex items-center">
              <Link href="/bookmark" className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bookmark size={20} />
              </Link>
              <Link href="/history" className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Clock size={20} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="relative md:hidden bg-background border-b border-border animate-fadeIn">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2"
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
