import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Award, ChevronRight, ChevronLeft, Users, Zap, CheckCircle2, ArrowRight, LineChart, Bookmark, Star, Cpu, Terminal, ChevronDown, HelpCircle, Sparkles, ShieldCheck, BarChart3, GraduationCap, X, Globe, Flame, Trophy, Gift, Copy } from 'lucide-react';
import { formatFunding } from '../lib/format';
import FirmCard from '../components/FirmCard';
import { supabase } from '../lib/supabaseClient';
import { PropFirm } from '../types';
import { useTradeMode } from '../context/TradeModeContext';
import { mapFirmFromDB, FirmService } from '../lib/services';

// FAQ Accordion Item Component
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-brand-accent/20' : ''}`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${isOpen ? 'from-brand-accent/10 via-brand-accent/5 to-transparent' : 'from-white/[0.04] via-white/[0.02] to-white/[0.01]'} transition-all duration-300`}></div>
      <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
      <button onClick={() => setIsOpen(!isOpen)} className="relative z-[2] w-full flex items-center justify-between p-6 text-left">
        <span className={`font-bold ${isOpen ? 'text-brand-accent' : 'text-white'} transition-colors pr-4`}>{question}</span>
        <ChevronDown size={18} className={`text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} />
      </button>
      <div className={`relative z-[2] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { mode, getModePath } = useTradeMode();
  const [topFirms, setTopFirms] = useState<PropFirm[]>([]);
  const [activeFirm, setActiveFirm] = useState(0);
  const [offersPage, setOffersPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedFirm, setCopiedFirm] = useState<{name: string; logo: string; rating: number; code: string; discount: string; website: string; affiliate: string} | null>(null);
  const modeLabel = mode === 'futures' ? 'Futures' : mode === 'crypto' ? 'Crypto' : 'Prop';

  // Detect mobile for pagination page size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Copy promo code handler
  const handleCopyCode = (firm: PropFirm) => {
    const code = firm.promoCode || 'NOBLE';
    navigator.clipboard.writeText(code).then(() => {
      setCopiedFirm({
        name: firm.name,
        logo: firm.logo,
        rating: Number(firm.rating),
        code,
        discount: firm.discountValue ? `${firm.discountValue}% OFF` : 'Exclusive Deal',
        website: firm.websiteUrl || '',
        affiliate: firm.affiliateLink || firm.websiteUrl || ''
      });
      setTimeout(() => setCopiedFirm(null), 4000);
    });
  };

  // Paginated firms for Exclusive Offers
  const offersPerPage = isMobile ? 3 : 6;
  const totalOffersPages = Math.ceil(topFirms.length / offersPerPage);
  const paginatedOffers = topFirms.slice(offersPage * offersPerPage, (offersPage + 1) * offersPerPage);

  // Dynamically derive showcase firms from topFirms (first 3)
  const showcaseFirms = topFirms.length > 0
    ? topFirms.slice(0, 3).map((firm, i) => ({
        name: firm.name,
        rating: firm.rating,
        profit: firm.profitSplit || '80%',
        maxFunding: formatFunding(firm.maxFunding),
        drawdown: firm.drawdown || '8%',
        logo: firm.logo,
        tag: firm.show_in_hero ? 'Featured' : i === 0 ? 'Top Choice' : i === 1 ? 'Highly Rated' : 'Popular',
        id: firm.id
      }))
    : [
        { name: 'Loading...', rating: 5.0, profit: '--', maxFunding: '--', drawdown: '--', logo: '', tag: 'Featured', id: 'loading' }
      ];

  // Live payout feed data
  const payoutFeed = [
    { trader: 'M.K.', amount: '$12,400', firm: 'FTMO', time: '2 min ago' },
    { trader: 'S.R.', amount: '$8,200', firm: 'Funding Pips', time: '5 min ago' },
    { trader: 'A.J.', amount: '$22,100', firm: 'The5ers', time: '8 min ago' },
    { trader: 'D.L.', amount: '$5,800', firm: 'E8 Markets', time: '12 min ago' },
  ];

  // Static logos for the infinite ticker - Premium prop firm logos
  const TICKER_LOGOS = [
    { name: 'Goat Funded Trader', logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif' },
    { name: 'ATS Funded', logo: 'https://atsfunded.com/ats-logo.png' },
    { name: 'Blueberry Funded', logo: 'https://blueberryfunded.com/wp-content/themes/blueberryfunded-xmas/assets/img/logo.svg' },
    { name: 'Funding Pips', logo: 'https://media.propNoble.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg' },
    { name: 'Alpha Capital', logo: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg' },
    { name: 'The5ers', logo: 'https://the5ers.com/images/menu/logo.svg' },
    { name: 'Funded Firm', logo: 'https://www.fundedfirm.com/_next/static/media/log.fa3e1c39.svg' },
    { name: 'FundedNext', logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundednext%20logo_White%20(1).png&w=384&q=75' },
    { name: 'E8 Markets', logo: 'https://e8markets.com/images/logo/logo.svg' },
  ];

  // Duplicate logos for seamless infinite scroll and filter by mode
  const tickerFirms = useMemo(() => {
    const filtered = TICKER_LOGOS.filter(firm => {
      const name = firm.name.toLowerCase();
      const isFutures = name.includes('ats') || name.includes('futures');
      const isCrypto = name.includes('crypto');
      if (mode === 'futures') return isFutures;
      if (mode === 'crypto') return isCrypto;
      return !isFutures && !isCrypto;
    });
    return [...filtered, ...filtered, ...filtered];
  }, [mode]);

  useEffect(() => {
    fetchTopFirms();
  }, [mode]);

  useEffect(() => {
    const len = showcaseFirms.length;
    if (len === 0) return;
    const interval = setInterval(() => {
      setActiveFirm((prev) => (prev + 1) % len);
    }, 3000);
    return () => clearInterval(interval);
  }, [topFirms.length, mode]);

  const fetchTopFirms = async () => {
    try {
      // Use the centralized service for consistent filtering logic
      const firms = await FirmService.getActiveFirms(mode);
      
      const getFaviconUrl = (websiteUrl: string | null | undefined, fallbackLogo: string | null) => {
        if (!websiteUrl) return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
        try {
          const hostname = new URL(websiteUrl).hostname;
          return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        } catch {
          return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
        }
      };

      const mappedFirms = firms.map(f => ({
        ...f,
        favicon: getFaviconUrl(f.websiteUrl || f.website, f.logo)
      }));

      // Sort by rating and respect show_in_hero if possible
      // (The service returns all active firms for the mode, so we just take the top ones)
      setTopFirms(mappedFirms.slice(0, 12));
    } catch (err) {
      console.error("Error fetching top firms for landing:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">

      {/* --- PREMIUM HERO SECTION (Rebuilt Bottom Cards Design) --- */}
      <section className="relative pt-24 pb-12 lg:pt-32 overflow-hidden min-h-[90vh] flex flex-col justify-start">
        {/* Background Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          >
            <source src="/banner.mp4" type="video/mp4" />
          </video>
          
          {/* Brand Color Tint Overlay */}
          <div className="absolute inset-0 bg-brand-accent/20 mix-blend-color" />
          
          {/* Gradient Fades for seamless blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-accent/15 rounded-[100%] blur-[120px] mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full text-center mt-6 lg:mt-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6 animate-fade-in-up">
            <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">🏆 #1 {modeLabel} Firm Comparator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tighter mb-6 leading-[1.1] animate-fade-in-up w-full">
            <span className="text-white block pb-2">Find & Compare Top {modeLabel} Firms</span>
            <span className="block py-1 bg-brand-gradient bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]" style={{ filter: `drop-shadow(0 4px 20px var(--brand-glow))` }}>Trade Smarter Earn Bigger</span>
          </h1>

          <p className="max-w-2xl lg:max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Elevate your trading journey. Compare top-tier prop firms using our verified data, in-depth reviews, and exclusive real-time insights to find your perfect match.
          </p>

          {/* Feature Badges - Marquee on Mobile, Flex on Desktop */}
          <div className="mb-16 animate-fade-in-up flex justify-center w-full" style={{ animationDelay: '0.1s' }}>
            <style>{`
              @keyframes scroll-badges {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll-badges {
                animation: scroll-badges 15s linear infinite;
              }
            `}</style>

            {/* Desktop View (hidden on mobile) */}
            <div className="hidden md:flex flex-wrap justify-center gap-4 px-2">
              {[
                { icon: Shield, text: `50+ Verified Top ${modeLabel} Firms` },
                { icon: BarChart3, text: '1000+ Challenges' },
                { icon: Users, text: '9000+ Real Trader Reviews' },
                { icon: Globe, text: '4M+ Monthly Website Views' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-4 py-2 hover:bg-white/10 hover:border-brand-accent/30 transition-colors">
                  <stat.icon size={16} className="text-brand-accent shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-neutral-300 whitespace-nowrap">{stat.text}</span>
                </div>
              ))}
            </div>

            {/* Mobile View (Marquee, hidden on desktop) */}
            <div className="md:hidden relative w-screen -mx-4 flex overflow-x-hidden py-1">
              <div className="flex animate-scroll-badges w-max">
                {/* First set of badges */}
                <div className="flex gap-3 px-3">
                  {[
                    { icon: Shield, text: `50+ Verified Top ${modeLabel} Firms` },
                    { icon: BarChart3, text: '1000+ Challenges' },
                    { icon: Users, text: '9000+ Real Trader Reviews' },
                    { icon: Globe, text: '4M+ Monthly Website Views' }
                  ].map((stat, i) => (
                    <div key={`m1-${i}`} className="flex items-center gap-2 bg-[#181611]/80 border border-white/5 rounded-full px-3 py-1.5 shrink-0">
                      <stat.icon size={14} className="text-brand-accent shrink-0" />
                      <span className="text-[11px] font-semibold text-neutral-300 whitespace-nowrap">{stat.text}</span>
                    </div>
                  ))}
                </div>
                {/* Second set of badges (for seamless loop) */}
                <div className="flex gap-3 px-3" aria-hidden="true">
                  {[
                    { icon: Shield, text: `50+ Verified Top ${modeLabel} Firms` },
                    { icon: BarChart3, text: '1000+ Challenges' },
                    { icon: Users, text: '9000+ Real Trader Reviews' },
                    { icon: Globe, text: '4M+ Monthly Website Views' }
                  ].map((stat, i) => (
                    <div key={`m2-${i}`} className="flex items-center gap-2 bg-[#181611]/80 border border-white/5 rounded-full px-3 py-1.5 shrink-0">
                      <stat.icon size={14} className="text-brand-accent shrink-0" />
                      <span className="text-[11px] font-semibold text-neutral-300 whitespace-nowrap">{stat.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fade edges */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>

          {/* BOTTOM CARDS CONTAINER — No payout toast, tighter padding, real data */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in-up relative mx-auto w-full max-w-[1300px]" style={{ animationDelay: '0.2s' }}>

            {/* Exclusive Offers Card (colspan 8) */}
            <div className="lg:col-span-8 bg-[#110f0a] border border-brand-accent/15 rounded-2xl p-3 sm:p-4 pb-3 relative overflow-hidden group shadow-xl flex flex-col">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent pointer-events-none"></div>
               
               <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                   Exclusive Offers <Flame size={16} className="text-brand-accent drop-shadow-brand-glow" />
                 </h3>
                 <div className="flex items-center gap-2 shrink-0">
                   {totalOffersPages > 1 && (
                     <span className="text-neutral-500 text-[10px] font-semibold">{offersPage + 1}/{totalOffersPages}</span>
                   )}
                   <div className="flex gap-1.5">
                     <button
                       onClick={() => setOffersPage(p => Math.max(0, p - 1))}
                       disabled={offersPage === 0}
                       className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
                         offersPage === 0
                           ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                           : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/15 hover:text-white'
                       }`}
                     >
                       <ChevronLeft size={14}/>
                     </button>
                     <button
                       onClick={() => setOffersPage(p => Math.min(totalOffersPages - 1, p + 1))}
                       disabled={offersPage >= totalOffersPages - 1}
                       className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
                         offersPage >= totalOffersPages - 1
                           ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed'
                           : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/15 hover:text-white'
                       }`}
                     >
                       <ChevronRight size={14}/>
                     </button>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:grid-rows-[repeat(2,1fr)] gap-2.5 relative z-10 flex-1">
                 {paginatedOffers.map((firm, i) => (
                   <div key={firm.id || i} className="bg-[#0a0908] border border-white/5 rounded-xl p-3 pr-3 flex items-center justify-between hover:border-brand-accent/30 hover:bg-[#0f0d0a] transition-all duration-300">
                     <div className="flex items-center gap-2.5 min-w-0">
                       <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={firm.logo} alt={firm.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="text-left min-w-0">
                         <h4 className="text-white text-sm font-bold tracking-tight mb-0.5 truncate">{firm.name}</h4>
                         <div className="flex items-center gap-1">
                           <span className="text-brand-accent text-[11px] font-bold leading-none">{Number(firm.rating).toFixed(1)}</span>
                           <div className="flex gap-[1px]">
                             {[1,2,3,4,5].map(s=><Star key={s} size={8} className={s <= Math.round(Number(firm.rating)) ? "text-brand-accent fill-brand-accent" : "text-neutral-700 fill-neutral-700"}/>)}
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="flex flex-col gap-1.5 shrink-0 pl-2">
                        <div className="border border-white/10 text-white/90 text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center justify-between gap-1.5 bg-white/5 w-[80px] whitespace-nowrap">
                          <span>{firm.discountValue ? `${firm.discountValue}% OFF` : 'DEAL'}</span>
                          <Gift size={9} className="text-brand-accent shrink-0"/>
                        </div>
                        <button
                          onClick={() => handleCopyCode(firm)}
                          className="bg-brand-gradient text-black text-[9px] font-black px-2.5 py-1 rounded-full flex items-center justify-between gap-1.5 shadow-brand-glow w-[80px] whitespace-nowrap hover:shadow-brand-neon hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <span className="tracking-wide">{firm.promoCode || 'NOBLE'}</span>
                          <Copy size={9} className="stroke-[2.5] shrink-0"/>
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Popular Prop Firms (colspan 4) */}
            <div className="lg:col-span-4 bg-[#110f0a] border border-brand-accent/15 rounded-2xl p-3 sm:p-4 flex flex-col shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-bl from-brand-accent/5 to-transparent pointer-events-none"></div>
               <div className="flex items-center justify-center mb-4 relative z-10">
                 <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                   Top Rated Firms <Trophy size={16} className="text-brand-accent drop-shadow-brand-glow" />
                 </h3>
               </div>
               
               <div className="flex-1 flex flex-col gap-2.5 relative z-10">
                 {showcaseFirms.map((firm, i) => (
                   <div key={firm.id || i} className="bg-[#0a0908] border border-white/5 rounded-xl p-2 pr-2.5 flex items-center justify-between hover:border-brand-accent/30 hover:bg-[#0f0d0a] transition-all duration-300 w-full">
                     <div className="flex items-center gap-2 min-w-0">
                       <div className="w-7 flex items-center justify-center shrink-0">
                         {i === 0 ? <Trophy size={16} className="text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" /> :
                          i === 1 ? <Trophy size={16} className="text-[#cbd5e1] drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" /> :
                          i === 2 ? <Trophy size={16} className="text-[#b45309] drop-shadow-[0_0_8px_rgba(180,83,9,0.6)]" /> :
                          <span className="text-neutral-500 font-black text-xs">#{i + 1}</span>}
                       </div>
                       <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
                          {firm.logo ? <img src={firm.logo} alt={firm.name} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-[10px]">{firm.name.charAt(0)}</span>}
                       </div>
                       <div className="text-left min-w-0">
                         <h4 className="text-white text-xs font-bold tracking-tight mb-0.5 truncate">{firm.name}</h4>
                         <div className="flex items-center gap-1">
                           <span className="text-brand-accent text-[10px] font-bold leading-none">{firm.rating.toFixed(1)}</span>
                           <div className="flex gap-[1px]">
                             {[1,2,3,4,5].map(s=><Star key={s} size={7} className={s <= Math.floor(firm.rating) ? "text-brand-accent fill-brand-accent" : "text-neutral-700 fill-neutral-700"}/>)}
                           </div>
                         </div>
                       </div>
                     </div>
                     <div className="flex flex-col gap-1 shrink-0 pl-1">
                        <div className="border border-white/10 text-white/90 text-[9px] font-bold px-2 py-[3px] rounded-full flex items-center justify-between gap-1 bg-white/5 w-[76px] whitespace-nowrap">
                          <span>DEAL</span>
                          <Gift size={8} className="text-brand-accent shrink-0"/>
                        </div>
                        <button
                          onClick={() => {
                            const matchedFirm = topFirms.find(f => f.name === firm.name);
                            if (matchedFirm) handleCopyCode(matchedFirm);
                          }}
                          className="bg-brand-gradient text-black text-[9px] font-black px-2 py-[3px] rounded-full flex items-center justify-between gap-1 shadow-brand-glow w-[76px] whitespace-nowrap hover:shadow-brand-neon hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <span className="tracking-wide">NOBLE</span>
                          <Copy size={8} className="stroke-[2.5] shrink-0"/>
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

          </div>
          
          <div className="w-full max-w-[1300px] mx-auto flex justify-end mt-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <Link to={getModePath('/firms')}>
                <button className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors border border-white/5 bg-white/5 rounded-full px-5 py-2 hover:bg-white/10 hover:border-white/10 shadow-lg">
                   View All {modeLabel} Firms <ArrowRight size={14} />
                </button>
             </Link>
          </div>
        </div>

        {/* ── PROMO CODE COPIED POPUP ── */}
        {copiedFirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setCopiedFirm(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
              className="relative bg-[#111] border border-brand-accent/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-brand-glow animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button onClick={() => setCopiedFirm(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
                <X size={18} />
              </button>

              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white text-lg font-bold text-center mb-1">Code Copied!</h3>
              <p className="text-neutral-400 text-sm text-center mb-5">Use this code at checkout for your discount</p>

              {/* Code Display */}
              <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-2xl px-5 py-3 flex items-center justify-center gap-3 mb-5">
                <span className="text-brand-accent text-2xl font-black tracking-widest">{copiedFirm.code}</span>
                <CheckCircle2 size={18} className="text-green-400" />
              </div>

              {/* Firm Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={copiedFirm.logo} alt={copiedFirm.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-bold text-sm truncate">{copiedFirm.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-brand-accent text-xs font-bold">{copiedFirm.rating.toFixed(1)}</span>
                      <div className="flex gap-[1px]">
                        {[1,2,3,4,5].map(s => <Star key={s} size={9} className={s <= Math.round(copiedFirm.rating) ? 'text-brand-accent fill-brand-accent' : 'text-neutral-700 fill-neutral-700'} />)}
                      </div>
                    </div>
                    <span className="text-green-400 text-xs font-bold">{copiedFirm.discount}</span>
                  </div>
                </div>
              </div>

              {/* Visit Website Button */}
              {copiedFirm.affiliate && (
                <a
                  href={copiedFirm.affiliate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-brand-gradient text-black font-black text-sm rounded-full py-3 text-center hover:shadow-brand-neon hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Visit {copiedFirm.name} →
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Top Rated Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-accent/[0.08] border border-brand-accent/20 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
                <Trophy className="w-3.5 h-3.5 text-brand-accent" />
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Top Performers 2026</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
                Highest Rated <span className="text-brand-accent">{modeLabel} Firms</span>
              </h2>
              <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
                Firms that have consistently delivered payouts and transparent trading conditions, vetted by our community.
              </p>
            </div>
            <Link to={getModePath('/firms')} className="shrink-0">
              <button className="group flex items-center gap-2 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-xl text-white font-semibold text-xs hover:bg-brand-accent hover:text-black hover:border-brand-accent transition-all duration-300">
                View All Firms <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Firms Grid with Ranking Integration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topFirms.map((firm, index) => (
              <FirmCard 
                key={firm.id} 
                firm={firm} 
                rank={index + 1}
                className={index < 3 ? 'scale-100' : 'scale-95 opacity-90 hover:scale-100 hover:opacity-100 transition-all duration-500'} 
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link to={getModePath('/firms')}>
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/10 text-white font-bold rounded-2xl hover:bg-brand-accent hover:text-black hover:border-brand-accent transition-all duration-300 shadow-brand-glow">
                <span>Explore All {modeLabel} Firms</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-neutral-600 text-xs mt-4">Updated daily with verified data from 85+ prop trading firms</p>
          </div>
        </div>
      </section>



      {/* --- FEATURE BENTO GRID (PREMIUM V3) --- */}
      <section className="py-28 relative z-20 overflow-hidden">
        <style>{`
          @keyframes gauge-fill { from { stroke-dashoffset: 251; } }
          .bento-v3 { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
          .bento-v3:hover { transform: translateY(-6px); }
          @keyframes pulse-border { 0%, 100% { border-color: rgba(246,174,19,0.15); } 50% { border-color: rgba(255,0,0,0.4); } }
        `}</style>

        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#111010] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand-accent/[0.08] border border-brand-accent/20 rounded-full px-4 py-1.5 mb-5">
              <Award className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">Why We're Different</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Built for <span className="text-brand-accent">Serious Traders</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed">
              Everything you need to find, compare, and get funded by the right prop firm &mdash; backed by real data.
            </p>
          </div>

          {/* ====== ROW 1: Hero Stat Banner (Full Width) ====== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { value: '85+', label: 'Firms Compared', icon: <TrendingUp className="w-4 h-4" /> },
              { value: '$42M+', label: 'Payouts Tracked', icon: <Shield className="w-4 h-4" /> },
              { value: '150K+', label: 'Active Traders', icon: <Users className="w-4 h-4" /> },
              { value: '50+', label: 'Data Points Per Firm', icon: <Cpu className="w-4 h-4" /> },
            ].map((stat, i) => (
              <div key={i} className="group relative rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] p-5 text-center hover:border-[#333] transition-all overflow-hidden">
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center text-brand-accent mx-auto mb-3 group-hover:bg-[#1a1a1a] transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-0.5 tracking-tight group-hover:text-brand-accent transition-colors">{stat.value}</div>
                  <div className="text-neutral-500 text-[9px] uppercase tracking-wider font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ====== ROW 2: Main Feature Cards (8+4 split) ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">

            {/* CARD: Deep Data Comparison (8 col) */}
            <div className="lg:col-span-8 relative rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden group hover:border-[#333] transition-colors">
              <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row gap-6">
                {/* Text Side */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-brand-accent mb-4 shadow-sm group-hover:bg-[#1a1a1a] transition-all">
                      <TrendingUp size={18} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">Deep Data Comparison</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-5">
                      Filter 50+ data points side-by-side. Drawdown rules, news trading, commissions, hidden fees &mdash; we read the fine print so you don't have to.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {['Side-by-Side', 'Real-time', 'Filterable', '85+ Firms'].map((tag, i) => (
                      <span key={i} className="text-[9px] font-bold bg-[#111] border border-[#222] text-neutral-300 px-2.5 py-1 rounded-md hover:border-brand-primary/30 transition-colors cursor-default">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Mini Comparison Table */}
                <div className="w-full md:w-[280px] flex-shrink-0 rounded-xl overflow-hidden self-start">
                  <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden group-hover:border-[#333] transition-colors">
                    <div className="px-4 py-2.5 border-b border-[#222] flex items-center justify-between bg-[#0a0a0a]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
                        <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Live Comparison</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[8px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">{mode === 'futures' ? 'Topstep' : mode === 'crypto' ? 'CryptoFund' : 'FTMO'}</span>
                        <span className="text-[8px] font-bold text-neutral-500 bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">Other</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { metric: 'Profit Split', a: '90%', b: '80%', pct: 90 },
                        { metric: 'Max Drawdown', a: '10%', b: '12%', pct: 83 },
                        { metric: 'Payout Speed', a: '24hr', b: '48hr', pct: 100 },
                        { metric: 'News Trading', a: '✓', b: '✗', pct: 100 },
                      ].map((row, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-[10px] mb-1.5">
                            <span className="text-neutral-500 font-bold">{row.metric}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-brand-accent">{row.a}</span>
                              <span className="text-neutral-600 text-[8px]">vs</span>
                              <span className="font-bold text-neutral-400">{row.b}</span>
                            </div>
                          </div>
                          <div className="w-full bg-[#0a0a0a] rounded-full h-1 border border-[#1f1f1f]">
                            <div className="bg-brand-accent h-1 rounded-full" style={{ width: `${row.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Exclusive Deals (4 col) */}
            <div className="lg:col-span-4 relative rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden group hover:border-[#333] transition-colors">
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-accent via-amber-500 to-transparent"></div>
              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-brand-accent shadow-sm group-hover:bg-[#1a1a1a] transition-all">
                      <Zap size={18} />
                    </div>
                    <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2 py-1 rounded border border-brand-accent/20">Exclusive</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Deal Flow</h3>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-5">
                    Up to 20% off challenges + 125% refund offers you won't find anywhere else.
                  </p>
                </div>
                {/* Stacked Discount Badges */}
                <div className="space-y-2">
                  {[
                    { firm: 'FTMO', discount: '15% OFF', savings: '$45', hot: false },
                    { firm: 'Funding Pips', discount: '20% OFF', savings: '$80', hot: true },
                    { firm: 'The5ers', discount: '10% OFF', savings: '$30', hot: false },
                  ].map((deal, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-all ${deal.hot ? 'bg-brand-accent/5 border-brand-accent/20' : 'bg-[#111] border-[#222]'} group-hover:border-[#333]`}>
                      <div>
                        <span className="font-bold text-white text-[11px] block">{deal.firm}</span>
                        <span className="text-[9px] text-neutral-500 font-medium">Save {deal.savings}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${deal.hot ? 'bg-brand-accent text-black' : 'bg-[#1a1a1a] text-brand-accent border border-[#333]'}`}>{deal.discount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ====== ROW 3: Bottom Feature Cards (5+7 split) ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* CARD: TrustGuard Score (5 col) */}
            <div className="lg:col-span-5 relative rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden group hover:border-[#333] transition-colors">
              <div className="relative z-[2] p-6 md:p-8">
                <div className="w-10 h-10 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-emerald-400 mb-4 shadow-sm group-hover:bg-[#1a1a1a] transition-all">
                  <Shield size={18} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">TrustGuard&trade; Score</h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                  Proprietary algorithm that monitors payouts, reviews, and regulation compliance in real-time.
                </p>

                {/* Gauge + Legend */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#1f1f1f" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="26" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white font-bold text-xl leading-none mt-1">9.2</span>
                      <span className="text-emerald-400 text-[7px] font-bold uppercase tracking-wider mt-0.5">Excellent</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'Payout Verified', pct: 96 },
                      { label: 'Community Trust', pct: 92 },
                      { label: 'Regulation Score', pct: 88 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[9px] mb-1">
                          <span className="text-neutral-400 font-bold">{item.label}</span>
                          <span className="text-emerald-400 font-bold">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-[#111] rounded-full h-1 border border-[#222]">
                          <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Trader Community (7 col) */}
            <div className="lg:col-span-7 relative rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] overflow-hidden group hover:border-[#333] transition-colors">
              <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center text-violet-400 mb-4 shadow-sm group-hover:bg-[#1a1a1a] transition-all">
                      <Users size={18} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Trader Community</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-5">
                      50,000+ funded traders sharing reviews, strategies, and verified payout proofs.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['bg-violet-500', 'bg-purple-600', 'bg-fuchsia-500', 'bg-indigo-500', 'bg-violet-400'].map((bg, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full ${bg} border border-[#0a0a0a] flex items-center justify-center text-[7px] font-bold text-white shadow-sm`} style={{ zIndex: 50 - i * 10 }}>
                          {['JT', 'MK', 'AS', 'DL', 'RK'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">50,000+</div>
                      <div className="text-neutral-500 text-[8px] uppercase tracking-wider font-bold">Active Members</div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="w-full md:w-[240px] flex-shrink-0 bg-[#111] rounded-xl border border-[#222] overflow-hidden self-start">
                  <div className="px-4 py-2 border-b border-[#222] flex items-center justify-between bg-[#0a0a0a]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Live Feed</span>
                    </div>
                    <span className="text-[8px] text-neutral-600 font-medium">Just now</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {[
                      { user: 'JT', action: 'verified a $12.4K payout from', firm: mode === 'futures' ? 'Apex Trader' : mode === 'crypto' ? 'Funding Pips' : 'FTMO', color: 'text-brand-accent' },
                      { user: 'MK', action: 'left a 5-star review on', firm: mode === 'futures' ? 'Topstep' : mode === 'crypto' ? 'The5ers' : 'Funding Pips', color: 'text-violet-400' },
                      { user: 'AS', action: 'saved $240 using discount at', firm: mode === 'futures' ? 'MyFundedFutures' : mode === 'crypto' ? 'E8 Markets' : 'The5ers', color: 'text-emerald-400' },
                      { user: 'DL', action: 'compared 3 firms and chose', firm: mode === 'futures' ? 'Earn2Trade' : mode === 'crypto' ? 'FTMO' : 'E8 Markets', color: 'text-blue-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-md bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[7px] font-bold text-violet-300 flex-shrink-0 mt-0.5">{item.user}</div>
                        <p className="text-neutral-500 text-[10px] leading-snug">
                          <span className="text-neutral-300 font-bold">{item.user}</span> {item.action} <span className={`${item.color} font-bold`}>{item.firm}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-accent/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-accent/[0.08] border border-brand-accent/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
                <Terminal className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                How It <span className="text-brand-accent">Works</span>
              </h2>
              <p className="text-neutral-400 max-w-lg text-base leading-relaxed">
                From comparison to funded trader in three simple steps. No guesswork, no hidden surprises.
              </p>
            </div>
            <Link to={getModePath('/firms')} className="shrink-0">
              <button className="group inline-flex items-center gap-2 bg-brand-gradient hover:bg-brand-neon text-black font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 shadow-brand-glow">
                Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Steps — Horizontal rows */}
          <div className="space-y-5">
            {[
              {
                step: '01',
                title: 'Compare Firms',
                desc: 'Filter and compare 85+ prop firms across 50+ data points including profit splits, drawdown rules, payout speed, commissions, and hidden fees — all in one powerful dashboard.',
                icon: <TrendingUp size={24} />,
                highlight: '85+ Firms',
                highlightSub: 'in our database',
              },
              {
                step: '02',
                title: 'Save with Discounts',
                desc: 'Access exclusive deals up to 20% off challenges and 125% refund offers. We negotiate directly with firms so you save hundreds on every purchase — money back in your pocket.',
                icon: <Zap size={24} />,
                highlight: 'Up to 20%',
                highlightSub: 'off challenges',
              },
              {
                step: '03',
                title: 'Get Funded',
                desc: 'Choose your firm with confidence using our TrustGuard™ algorithm and 50,000+ verified community reviews. Know exactly what you\'re getting before you commit a single dollar.',
                icon: <Shield size={24} />,
                highlight: '50K+',
                highlightSub: 'verified reviews',
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden">
                {/* Glassmorphic border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-primary/25 group-hover:via-brand-primary/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>

                <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
                  {/* Left: Number + Icon */}
                  <div className="flex items-center gap-5 md:w-[280px] shrink-0">
                    <div className="text-5xl md:text-6xl font-black text-white/[0.06] leading-none select-none group-hover:text-brand-primary/10 transition-colors">{item.step}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all duration-300 shadow-lg shadow-brand-primary/5">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-brand-primary transition-colors">{item.title}</h3>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Step {item.step}</div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Description */}
                  <p className="text-neutral-400 text-sm leading-relaxed flex-1 md:pt-1">{item.desc}</p>

                  {/* Right: Highlight Stat */}
                  <div className="md:w-[140px] shrink-0 text-right hidden md:block">
                    <div className="text-2xl font-black text-brand-accent">{item.highlight}</div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{item.highlightSub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[400px] bg-brand-primary/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[300px] bg-violet-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-accent/[0.08] border border-brand-accent/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 text-brand-accent fill-brand-accent" />
              <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">Trader Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              What Traders <span className="text-brand-accent">Say</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Real traders, real results. Hear from our community of 50,000+ funded traders.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="mb-5">
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-accent/20 via-brand-accent/10 to-white/[0.02]"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex flex-col items-center md:items-start gap-4 md:w-[200px] shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-brand-accent flex items-center justify-center text-xl font-black text-black shadow-lg shadow-brand-accent/10">JT</div>
                  <div className="text-center md:text-left">
                    <div className="text-white font-bold text-lg">James T.</div>
                    <div className="text-neutral-500 text-sm">Funded Trader</div>
                    <div className="flex items-center gap-0.5 mt-2 justify-center md:justify-start">
                      {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />))}
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-center">
                    <div className="text-emerald-400 font-black text-lg">$12,400</div>
                    <div className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-wider">Payout via FTMO</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-brand-accent/20 text-6xl font-serif leading-none mb-4">"</div>
                  <p className="text-neutral-200 text-lg md:text-xl leading-relaxed font-medium -mt-8">
                    PropNoble saved me $380 on my FTMO challenge and helped me find a firm with same-day payouts. The comparison tool is a game-changer — I compared 12 firms in 5 minutes and found the perfect one for my trading style. The TrustGuard score gave me confidence I wasn't throwing money away. Every funded trader needs this platform.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold bg-brand-accent/10 text-brand-accent px-3 py-1.5 rounded-lg border border-brand-accent/20">Saved $380</span>
                    <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">Same-day payout</span>
                    <span className="text-[11px] font-semibold bg-violet-500/10 text-violet-400 px-3 py-1.5 rounded-lg border border-violet-500/20">Compared 12 firms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              {
                name: 'Sarah K.', role: 'Prop Trader',
                quote: "I was about to sign up with a firm that had terrible payout records — 3+ week delays and hidden conditions. The TrustGuard score warned me at 4.2/10 and I switched to a 9.2-rated firm instead. Best decision I ever made.",
                payout: '$8,200', firm: 'Funding Pips', avatar: 'SK', avatarColor: 'bg-violet-500',
                tag: 'Avoided scam firm', tagColor: 'bg-red-500/10 text-red-400 border-red-500/20',
              },
              {
                name: 'David R.', role: 'Full-time Trader',
                quote: "The exclusive discounts alone have saved me over $1,200 across three challenges. Plus the community reviews are incredibly detailed — real traders sharing payout proofs and honest experiences. Can't trade without it now.",
                payout: '$24,800', firm: 'The5ers', avatar: 'DR', avatarColor: 'bg-emerald-500',
                tag: 'Saved $1,200+', tagColor: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] group-hover:from-brand-accent/25 group-hover:via-brand-accent/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                <div className="relative z-[2] p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${item.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>{item.avatar}</div>
                      <div>
                        <div className="text-white font-bold text-sm">{item.name}</div>
                        <div className="text-neutral-500 text-xs">{item.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />))}
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-5">"{item.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${item.tagColor}`}>{item.tag}</span>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-sm">{item.payout}</div>
                      <div className="text-neutral-600 text-[10px] uppercase tracking-wider">via {item.firm}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-5 h-5 text-brand-accent fill-brand-accent" />))}
              </div>
              <span className="text-white font-black text-xl ml-2">4.9</span>
              <span className="text-neutral-500 text-sm">/5</span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="text-neutral-400 text-sm">Based on <span className="text-white font-bold">2,400+</span> verified trader reviews</div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">TrustGuard™ Verified</span>
            </div>
          </div>
        </div>
      </section>
      {/* ====== PLATFORM COMPARISON ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] bg-brand-primary/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-emerald-500/[0.015] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary/[0.08] border border-brand-primary/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <LineChart className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">The Difference</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              PropNoble vs <span className="text-neutral-500">Going Solo</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Stop wasting hours researching. See why thousands of traders trust us over the old way.
            </p>
          </div>

          {/* Two-Column Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

            {/* LEFT: PropNoble Card (Gold Highlighted) */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-primary/30 via-brand-primary/15 to-brand-primary/5"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2]">
                {/* Card Header */}
                <div className="px-7 py-5 border-b border-brand-primary/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/10">
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">PropNoble</div>
                      <div className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-wider">Recommended</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-black bg-brand-primary px-3 py-1 rounded-full uppercase tracking-wider">Free</span>
                </div>

                {/* Feature Rows */}
                <div className="p-5 space-y-0">
                  {[
                    { icon: <TrendingUp size={16} />, title: 'Firm Comparison', value: '85+ firms, side-by-side', desc: 'Filter by 50+ data points instantly' },
                    { icon: <Zap size={16} />, title: 'Exclusive Discounts', value: 'Up to 20% off', desc: 'Plus 125% refund offers' },
                    { icon: <Shield size={16} />, title: 'Trust Verification', value: 'TrustGuard™ algorithm', desc: 'Real-time payout & review monitoring' },
                    { icon: <Users size={16} />, title: 'Community Reviews', value: '50K+ verified traders', desc: 'Honest reviews & payout proofs' },
                    { icon: <Cpu size={16} />, title: 'Research Time', value: '5 minutes', desc: 'Everything in one dashboard' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-primary/[0.03] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                        {row.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-white font-bold text-sm">{row.title}</span>
                          <span className="text-emerald-400 text-xs font-bold shrink-0">{row.value}</span>
                        </div>
                        <p className="text-neutral-500 text-xs">{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="px-7 py-4 border-t border-brand-primary/10 flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ Save $200-400</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ 5 min research</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ Verified data</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Going Solo Card (Dim/Neutral) */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01]"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2]">
                {/* Card Header */}
                <div className="px-7 py-5 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                      <span className="text-neutral-500 text-lg">🔍</span>
                    </div>
                    <div>
                      <div className="text-neutral-400 font-bold text-sm">Manual Research</div>
                      <div className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">The old way</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-600 bg-white/[0.04] px-3 py-1 rounded-full uppercase tracking-wider border border-white/[0.06]">Risky</span>
                </div>

                {/* Feature Rows */}
                <div className="p-5 space-y-0">
                  {[
                    { title: 'Firm Comparison', value: 'Visit each site individually', desc: 'No side-by-side, easy to miss details' },
                    { title: 'Discounts', value: 'No access', desc: 'Pay full price every time' },
                    { title: 'Trust Verification', value: 'Guesswork & hope', desc: 'No payout or review verification' },
                    { title: 'Community', value: 'Random forum posts', desc: 'Unverified, often biased reviews' },
                    { title: 'Research Time', value: '10+ hours', desc: 'Spread across dozens of sites' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400/60 flex-shrink-0 mt-0.5">
                        <span className="text-xs">✗</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-neutral-400 font-bold text-sm">{row.title}</span>
                          <span className="text-neutral-600 text-xs font-medium shrink-0">{row.value}</span>
                        </div>
                        <p className="text-neutral-600 text-xs">{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="px-7 py-4 border-t border-white/[0.04] flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ Full price</span>
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ 10+ hours</span>
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ Unverified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-primary/15 via-brand-primary/10 to-brand-primary/15"></div>
            <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
            <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-white mb-1">Ready to trade smarter?</h3>
                <p className="text-neutral-400 text-sm">Join 50,000+ traders who found their perfect firm — in under 5 minutes.</p>
              </div>
              <Link to="/firms" className="shrink-0">
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-primary to-amber-500 hover:from-amber-500 hover:to-brand-primary text-black font-bold rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(246,174,19,0.25)] hover:shadow-[0_4px_30px_rgba(255,0,0,0.4)]">
                  <span>Start Comparing Now — It's Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-brand-primary/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary/[0.08] border border-brand-primary/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
              Frequently Asked <span className="text-gradient-red">Questions</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-base leading-relaxed">
              Got questions? We've got answers. Here's everything you need to know about PropNoble.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is PropNoble really free?',
                a: 'Yes, 100% free — forever. We make money through affiliate partnerships with prop firms, which means you never pay a cent to use our comparison tools, reviews, or data. We also earn commissions from exclusive discount codes, which actually saves YOU money.',
              },
              {
                q: 'How does the TrustGuard™ score work?',
                a: 'TrustGuard™ is our proprietary algorithm that analyzes multiple factors including: verified payout records, payout speed consistency, community review sentiment, firm age and track record, rule transparency, and customer support quality. Scores are updated in real-time and range from 1-10.',
              },
              {
                q: 'Are the reviews on PropNoble genuine?',
                a: 'Absolutely. Every review goes through our verification process. We require proof of purchase (challenge receipt) and prioritize reviews with payout screenshots. Fake reviews are detected by our AI system and removed. We have over 50,000 verified trader reviews.',
              },
              {
                q: 'How do I find the best prop firm for me?',
                a: 'Use our comparison tool to filter firms by what matters most to you — profit split, drawdown rules, payout speed, account size, challenge price, and more. You can compare up to 4 firms side-by-side. Our AI matching tool can also recommend firms based on your trading style and preferences.',
              },
              {
                q: 'Do the discount codes actually work?',
                a: 'Yes! We negotiate exclusive deals directly with prop firms. Our discounts range from 10-20% off challenge fees, and some firms offer 125% refund offers exclusively through PropNoble. We verify every code regularly and remove expired ones immediately.',
              },
              {
                q: 'How often is the data updated?',
                a: 'Our core firm data (rules, pricing, profit splits) is verified weekly. TrustGuard™ scores update in real-time based on new reviews and payout reports. Discount codes are checked daily. If a firm changes its rules, we typically update within 24 hours.',
              },
              {
                q: 'Can I submit a firm to be listed?',
                a: 'Yes! If you know of a prop firm that isn\'t listed on PropNoble, you can submit it through our contact page. Our team will verify the firm, collect data, and add it to the platform — usually within 1-2 weeks.',
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.08),transparent)]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-primary/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-amber-500/[0.02] rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-primary/[0.08] border border-brand-primary/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Your Journey Starts Here</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Stop <span className="text-gradient-red">Overpaying</span> for Challenges.
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare 85+ prop firms, access exclusive discounts, and find your perfect match — all in one place, completely free.
          </p>

          {/* Mini Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10">
            {[
              { val: '85+', label: 'Firms' },
              { val: '$42M+', label: 'Verified' },
              { val: '50K+', label: 'Traders' },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-5 bg-white/10 hidden sm:block"></div>}
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-lg">{stat.val}</span>
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link to="/firms">
              <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-primary to-amber-500 hover:from-amber-500 hover:to-brand-primary text-black font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(246,174,19,0.3)] hover:shadow-[0_4px_40px_rgba(246,174,19,0.5)] hover:scale-[1.02]">
                <span>Start Comparing Free</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/offers">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 bg-transparent border border-white/10 hover:border-brand-primary/30 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:bg-white/[0.02]">
                <Bookmark size={18} className="text-brand-primary" />
                <span>View Exclusive Deals</span>
              </button>
            </Link>
          </div>

          {/* Trust message */}
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
            <Shield className="w-4 h-4 text-emerald-400/60" />
            <span>No sign-up required · 100% free · Trusted by 50,000+ traders</span>
          </div>
        </div>
      </section>

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
