"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaBars, FaShoppingCart, FaUser, FaCaretDown, FaTimes, FaSearch, FaCar } from "react-icons/fa";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const updateDisplayName = useCallback(() => {
    if (user) {
      const name = user.displayName || user.email?.split('@')[0] || 'Khách';
      setDisplayName(name);
    } else {
      setDisplayName('');
    }
  }, [user]);

  useEffect(() => {
    updateDisplayName();
  }, [user, updateDisplayName]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setIsUserAdmin(idTokenResult.claims.role === 'ADMIN');
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsUserAdmin(false);
        }
      } else {
        setIsUserAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      );
    }

    if (!user) {
      return (
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="bg-white text-primary-600 px-4 py-2 rounded-md text-sm font-medium border border-primary-600 hover:bg-primary-50 transition-all duration-200"
          >
            Đăng nhập
          </Link>
          <Link
            href="/auth/register"
            className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-all duration-200"
          >
            Đăng ký
          </Link>
        </div>
      );
    }

    return (
      <>
        <Link
          href="/cart"
          className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <FaShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-xs text-white flex items-center justify-center">
            0
          </span>
        </Link>
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <span className="font-medium">
              Xin chào, <span className="text-primary-600">{displayName}</span>
            </span>
            <FaUser className="h-5 w-5" />
            <FaCaretDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
              >
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Thông tin tài khoản
                </Link>
                {isUserAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Quản lý hệ thống
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    );
  };

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="text-xl md:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200 whitespace-nowrap">
              Car Showroom
            </Link>
          </div>

          <div className="hidden lg:block flex-1 max-w-4xl mx-4">
            <div className="flex items-center justify-center space-x-1 xl:space-x-4">
              <Link
                href="/cars"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Danh mục xe
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              <Link
                href="/new-cars"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Xe mới
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              <Link
                href="/used-cars"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Xe đã qua sử dụng
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              <Link
                href="/services"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Dịch vụ
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              <Link
                href="/news"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Tin tức
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
              <Link
                href="/contact"
                className="nav-link relative px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200 group whitespace-nowrap"
              >
                Liên hệ
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block flex-shrink-0">
            <div className="ml-4 flex items-center space-x-4">
              {renderAuthButtons()}
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            {user && (
              <Link
                href="/cart"
                className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <FaShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-xs text-white flex items-center justify-center">
                  0
                </span>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600 transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-16 bottom-0 bg-white lg:hidden overflow-y-auto pb-safe"
            >
              <div className="divide-y divide-gray-200">
                {user && displayName && (
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <FaUser className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">Xin chào,</p>
                        <p className="text-base font-semibold text-primary-600 truncate">{displayName}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="py-2">
                  <div className="space-y-1 px-4">
                    <Link
                      href="/cars"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaCar className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Danh mục xe</span>
                    </Link>
                    <Link
                      href="/new-cars"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaCar className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Xe mới</span>
                    </Link>
                    <Link
                      href="/used-cars"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaCar className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Xe đã qua sử dụng</span>
                    </Link>
                    <Link
                      href="/services"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaShoppingCart className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Dịch vụ</span>
                    </Link>
                    <Link
                      href="/news"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaSearch className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Tin tức</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="h-5 w-5 flex-shrink-0" />
                      <span className="line-clamp-1">Liên hệ</span>
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center justify-center space-x-2 rounded-lg bg-primary-50 px-4 py-3 text-base font-medium text-primary-600 hover:bg-primary-100 transition-all duration-200 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser className="h-5 w-5 flex-shrink-0" />
                        <span className="line-clamp-1">Tài khoản của tôi</span>
                      </Link>
                      {isUserAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center justify-center space-x-2 rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <FaUser className="h-5 w-5 flex-shrink-0" />
                          <span className="line-clamp-1">Quản lý hệ thống</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center space-x-2 rounded-lg bg-red-50 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-100 transition-all duration-200 w-full"
                      >
                        <FaTimes className="h-5 w-5 flex-shrink-0" />
                        <span className="line-clamp-1">Đăng xuất</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="flex items-center justify-center rounded-lg bg-white px-4 py-3 text-base font-medium text-primary-600 border-2 border-primary-600 hover:bg-primary-50 transition-all duration-200 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="line-clamp-1">Đăng nhập</span>
                      </Link>
                      <Link
                        href="/auth/register"
                        className="flex items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-base font-medium text-white hover:bg-primary-700 transition-all duration-200 w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="line-clamp-1">Đăng ký</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 