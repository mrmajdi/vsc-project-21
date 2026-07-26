import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Search, User, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here (e.g., router.push)
    console.log('Search:', searchQuery);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="FilmFlix Logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-bold text-gray-900">FilmFlix</span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex md:items-center md:w-auto flex-1">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full max-w-xl mx-4"
            >
              <input
                type="text"
                placeholder="جستجو در فیلم‌ها و سریال‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Search"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Navigation Links */}
            <nav className="ml-10 flex space-x-6 text-sm font-medium text-gray-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                خانه
              </Link>
              <Link href="/films" className="hover:text-indigo-600 transition-colors">
                فیلم‌ها
              </Link>
              <Link href="/series" className="hover:text-indigo-600 transition-colors">
                سریال‌ها
              </Link>
              <Link href="/genres" className="hover:text-indigo-600 transition-colors">
                ژانرها
              </Link>
            </nav>
          </div>

          {/* Auth & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {status === 'loading' ? (
              <span className="text-gray-500">در حال بارگذاری...</span>
            ) : session ? (
              <>
                {/* User Avatar / Name */}
                <div className="relative group">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle user menu (could use a dropdown component)
                    }}
                    className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User avatar"
                        width={24}
                        height={24}
                        className="rounded-full"
                        priority
                      />
                    ) : (
                      <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full text-sm font-medium">
                        {session.user?.name?.[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-900">
                      {session.user?.name}
                    </span>
                  </button>
                  {/* Optional user dropdown could go here */}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                {/* Login / Register Buttons */}
                <Link
                  href="/login"
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  ورود
                </Link>
                <Link
                  href="/register"
                  className="ml-3 px-3 py-1 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          className={`md:hidden mt-6 space-y-4 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <Link
            href="/"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            خانه
          </Link>
          <Link
            href="/films"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            فیلم‌ها
          </Link>
          <Link
            href="/series"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            سریال‌ها
          </Link>
          <Link
            href="/genres"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ژانرها
          </Link>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center px-4 py-2"
          >
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-0 bg-gray-50 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Search"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {/* Mobile Auth */}
          {status === 'loading' ? (
            <p className="px-4 py-2 text-gray-500 text-center">در حال بارگذاری...</p>
          ) : session ? (
            <>
              <div className="flex items-center space-x-3 px-4 py-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={20}
                    height={20}
                    className="rounded-full"
                    priority
                  />