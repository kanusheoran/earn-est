import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Opportunities', href: '/#opportunities' },
    { label: 'Safeguards & CGPA', href: '/#safeguards' },
    { label: 'Campus Portals', href: '/#stakeholders' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/95 backdrop-blur-md border-b border-lavender-200/80 transition-colors">
      {/* Top Utility Announcement Ribbon (Inspired by Image 2 Digital Marketing Top Bar) */}
      <div className="bg-forest-900 text-white text-[11px] py-1.5 px-4 border-b border-forest-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-citron-400 text-forest-900 font-bold text-[10px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-900 animate-ping" />
              Live Intake
            </span>
            <span className="text-forest-100 font-medium hidden sm:inline">
              Semester 4 & 6 Verified Industry Projects Open Across Partner Campuses
            </span>
            <span className="text-forest-100 font-medium sm:hidden">
              Verified Campus Freelancing Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-forest-200">
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-citron-300" />
              <span>AICTE & UGC Safeguard Compliant</span>
            </span>
            <div className="flex items-center gap-3">
              <Link to="/coordinator/login" className="hover:text-citron-300 transition-colors text-[11px] font-semibold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                <span>Coordinator Login</span>
              </Link>
              <span className="text-forest-700">|</span>
              <Link to="/enterprise/login" className="hover:text-citron-300 transition-colors text-[11px] font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>Enterprise Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand with Stylized Stamp Badge */}
        <BrandLogo size="md" showTagline={true} />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-charcoal-800">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-forest-700 transition-colors py-1 relative group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest-600 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Actions (Warm Terracotta Pill Button like Image 1 "Пист & Зёрна") */}
        <div className="hidden md:flex items-center gap-3.5">
          <Link
            to="/student/login"
            className="px-4 py-2 text-xs font-bold text-charcoal-800 hover:text-forest-700 transition-colors uppercase tracking-wider"
          >
            Student Sign In
          </Link>
          <Link
            to="/student/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all hover:shadow-soft"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-charcoal-800 hover:bg-lavender-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-charcoal-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-lavender-200 bg-ivory-50 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 hover:bg-sage-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-lavender-200 flex flex-col gap-2.5">
            <Link
              to="/student/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-lavender-200 text-sm font-semibold text-charcoal-900 hover:bg-white"
            >
              Student Sign In
            </Link>
            <Link
              to="/student/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-terracotta-500 text-white text-sm font-semibold hover:bg-terracotta-600"
            >
              Create Student Account
            </Link>
            <div className="flex justify-between items-center text-xs text-mutedGray px-2 pt-2">
              <Link to="/coordinator/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-forest-700 underline font-medium">
                University Coordinator
              </Link>
              <Link to="/enterprise/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-forest-700 underline font-medium">
                Enterprise Partner
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
