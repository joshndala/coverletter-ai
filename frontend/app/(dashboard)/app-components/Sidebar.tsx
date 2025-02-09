"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, UserCircle, FileText } from 'lucide-react';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Professional Profile',
    href: '/skills-and-experiences',
    icon: UserCircle
  },
  {
    label: 'Generate Cover Letter',
    href: '/generate-cover-letter',
    icon: FileText
  }
];

const Sidebar = () => {
  const pathname = usePathname();

  const linkClass = (path: string) => `
    block p-3 rounded flex items-center
    ${pathname === path 
      ? 'bg-secondary text-secondary-foreground' 
      : 'text-primary-foreground hover:bg-secondary/90 hover:text-secondary-foreground'
    }
  `;

  return (
    <div className="w-64 bg-primary min-h-screen p-4 flex flex-col">
      {/* Logo at the top */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/coverforme_logo_transparent.png"
          alt="CoverForMe Logo"
          width={200}
          height={100}
          priority
        />
      </div>

      <nav className="space-y-3 flex-1">
        {navigationItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className={linkClass(item.href)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <button
        className="flex items-center p-3 w-full text-primary-foreground hover:bg-secondary/90 hover:text-secondary-foreground rounded"
        onClick={() => {
          // Add logout logic here
          console.log('Logout clicked');
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;