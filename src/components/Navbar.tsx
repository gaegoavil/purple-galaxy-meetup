import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/registro', label: 'Registro' },
  { to: '/comunidad', label: 'Comunidad' },
  { to: '/estadisticas', label: 'Estadísticas' },
  { to: '/normas', label: 'Normas' },
  { to: '/coordinacion', label: 'Coordinación' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-premium border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-gradient-intense tracking-wider uppercase">ARIRANG</Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${pathname === l.to ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-card/40'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/30 glass-premium">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm transition-colors ${pathname === l.to ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
