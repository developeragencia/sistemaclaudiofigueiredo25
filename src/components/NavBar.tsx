
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from './AnimatedLogo';
import { Menu, X, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isSistemasPage = location.pathname === '/sistemas';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoHover = () => {
    if (isSistemasPage) {
      setIsHovering(true);
      setTimeout(() => setIsHovering(false), 3000);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? 'bg-background/80 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between relative">
          <Link 
            to="/" 
            className="flex items-center"
            onMouseEnter={handleLogoHover}
          >
            <AnimatedLogo 
              size={scrolled ? "sm" : "md"} 
              className="transition-all duration-300"
              hovering={isHovering}
            />
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex space-x-3">
            <NavButton to="/" label="Início" icon={<Home className="h-4 w-4" />} />
            <NavButton to="/admin" label="Admin" icon={<Settings className="h-4 w-4" />} />
          </div>
          
          <button
            className="md:hidden p-2 rounded-md hover:bg-primary/10 transition-colors touch-target"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-top">
          <div className="px-4 py-3 space-y-2">
            <MobileNavButton to="/" label="Início" icon={<Home className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavButton to="/admin" label="Admin" icon={<Settings className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavButtonProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to === '/admin' && location.pathname.startsWith('/admin'));

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <Button 
          variant={isActive ? "default" : "outline"}
          size="sm"
          className={cn(
            "relative overflow-hidden group",
            isActive ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
          )}
        >
          {/* Shimmer effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <span className="flex items-center gap-1.5">
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.span>
            {label}
          </span>
        </Button>
      </motion.div>
    </Link>
  );
};

interface MobileNavButtonProps extends NavButtonProps {
  onClick: () => void;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ to, label, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to === '/admin' && location.pathname.startsWith('/admin'));

  return (
    <Link to={to} onClick={onClick} className="block w-full">
      <Button 
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start px-3 py-2 transition-all",
          isActive ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
        )}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </Button>
    </Link>
  );
};

export default NavBar;
