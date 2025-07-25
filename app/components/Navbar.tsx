'use client';

import Link from 'next/link';
import '../styles/Navbar.css';
import { CiDark, CiLight } from 'react-icons/ci';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const Navbar = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const applyTheme = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);

    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      setResolvedTheme(selectedTheme);
      document.documentElement.setAttribute('data-theme', selectedTheme);
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = storedTheme || 'system';
    applyTheme(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const systemTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
        document.documentElement.setAttribute('data-theme', systemTheme);
      }
    };

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="nav_main_container">
      <Link href={'/'}>
        <div className="nav_logo">&#123;A_T&#125;</div>
      </Link>

      {/* Desktop Navigation */}
      <div className={`nav_links ${isMobile ? 'mobile-hidden' : ''}`}>
        <ul>
          <Link href="/writings"><li>Writings</li></Link>
          <Link href="/projects"><li>Projects</li></Link>
          <Link href="/education"><li>Education</li></Link>
          <Link href="/links"><li>Links</li></Link>
          <Link href="/services"><li>Services</li></Link>
        </ul>
      </div>

      {/* Mobile Controls */}
      <div className="mobile-controls">
        {isMobile && (
          <div className="mobile-menu-button" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </div>
        )}
        
        <div className="theme-container" ref={dropdownRef}>
          <div className="theme-icon" onClick={toggleDropdown}>
            {resolvedTheme === 'dark' ? <CiDark size={20} /> : <CiLight size={20} />}
          </div>
          {dropdownOpen && (
            <div className="theme-dropdown">
              <div className="theme-option" onClick={() => applyTheme('light')}>
                {theme === 'light' && <span>✓ </span>}Light
              </div>
              <div className="theme-option" onClick={() => applyTheme('dark')}>
                {theme === 'dark' && <span>✓ </span>}Dark
              </div>
              <div className="theme-option" onClick={() => applyTheme('system')}>
                {theme === 'system' && <span>✓ </span>}System
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div 
          ref={mobileMenuRef}
          className={`mobile-nav-links ${mobileMenuOpen ? 'open' : ''}`}
        >
          <ul>
            <Link href="/writings" onClick={toggleMobileMenu}><li>Writings</li></Link>
            <Link href="/projects" onClick={toggleMobileMenu}><li>Projects</li></Link>
            <Link href="/education" onClick={toggleMobileMenu}><li>Education</li></Link>
            <Link href="/links" onClick={toggleMobileMenu}><li>Links</li></Link>
            <Link href="/services" onClick={toggleMobileMenu}><li>Services</li></Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;