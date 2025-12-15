import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Search, Sprout, BookOpen, Sparkles, UserCircle } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center p-2 transition-colors duration-300 min-w-[60px] ${
        isActive ? 'text-china-red font-bold' : 'text-gray-500 hover:text-china-red'
      }`
    }
  >
    <Icon size={24} className="mb-1" />
    <span className="text-[10px] sm:text-xs whitespace-nowrap">{label}</span>
  </NavLink>
);

const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-rice-paper border-t border-stone-300 h-16 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:top-0 md:bottom-auto md:h-16 md:border-t-0 md:border-b">
      <div className="max-w-4xl mx-auto h-full flex justify-between px-4 items-center md:justify-center md:gap-12">
        <div className="hidden md:block absolute left-6 font-serif text-2xl font-bold text-china-red tracking-widest">
          寻味厨房
        </div>
        <NavItem to="/" icon={Sparkles} label="本命菜" />
        <NavItem to="/solar" icon={Sprout} label="时令" />
        <NavItem to="/search" icon={Search} label="寻味" />
        <NavItem to="/categories" icon={BookOpen} label="菜谱大全" />
        <NavItem to="/mine" icon={UserCircle} label="我的" />
      </div>
    </nav>
  );
};

export default Navigation;