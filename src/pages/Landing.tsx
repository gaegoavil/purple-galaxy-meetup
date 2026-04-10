import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { memberService } from '@/services/memberService';
import { computeStats } from '@/utils/stats';
import { Users, Music, MapPin, Heart, Clock, Shield } from 'lucide-react';

function Countdown() {
  const target = new Date('2026-10-07T00:00:00-05:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (diff <= 0) return <p className="text-2xl font-bold text-gradient">¡El día llegó! 💜</p>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const units = [
    { v: d, l: 'Días' }, { v: h, l: 'Horas' }, { v: m, l: 'Min' }, { v: s, l: 'Seg' },
  ];
  return (
    <div className="flex gap-3 justify-center">
      {units.map(u => (
        <div key={u.l} className="glass rounded-xl px-4 py-3 min-w-[70px] text-center glow-purple">
          <div className="text-2xl md:text-3xl font-bold text-primary">{u.v}</div>
          <div className="text-xs text-muted-foreground">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  const approved = memberService.getApproved();
  const stats = computeStats(approved);

  const purposeCards = [
    { icon: Users, title: 'Organización', desc: 'Coordina tu llegada con otras ARMYs de Campo C' },
    { icon: Shield, title: 'Seguridad', desc: 'Cuida tus entradas y tu bienestar en grupo' },
    { icon: Heart, title: 'Comunidad', desc: 'Conoce a quienes estarán contigo el 7 de octubre' },
    { icon: Clock, title: 'Cola de madrugada', desc: 'Encuentra grupo para hacer cola desde temprano' },
  ];

  const statsPreview = [
    { label: 'ARMYs verificadas', value: stats.total },
    { label: 'Bias más popular', value: stats.topBias || '—' },
    { label: 'Irán solas/os', value: stats.soloCount },
    { label: 'Cola de madrugada', value: stats.earlyQueueCount },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <StarField count={80} />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">07 de octubre · Campo Sección C</p>
            <h1 className="text-4xl md:text-6xl font-bold text-gradient leading-tight">
              Lachimolala – Purple Wall Campo C
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Un espacio exclusivo de coordinación y seguridad para ARMYs del 07 de octubre en Campo C
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base glow-purple">
              <Link to="/registro">Quiero registrarme</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/comunidad">Ver ARMYs registradas</Link>
            </Button>
          </div>
          <Countdown />
        </div>
      </section>

      {/* Purpose */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">¿Por qué Lachimolala?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No somos un fan club general. Somos una comunidad organizada de ARMYs que asistirán a Campo C el 07 de octubre.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {purposeCards.map(c => (
              <div key={c.title} className="glass rounded-2xl p-6 text-center space-y-3 hover:glow-purple transition-shadow">
                <c.icon className="mx-auto h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARIRANG Mood */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">Inspiradas por ARIRANG</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            La energía de ARIRANG nos une: raíces profundas, orgullo colectivo y la emoción de estar juntas en un mismo campo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Tradición', 'Unidad', 'Fuerza', 'Orgullo', 'Emoción', 'Borahae'].map(tag => (
              <span key={tag} className="glass rounded-full px-5 py-2 text-sm text-primary font-medium glow-purple">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient text-center">Nuestra comunidad en números</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsPreview.map(s => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center glow-purple">
                <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 mt-12">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-gradient font-bold text-lg">Lachimolala – Purple Wall Campo C</p>
          <p className="text-sm text-muted-foreground">Hecho con 💜 por ARMYs, para ARMYs · 07 de octubre</p>
          <p className="text-xs text-muted-foreground">
            Este es un proyecto de fans independiente. No está afiliado a BIGHIT MUSIC ni a HYBE.
          </p>
        </div>
      </footer>

      {/* Floating mobile CTA */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <Button asChild size="lg" className="rounded-full shadow-2xl glow-purple">
          <Link to="/registro">💜 Registro</Link>
        </Button>
      </div>
    </div>
  );
}
