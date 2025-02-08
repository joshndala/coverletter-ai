"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const linkClass = (path: string) => `
    block p-3 rounded
    ${pathname === path 
      ? 'bg-secondary text-secondary-foreground' 
      : 'text-primary-foreground hover:bg-secondary/90 hover:text-secondary-foreground'
    }
  `;

  return (
    <div className="w-64 bg-primary min-h-screen p-4">
      {/* Logo at the top */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/coverforme_logo.png"
          alt="CoverForMe Logo"
          width={200}
          height={100}
          priority
        />
      </div>

      <nav className="space-y-3">
        <Link 
          href="/dashboard" 
          className={linkClass('/dashboard')}
        >
          Dashboard
        </Link>
        <Link 
          href="/skills-and-experiences" 
          className={linkClass('/skills-and-experiences')}
        >
          Professional Profile
        </Link>
        <Link 
          href="/generate-cover-letter" 
          className={linkClass('/generate-cover-letter')}
        >
          Generate Cover Letter
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;