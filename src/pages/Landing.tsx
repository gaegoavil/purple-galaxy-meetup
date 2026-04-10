import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { StarField } from '@/components/StarField';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AnimatedSection } from '@/components/AnimatedSection';
import { getApprovedMembers } from '@/services/memberService';
import { computeStats } from '@/utils/stats';
import { Users, Music, MapPin, Heart, Clock, Shield } from 'lucide-react';

function Countdown() {
  const target = new Date('2026-10-07T00:00:00-05:00').getTime();
  const [diff, setDiff] = useState(target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (diff <= 0) return <p className="text-2xl font-bold text-gradient">¡El día llegó! 🔥</p>;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const units = [
    { v: d, l: 'Días' }, { v: h, l: 'Horas' }, { v: m, l: 'Min' }, { v: s, l: 'Seg' },
  ];
  return (
    <div className="flex gap-3 justify-center">
      {units.map((u, i) => (
        <motion.div
          key={u.l}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
          className="glass-premium rounded-xl px-4 py-3 min-w-[70px] text-center animate-pulse-glow"
        >
          <div className="text-2xl md:text-3xl font-bold text-primary">{u.v}</div>
          <div className="text-xs text-muted-foreground">{u.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const heroChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Landing() {
  const { data: approved = [] } = useQuery({
    queryKey: ['approved-members'],
    queryFn: getApprovedMembers,
  });
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

  const arirangTags = ['Tradición', 'Unidad', 'Fuerza', 'Orgullo', 'Emoción', 'Borahae'];

  return (
    <div className="min-h-screen">
      {/* Hero with cover image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background cover image */}
        <div className="absolute inset-0">
          <img
            src="/images/arirang-cover.jpg"
            alt="BTS ARIRANG World Tour"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
          {/* Red atmospheric glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent" />
        </div>
        <AuroraBackground className="opacity-40" />
        <StarField count={60} />
        <motion.div
          className="container mx-auto px-4 relative z-10 text-center space-y-10"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-5">
            <motion.p variants={heroChild} className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
              07 de octubre · Campo Sección C
            </motion.p>
            <motion.h1
              variants={heroChild}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-gradient-intense leading-tight tracking-tight uppercase"
            >
              BTS WORLD TOUR
              <br />
              <span className="text-6xl md:text-8xl lg:text-9xl">ARIRANG</span>
            </motion.h1>
            <motion.p variants={heroChild} className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
              Coordinación y seguridad para ARMYs de Campo C – 07 de octubre
            </motion.p>
          </div>
          <motion.div variants={heroChild} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base glow-red-intense hover:scale-105 transition-transform">
              <Link to="/registro">Quiero registrarme</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base hover:scale-105 transition-transform border-primary/30 hover:border-primary/60">
              <Link to="/comunidad">Ver ARMYs registradas</Link>
            </Button>
          </motion.div>
          <motion.div variants={heroChild}>
            <Countdown />
          </motion.div>
        </motion.div>
      </section>

      {/* Purpose */}
      <AnimatedSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gradient">¿Por qué esta comunidad?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Somos una comunidad organizada de ARMYs que asistirán a Campo C el 07 de octubre.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {purposeCards.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card-premium p-6 text-center space-y-3"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <c.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ARIRANG Mood — premium storytelling section */}
      <AnimatedSection>
        <section className="py-20 md:py-32 relative overflow-hidden">
          <AuroraBackground className="opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />
          <div className="container mx-auto px-4 relative z-10 text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-primary/70">La energía que nos une</p>
              <h2 className="text-4xl md:text-5xl font-black text-gradient-intense uppercase tracking-tight">
                ARIRANG
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Raíces profundas, orgullo colectivo y la emoción de estar juntas en un mismo campo.
              </p>
            </motion.div>

            {/* Featured panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-2xl mx-auto glass-premium rounded-3xl p-8 md:p-10 glow-red-intense relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="relative space-y-6">
                <p className="text-lg md:text-xl text-foreground/90 font-light leading-relaxed italic">
                  "ARIRANG es más que una canción. Es la promesa de que, sin importar la distancia, siempre encontraremos el camino de vuelta."
                </p>
                <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="flex flex-wrap justify-center gap-3">
                  {arirangTags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="glass rounded-full px-5 py-2 text-sm text-primary font-medium border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Live Stats */}
      <AnimatedSection>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient text-center">Nuestra comunidad en números</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {statsPreview.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card-premium p-6 text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 mt-12">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-gradient-intense font-bold text-lg uppercase tracking-wider">BTS WORLD TOUR ARIRANG – Campo C</p>
          <p className="text-sm text-muted-foreground">Hecho con dedicación por el army boy Giovanny Egoavil 💜 para ARMYs · 07 de octubre</p>
          <p className="text-xs text-muted-foreground">
            Este es un proyecto de fans independiente. No está afiliado a BIGHIT MUSIC ni a HYBE.
          </p>
        </div>
      </footer>

      {/* Floating mobile CTA */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <Button asChild size="lg" className="rounded-full shadow-2xl glow-red-intense">
          <Link to="/registro">🔥 Registro</Link>
        </Button>
      </div>
    </div>
  );
}
