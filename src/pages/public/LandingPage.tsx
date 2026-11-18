import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Clock, 
  IndianRupee, 
  Award, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Layout, 
  Code2, 
  FileText, 
  Layers, 
  X, 
  Check, 
  Lock, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity } from '../../types';

// Crisp Brand & Social SVGs
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { opportunities } = useApp();

  // Published opportunities
  const publishedOpps = opportunities.filter(o => o.status === 'Published');
  const previewOpps = publishedOpps.slice(0, 4);

  // Modal states
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isSafeguardsModalOpen, setIsSafeguardsModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const disciplines = [
    {
      title: 'UI/UX & Design Systems',
      desc: 'Mobile app flows, Figma design systems, wireframes, and accessible design tokens for Indian startups.',
      badgeColor: 'bg-purple-100 text-purple-700',
      iconColor: 'bg-purple-100 text-purple-700',
      icon: Layout,
      count: '14 Active Roles'
    },
    {
      title: 'Full-Stack Web & Mobile',
      desc: 'Modern web apps using React, Next.js, Flutter, and REST APIs with enterprise code quality.',
      badgeColor: 'bg-rose-100 text-rose-600',
      iconColor: 'bg-rose-100 text-rose-600',
      icon: Code2,
      count: '22 Active Roles'
    },
    {
      title: 'AI, ML & Python Pipelines',
      desc: 'Data engineering, fine-tuning scripts, model annotation datasets, and automated scrapers.',
      badgeColor: 'bg-amber-100 text-amber-700',
      iconColor: 'bg-amber-100 text-amber-700',
      icon: Layers,
      count: '9 Active Roles'
    },
    {
      title: 'Tech Writing & Localization',
      desc: 'Developer API docs, product guides, and regional vernacular translations in Hindi, Tamil & Kannada.',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      iconColor: 'bg-emerald-100 text-emerald-700',
      icon: FileText,
      count: '11 Active Roles'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E1B4B] font-sans antialiased selection:bg-[#FFE4E8] selection:text-[#FF3366]">
      
      {/* ================= HEADER / NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/90 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo: Earnest (SH-inspired typography & badge) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-lg tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              E<span className="text-[#FF3366]">.</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-[#0F172A] leading-tight tracking-tight">
                Earnest
              </span>
              <span className="text-[11px] font-semibold text-gray-400 tracking-wide">
                University Micro-Work Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-600">
            {[
              { id: 'home', label: 'Home' },
              { id: 'safeguards', label: 'Safeguards' },
              { id: 'services', label: 'Domains' },
              { id: 'opportunities', label: 'Opportunities' },
              { id: 'portals', label: 'Portals' },
            ].map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveNav(link.id)}
                className={`py-1 relative transition-colors ${
                  activeNav === link.id
                    ? 'text-[#0F172A] font-bold'
                    : 'hover:text-[#0F172A]'
                }`}
              >
                <span>{link.label}</span>
                {activeNav === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF3366] rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action: Explore Opportunities Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/student/login"
              className="hidden sm:inline-block text-xs font-bold text-gray-700 hover:text-[#0F172A] px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/student/opportunities"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF3366] hover:bg-[#E62E5C] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      <main>
        {/* ================= HERO SECTION (Exact UI Composition from Image) ================= */}
        <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FFF0F3]/60 via-[#FFFDF9] to-white">
          
          {/* Subtle decorative background organic shape */}
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#FFE4E8]/50 to-[#F3E8FF]/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Greeting, Headline, Subtitle, Actions, Trust badges */}
              <div className="lg:col-span-6 space-y-6 text-left">
                
                {/* Greeting badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-gray-700 text-xs font-semibold shadow-xs">
                  <span>India's Campus Freelance Ecosystem</span>
                  <span className="text-base animate-bounce">🎓</span>
                </div>

                {/* Big Bold Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
                  Where campus talent earns & learns — with <br />
                  <span className="text-[#FF3366]">zero study compromise</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg">
                  Earnest connects ambitious college students with verified enterprise projects. Powered by automated university safeguards that enforce a 20-hour monthly cap and minimum 7.0 CGPA standard.
                </p>

                {/* Two Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to="/student/opportunities"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF3366] hover:bg-[#E62E5C] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Explore Student Roles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setIsSafeguardsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-[#0F172A] text-xs sm:text-sm font-bold hover:bg-gray-50 transition-colors shadow-xs"
                  >
                    <span>How Safeguards Work</span>
                    <ShieldCheck className="w-4 h-4 text-[#FF3366]" />
                  </button>
                </div>

                {/* Trust Row with Doodles */}
                <div className="pt-6 border-t border-rose-100 flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span>Campus Safeguards</span>
                  <div className="flex flex-wrap items-center gap-4 text-gray-700">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F172A]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      7.0 CGPA Cutoff
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F172A]">
                      <span className="w-2 h-2 rounded-full bg-[#FF3366]" />
                      20h Monthly Cap
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F172A]">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Escrow UPI Payouts
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Platform Desk Composition (Laptop showing Earnest Dashboard + Leaning Smartphone + Coffee Mug) */}
              <div className="lg:col-span-6 relative flex justify-center">
                
                {/* Floating doodles */}
                <div className="absolute -top-4 right-12 text-[#FF3366] font-bold text-xl animate-pulse">✦</div>
                <div className="absolute top-1/2 -left-6 text-purple-400 text-lg">✦</div>
                <div className="absolute bottom-10 right-4 text-gray-400 text-sm">+</div>
                
                {/* Floating Safeguard Badge */}
                <div className="absolute top-2 left-10 z-20 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-md text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CGPA 8.4 / 10.0 Verified</span>
                </div>

                {/* Desk Scene Canvas */}
                <div className="relative w-full max-w-[480px]">
                  
                  {/* Laptop Mockup displaying Earnest Platform Dashboard */}
                  <div className="relative z-10 bg-[#0F172A] p-2.5 rounded-2xl shadow-2xl border-4 border-[#1E293B]">
                    {/* Laptop Screen Header */}
                    <div className="flex items-center justify-between pb-2 px-1 border-b border-gray-800">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">Earnest Campus Console · IIT Delhi</span>
                      <div className="w-4" />
                    </div>

                    {/* Platform UI Mockup inside Laptop Screen */}
                    <div className="p-3 font-mono text-[11px] leading-relaxed space-y-1.5 bg-[#090D16] rounded-lg">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                        <span className="text-gray-300 font-bold">Active Deliverables (4)</span>
                        <span className="text-emerald-400 font-bold">Safeguards: Compliant</span>
                      </div>
                      <p><span className="text-purple-400">Student:</span> <span className="text-yellow-300">Priya Sharma</span> (B.Tech CSE)</p>
                      <p><span className="text-blue-400">Partner:</span> <span className="text-emerald-400">Infosys BPM</span></p>
                      <p><span className="text-gray-400">Milestone Stipend:</span> <span className="text-[#FF3366] font-bold">₹8,500</span> (In Escrow)</p>
                      <p><span className="text-gray-400">Monthly Hours Gauge:</span> <span className="text-yellow-300 font-bold">12 / 20 hrs</span> (Safe buffer)</p>
                      <p><span className="text-emerald-400">Faculty Audit:</span> <span className="text-gray-300">Certified by Dr. Ananya Bhatt</span></p>
                    </div>

                    {/* Keyboard Base */}
                    <div className="mt-2 h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-b-xl flex items-center justify-center">
                      <div className="w-16 h-1 bg-gray-500 rounded-full" />
                    </div>
                  </div>

                  {/* Smartphone leaning on the right showing Student's UPI credit */}
                  <div className="absolute -bottom-4 -right-4 z-20 w-32 bg-white p-1.5 rounded-2xl shadow-xl border-2 border-gray-300 transform rotate-3">
                    <div className="w-full h-44 rounded-xl bg-gradient-to-b from-[#FFE4E8] to-white p-2 flex flex-col justify-between overflow-hidden">
                      <div className="w-10 h-1.5 bg-gray-400 rounded-full mx-auto mb-1" />
                      <div className="h-16 rounded-lg bg-[#FF3366] text-white p-1.5 flex flex-col justify-end">
                        <span className="text-[8px] font-bold">₹8,500 UPI Paid</span>
                        <span className="text-[6px] opacity-80">Coordinator Verified</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-full" />
                        <div className="h-2 bg-gray-200 rounded w-3/4" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#0F172A] text-white flex items-center justify-center mx-auto text-[8px] font-bold">
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Coffee Mug in Front with E. Logo */}
                  <div className="absolute -bottom-6 right-28 z-30 flex items-center">
                    <div className="relative w-12 h-14 bg-[#0F172A] rounded-b-xl rounded-t-sm flex items-center justify-center text-white font-bold text-xs shadow-md border border-gray-700">
                      <span>E.</span>
                      {/* Mug Handle */}
                      <div className="absolute -right-3 top-2.5 w-4 h-6 border-2 border-[#0F172A] rounded-r-lg" />
                      {/* Rising steam curls */}
                      <div className="absolute -top-3 left-3 text-gray-300 text-[10px] animate-pulse">~</div>
                    </div>
                  </div>

                  {/* Potted Succulent Plant on Left */}
                  <div className="absolute -bottom-4 -left-6 z-20 flex flex-col items-center">
                    <div className="flex gap-1 -mb-1">
                      <div className="w-3.5 h-6 bg-emerald-500 rounded-full transform -rotate-12" />
                      <div className="w-4 h-7 bg-emerald-600 rounded-full" />
                      <div className="w-3.5 h-6 bg-emerald-500 rounded-full transform rotate-12" />
                    </div>
                    <div className="w-10 h-9 bg-white border-2 border-gray-300 rounded-b-xl shadow-md flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-gray-200" />
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= WAVE TRANSITION 1 ================= */}
        <div className="w-full overflow-hidden leading-none -mt-1 text-[#FFF0F3]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 sm:h-16 fill-current">
            <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* ================= ABOUT / SAFEGUARD PHILOSOPHY (Exact UI Layout from Image) ================= */}
        <section id="safeguards" className="py-16 md:py-24 bg-[#FFF0F3] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Academic Safeguard Console Scene */}
              <div className="lg:col-span-5 relative flex justify-center">
                
                {/* Floating doodle badges */}
                <div className="absolute -top-4 left-4 z-20 px-2.5 py-1 rounded-xl bg-white border border-gray-200 text-xs font-mono font-bold shadow-sm text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>UGC & AICTE Safeguards</span>
                </div>
                <div className="absolute -top-4 right-10 z-20 p-2 rounded-full bg-white border border-gray-200 shadow-sm text-amber-500">
                  💡
                </div>
                <div className="absolute bottom-8 right-2 text-[#FF3366] text-xl">✦</div>

                {/* Student Profile Card (Priya Sharma Showcase) */}
                <div className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-lg border border-rose-100 flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                      alt="Priya Sharma"
                      className="w-32 h-32 rounded-full object-cover border-4 border-rose-200 shadow-md"
                    />
                    <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow">
                      E.
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl text-[#0F172A]">
                      Priya Sharma
                    </h3>
                    <p className="text-xs font-semibold text-[#FF3366] mt-0.5">
                      B.Tech CSE · IIT Delhi · Silver Tier
                    </p>
                  </div>

                  {/* Monthly Safe Work Gauge */}
                  <div className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-left space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700">Monthly Hours Gauge</span>
                      <span className="font-bold text-emerald-600">12 / 20 hrs</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF3366] h-full rounded-full" style={{ width: '60%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                      <span>Safe Buffer Active</span>
                      <span>8 hrs remaining</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Academic Honors · CGPA 8.4 / 10.0
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Narrative & 4 Pastel Stat Cards */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF3366]">
                    Academic Safeguards
                  </span>
                  
                  {/* Heading with Hand-Drawn Squiggle Underline */}
                  <div className="relative inline-block mt-1">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                      Protecting your degree with purpose
                    </h2>
                    <svg className="w-full h-3 mt-1" viewBox="0 0 300 12" fill="none">
                      <path
                        d="M2 9C50 3 100 11 150 5C200 -1 250 9 298 6"
                        stroke="#FF3366"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                  Traditional freelancing forces students to sacrifice lecture attendance, sleep, and exam prep. Earnest automates academic safeguards: a strict 20-hour monthly work cap, automated pauses during exam blackouts, and minimum 7.0 CGPA requirements.
                </p>

                {/* 4 Stat Badges in pastel cards (Exact UI from Image) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                  
                  {/* Stat 1: ₹12.5L+ Stipends Disbursed (Pink) */}
                  <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-xs space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#0F172A]">₹12.5L+</div>
                      <div className="text-[11px] font-semibold text-gray-500">Stipends Disbursed</div>
                    </div>
                  </div>

                  {/* Stat 2: 500+ Active Students (Green) */}
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-xs space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#0F172A]">500+</div>
                      <div className="text-[11px] font-semibold text-gray-500">Campus Freelancers</div>
                    </div>
                  </div>

                  {/* Stat 3: 120+ Enterprise Projects (Yellow) */}
                  <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#0F172A]">120+</div>
                      <div className="text-[11px] font-semibold text-gray-500">Enterprise Roles</div>
                    </div>
                  </div>

                  {/* Stat 4: 99.2% Academic Compliance (Purple) */}
                  <div className="p-4 rounded-2xl bg-white border border-purple-200/90 shadow-xs space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#0F172A]">99.2%</div>
                      <div className="text-[11px] font-semibold text-gray-500">Safeguard Adherence</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= WAVE TRANSITION 2 ================= */}
        <div className="w-full overflow-hidden leading-none -mt-1 text-[#F3E8FF]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 sm:h-16 fill-current">
            <path d="M0,0 C200,100 450,0 700,70 C950,140 1100,20 1200,50 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* ================= DOMAINS & SKILLS SECTION (Exact 4 Cards from Image) ================= */}
        <section id="services" className="py-16 md:py-24 bg-[#F3E8FF] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF3366]">
                  What Students Do
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-1 flex items-center gap-2">
                  <span>Domains we support</span>
                  <span className="text-[#FF3366] text-2xl font-bold">✦</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md">
                Verified micro-projects tailored specifically for engineering, design, and management undergraduates across India.
              </p>
            </div>

            {/* 4 Clean White Rounded Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {disciplines.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between border border-purple-100"
                  >
                    <div className="space-y-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${item.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                        {item.count}
                      </span>
                      <Link
                        to="/student/opportunities"
                        className="flex items-center gap-1 text-xs font-bold text-[#FF3366] hover:gap-1.5 transition-all"
                      >
                        <span>Browse</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= WAVE TRANSITION 3 ================= */}
        <div className="w-full overflow-hidden leading-none -mt-1 text-[#FFFDF9]">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 sm:h-16 fill-current">
            <path d="M0,0 C300,120 600,-20 900,60 C1050,100 1150,40 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        {/* ================= ACTIVE OPPORTUNITIES (Exact 4 Cards from Image) ================= */}
        <section id="opportunities" className="py-16 md:py-24 bg-[#FFFDF9] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF3366]">
                  Live Postings
                </span>
                
                {/* Heading with Hand-Drawn Stroke Underline */}
                <div className="relative inline-block mt-1">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                    Featured Opportunities
                  </h2>
                  <svg className="w-full h-3 mt-0.5" viewBox="0 0 200 10" fill="none">
                    <path
                      d="M2 7C40 2 80 8 120 4C160 0 180 7 198 5"
                      stroke="#FF3366"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 max-w-md">
                Vetted deliverables from approved enterprise partners with pre-funded stipends and faculty verification.
              </p>
            </div>

            {/* 4 Project Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewOpps.map((opp, index) => {
                const themes = [
                  { bg: 'from-emerald-100/80 to-emerald-50/40', badge: 'bg-emerald-100 text-emerald-800' },
                  { bg: 'from-rose-100/80 to-rose-50/40', badge: 'bg-rose-100 text-rose-800' },
                  { bg: 'from-amber-100/80 to-amber-50/40', badge: 'bg-amber-100 text-amber-800' },
                  { bg: 'from-purple-100/80 to-purple-50/40', badge: 'bg-purple-100 text-purple-800' },
                ];
                const theme = themes[index % themes.length];

                return (
                  <div
                    key={opp.id}
                    className="rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Graphic Header with Mockups */}
                      <div className={`p-6 bg-gradient-to-b ${theme.bg} flex items-center justify-center relative overflow-hidden h-44`}>
                        
                        {/* Left Phone Mockup */}
                        <div className="w-20 h-32 bg-white rounded-xl shadow-md p-1 border border-gray-200 transform -rotate-6 transition-transform group-hover:-rotate-8 duration-300">
                          <div className="w-full h-full rounded-lg bg-gray-50 flex flex-col justify-between p-1.5 overflow-hidden">
                            <div className="w-6 h-1 bg-gray-300 rounded-full mx-auto" />
                            <div className="h-8 rounded bg-[#FF3366]/20 flex items-center justify-center text-[7px] font-bold text-[#FF3366] text-center px-1">
                              {opp.organizationName}
                            </div>
                            <div className="space-y-1">
                              <div className="h-1 bg-gray-200 rounded w-full" />
                              <div className="h-1 bg-gray-200 rounded w-2/3" />
                            </div>
                          </div>
                        </div>

                        {/* Right Phone Mockup */}
                        <div className="w-20 h-32 bg-white rounded-xl shadow-md p-1 border border-gray-200 transform rotate-6 -ml-4 transition-transform group-hover:rotate-8 duration-300">
                          <div className="w-full h-full rounded-lg bg-white flex flex-col justify-between p-1.5 overflow-hidden">
                            <div className="w-6 h-1 bg-gray-300 rounded-full mx-auto" />
                            <div className="h-7 rounded bg-emerald-100 p-1 flex items-center justify-center text-[7px] text-emerald-800 font-bold">
                              ₹{opp.compensation.toLocaleString('en-IN')}
                            </div>
                            <div className="h-3 rounded bg-gray-100 flex items-center justify-center text-[6px] text-gray-500 font-bold">
                              {opp.estimatedHours}h Total
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {opp.organizationName} · {opp.workArrangement}
                        </span>
                        <h3 className="text-base font-bold text-[#0F172A] line-clamp-1">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 font-sans">
                          {opp.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-50">
                      <span className="text-xs font-bold text-[#0F172A]">
                        ₹{opp.compensation.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => setSelectedOpp(opp)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3366] hover:gap-2 transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Pill Button: Explore All Opportunities */}
            <div className="mt-12 text-center">
              <Link
                to="/student/opportunities"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF3366] hover:bg-[#E62E5C] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>See All Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= THREE STAKEHOLDER PORTALS (Clean Feature Separation) ================= */}
        <section id="portals" className="py-14 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Tailored Campus Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Three Connected Campus Portals
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Each role features an isolated workspace with clear permissions and automated safeguards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Portal Card */}
              <div className="p-6 rounded-3xl bg-[#FFF0F3] border border-rose-200/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#FF3366] flex items-center justify-center font-bold shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Student Portal</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    Find pre-screened micro-projects matching your academic discipline and semester schedule. Log milestone hours and track your safe 20h limit.
                  </p>
                </div>
                <Link
                  to="/student/login"
                  className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold text-center block transition-colors shadow-xs"
                >
                  Enter Student Portal →
                </Link>
              </div>

              {/* Coordinator Portal Card */}
              <div className="p-6 rounded-3xl bg-[#F3E8FF] border border-purple-200/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white text-purple-700 flex items-center justify-center font-bold shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">University Coordinator</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    Enforce the 7.0 CGPA standard, audit student earnings vouchers before payout release, and export UGC/AICTE compliance reports with one click.
                  </p>
                </div>
                <Link
                  to="/coordinator/login"
                  className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold text-center block transition-colors shadow-xs"
                >
                  Coordinator Console →
                </Link>
              </div>

              {/* Enterprise Portal Card */}
              <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-gray-200 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Enterprise Partner Hub</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    Post defined deliverables for pre-screened Indian campus talent, review candidate portfolios, manage milestones, and fund protected escrow.
                  </p>
                </div>
                <Link
                  to="/enterprise/login"
                  className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold text-center block transition-colors shadow-xs"
                >
                  Post Campus Project →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HIGH-FIVE CTA BANNER (Exact UI from Image) ================= */}
        <section className="py-16 md:py-24 bg-[#FFF0F3] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="rounded-4xl bg-gradient-to-r from-rose-100 via-[#FFE4E8] to-rose-100 p-8 sm:p-14 border border-rose-200 shadow-sm relative overflow-hidden">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Side: Headline & Button */}
                <div className="md:col-span-7 space-y-6 text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                    Ready to join India's campus network? <br />
                    Let's build{' '}
                    <span className="relative inline-block text-[#FF3366]">
                      your future
                      <svg className="w-full h-2.5 -mt-1" viewBox="0 0 140 8" fill="none">
                        <path d="M2 6C35 2 70 7 105 3C120 1 130 5 138 4" stroke="#FF3366" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </span>{' '}
                    <br />
                    great together!
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/student/signup"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                    >
                      <span>Create Student Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/enterprise/login"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-gray-300 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-50 transition-all"
                    >
                      <span>Partner as Enterprise</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Exact Hand-Drawn High-Five Illustration */}
                <div className="md:col-span-5 relative flex items-center justify-center">
                  
                  {/* Whimsical doodles around hands */}
                  <div className="absolute top-2 right-12 text-[#FF3366] font-bold text-xl animate-pulse">✦</div>
                  <div className="absolute -top-4 left-10 text-gray-500 font-bold text-sm">~</div>
                  
                  {/* High Five Graphic Container */}
                  <div className="relative w-64 h-48 flex items-center justify-center">
                    
                    {/* Left Hand with Green Polka Dot Sleeve (Student hand) */}
                    <div className="absolute left-6 bottom-2 transform -rotate-12 flex flex-col items-center">
                      <div className="w-16 h-20 bg-[#FCD34D] rounded-t-2xl border-2 border-gray-900 shadow-sm flex flex-col items-center justify-start pt-2">
                        <div className="w-3 h-8 bg-[#FCD34D] rounded-full border-r border-gray-800" />
                      </div>
                      {/* Green polka dot sleeve */}
                      <div className="w-20 h-16 bg-emerald-400 rounded-b-xl border-2 border-gray-900 flex items-center justify-center overflow-hidden">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-700" />
                          <div className="w-2 h-2 rounded-full bg-emerald-700" />
                          <div className="w-2 h-2 rounded-full bg-emerald-700" />
                        </div>
                      </div>
                    </div>

                    {/* Right Hand with Pink Striped Sleeve (Enterprise hand) */}
                    <div className="absolute right-6 bottom-2 transform rotate-12 flex flex-col items-center">
                      <div className="w-16 h-20 bg-[#FCD34D] rounded-t-2xl border-2 border-gray-900 shadow-sm flex flex-col items-center justify-start pt-2">
                        <div className="w-3 h-8 bg-[#FCD34D] rounded-full border-l border-gray-800" />
                      </div>
                      {/* Pink striped sleeve */}
                      <div className="w-20 h-16 bg-[#FF3366] rounded-b-xl border-2 border-gray-900 flex flex-col justify-around py-1">
                        <div className="w-full h-1 bg-white/40" />
                        <div className="w-full h-1 bg-white/40" />
                        <div className="w-full h-1 bg-white/40" />
                      </div>
                    </div>

                    {/* Impact Star Sparks in Center */}
                    <div className="absolute z-20 text-[#0F172A] font-extrabold text-3xl animate-bounce">
                      ✨
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ================= DARK MIDNIGHT FOOTER (Exact Layout from Image) ================= */}
      <footer id="contact" className="bg-[#0B1120] text-white pt-16 pb-12 relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0B1120] flex items-center justify-center font-bold text-lg tracking-tighter">
                  E<span className="text-[#FF3366]">.</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white leading-tight">
                    Earnest
                  </h3>
                  <p className="text-xs text-gray-400">
                    Your skills. Your work. Your earnings.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed max-w-sm font-sans">
                India's premier university student micro-freelancing platform. Connecting college talent with verified enterprises under automated faculty safeguards.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 text-gray-400 pt-2">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-900 hover:text-white hover:bg-gray-800 transition-colors">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-900 hover:text-white hover:bg-gray-800 transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-900 hover:text-white hover:bg-gray-800 transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#safeguards" className="hover:text-white transition-colors">Safeguards</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Domains</a></li>
                <li><a href="#opportunities" className="hover:text-white transition-colors">Opportunities</a></li>
                <li><a href="#portals" className="hover:text-white transition-colors">Campus Portals</a></li>
              </ul>
            </div>

            {/* Column 3: Stakeholders */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Stakeholders
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/student/login" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/coordinator/login" className="hover:text-white transition-colors">University Coordinator Portal</Link></li>
                <li><Link to="/enterprise/login" className="hover:text-white transition-colors">Enterprise Partner Portal</Link></li>
                <li><Link to="/student/opportunities" className="hover:text-white transition-colors">Live Opportunity Board</Link></li>
              </ul>
            </div>

            {/* Column 4: Compliance & Safeguards */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Campus Safeguards
              </h4>
              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-1.5 text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#FF3366]" />
                  <span>20h Monthly Cap Enforced</span>
                </p>
                <p className="flex items-center gap-1.5 text-gray-300">
                  <GraduationCap className="w-4 h-4 text-[#FF3366]" />
                  <span>7.0 CGPA Minimum Cutoff</span>
                </p>
                <p className="flex items-center gap-1.5 text-gray-300">
                  <IndianRupee className="w-4 h-4 text-[#FF3366]" />
                  <span>Direct UPI & NEFT Disbursements</span>
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Earnest Campus Freelance Ecosystem. Built for Indian Universities.</p>
            <p className="flex items-center gap-1">
              Aligned with AICTE & UGC student work-learning guidelines.
            </p>
          </div>

        </div>
      </footer>

      {/* ================= OPPORTUNITY DETAILS MODAL ================= */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOpp.organizationLogo}
                  alt={selectedOpp.organizationName}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {selectedOpp.organizationName} · {selectedOpp.workArrangement}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">
                    {selectedOpp.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedOpp(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Time Strip */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FFF0F3] border border-rose-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Milestone Stipend</span>
                <div className="text-xl font-extrabold text-[#0F172A] mt-0.5">
                  ₹{selectedOpp.compensation.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">100% Escrow Protected</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Estimated Duration</span>
                <div className="text-xl font-extrabold text-[#0F172A] mt-0.5">
                  {selectedOpp.estimatedHours} Hours
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Within 20h monthly limit</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Project Deliverable Description
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                {selectedOpp.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedOpp.requiredSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Safeguard Assurance Notice */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Requires minimum 7.0 CGPA on 10-point scale. Audited by university coordinator.</span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link
                to={`/student/opportunities/${selectedOpp.id}`}
                className="px-6 py-2.5 rounded-full bg-[#FF3366] text-white text-xs font-bold hover:bg-[#E62E5C] transition-colors flex items-center gap-1.5"
              >
                <span>Apply as Student</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= HOW SAFEGUARDS WORK MODAL ================= */}
      {isSafeguardsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#FF3366] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">
                    Earnest Academic Guardrails
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ensuring education stays primary
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSafeguardsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#FFF0F3] border border-rose-100 space-y-1">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF3366]" />
                  <span>1. 20-Hour Monthly Ceiling</span>
                </div>
                <p>
                  Students cannot take on projects exceeding 20 total hours in any calendar month (~5 hours/week). Once 20 hours are logged, applications automatically freeze until next month.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F3E8FF] border border-purple-100 space-y-1">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  <span>2. 7.0 CGPA Cutoff Criterion</span>
                </div>
                <p>
                  Calculated against the standard Indian 10-point scale. If semester grades drop below 7.0, an Academic Recovery hold is placed automatically to prioritize studies.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-700" />
                  <span>3. Coordinator Audit & Escrow Payouts</span>
                </div>
                <p>
                  Enterprises pre-fund stipends into escrow. Upon milestone completion, the university coordinator audits the deliverable before funds are released to student UPI.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsSafeguardsModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-colors"
              >
                Understood
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
