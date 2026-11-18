import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-ivory-200 border-t border-lavender-200/90 text-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs text-mutedGray leading-relaxed max-w-sm mt-3">
              Earnest is a university-integrated freelance and micro-earning platform empowering students to build verified industry experience, receive protected compensation, and thrive academically through automated safeguard caps.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-700 bg-sage-200/60 border border-sage-300 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0 text-forest-600" />
              <span>University Academic Safeguards Active</span>
            </div>
          </div>

          {/* Stakeholder Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 font-sans">
              Stakeholders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/student/login" className="hover:text-plum-600 transition-colors flex items-center gap-1">
                  <span>Student Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-mutedGray" />
                </Link>
              </li>
              <li>
                <Link to="/coordinator/login" className="hover:text-plum-600 transition-colors flex items-center gap-1">
                  <span>Coordinator Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-mutedGray" />
                </Link>
              </li>
              <li>
                <Link to="/enterprise/login" className="hover:text-plum-600 transition-colors flex items-center gap-1">
                  <span>Enterprise Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-mutedGray" />
                </Link>
              </li>
              <li>
                <Link to="/student/signup" className="hover:text-plum-600 transition-colors">
                  Student Registration
                </Link>
              </li>
              <li>
                <Link to="/enterprise/signup" className="hover:text-plum-600 transition-colors">
                  Enterprise Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Exploration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 font-sans">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-plum-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#opportunities" className="hover:text-plum-600 transition-colors">
                  Browse Opportunities
                </a>
              </li>
              <li>
                <a href="#safeguards" className="hover:text-plum-600 transition-colors">
                  CGPA & Hour Safeguards
                </a>
              </li>
              <li>
                <a href="#stakeholders" className="hover:text-plum-600 transition-colors">
                  University Integration
                </a>
              </li>
              <li>
                <span className="text-mutedGray">Verified Payment Escrow</span>
              </li>
            </ul>
          </div>

          {/* Academic Safeguards / Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 font-sans">
              Academic Policy
            </h4>
            <ul className="space-y-2 text-xs text-mutedGray">
              <li>Standard 20h Monthly Cap</li>
              <li>7.0 / 10.0 Minimum CGPA Benchmark</li>
              <li>Verified Bank & UPI Receipts Only</li>
              <li>Campus Advisor Governance</li>
              <li>FERPA Compliant Privacy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-lavender-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mutedGray">
          <p>© 2026 Earnest University Ecosystem. Designed for student achievement & balance.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-charcoal-900 cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-charcoal-900 cursor-pointer">Terms of Participation</span>
            <span className="hover:text-charcoal-900 cursor-pointer">Faculty Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
