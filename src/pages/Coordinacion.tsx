import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getApprovedMembers } from '@/services/memberService';
import { StarField } from '@/components/StarField';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Moon, User, MapPin, Lightbulb, Clock, Droplets, Sun, ShieldCheck, Backpack, Smartphone, Loader2 } from 'lucide-react';

export default function Coordinacion() {
  const { data: approved = [], isLoading } = useQuery({
    queryKey: ['approved-members'],
    queryFn: getApprovedMembers,
  });
  const earlyBirds = useMemo(() => approved.filter(m => m.earlyQueueInterest), [approved]);
  const solos = useMemo(() => approved.filter(m => m.arrivalMode === 'sola/o'), [approved]);

  const tips = [
    { icon: Droplets, title: 'Lleva agua suficiente', desc: 'Hidratarte es esencial, especialmente si llegas temprano.' },
    { icon: Sun, title: 'Protección solar', desc: 'Si haces cola de día, lleva bloqueador y sombrero.' },
    { icon: Backpack, title: 'Mochila ligera', desc: 'Lleva solo lo necesario: agua, snacks, cargador, documentos.' },
    { icon: Smartphone, title: 'Batería cargada', desc: 'Asegúrate de tener batería para coordinarte con el grupo.' },
    { icon: ShieldCheck, title: 'Documenta tu entrada', desc: 'Ten capturas guardadas en tu teléfono de tu compra (no las compartas).' },
    { icon: MapPin, title: 'Ubica las salidas', desc: 'Al llegar al venue, identifica salidas de emergencia y puntos de encuentro.' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const MemberChip = ({ m }: { m: any }) => (
    <div className="card-premium rounded-xl p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
        {m.nickname.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{m.nickname}</p>
        <p className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3" /> {m.arrivalTime} · {m.district}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 relative">
      <StarField count={30} />
      <div className="container mx-auto px-4 relative z-10 space-y-16">
        <AnimatedSection>
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Coordinación Previa</h1>
            <p className="text-muted-foreground">Organicémonos para el 07 de octubre – Campo C</p>
          </div>
        </AnimatedSection>

        {/* Early Queue */}
        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Moon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Cola de madrugada</h2>
            </div>
            <p className="text-muted-foreground">
              {earlyBirds.length} ARMY{earlyBirds.length !== 1 ? 's' : ''} quiere{earlyBirds.length === 1 ? '' : 'n'} hacer cola de madrugada
            </p>
            {earlyBirds.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {earlyBirds.map(m => <MemberChip key={m.id} m={m} />)}
              </div>
            ) : (
              <div className="glass-premium rounded-xl p-8 text-center text-muted-foreground">Aún no hay ARMYs registradas para cola de madrugada</div>
            )}
          </section>
        </AnimatedSection>

        {/* Solos */}
        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">ARMYs que van solas/os</h2>
            </div>
            <p className="text-muted-foreground">
              {solos.length} ARMY{solos.length !== 1 ? 's' : ''} irá{solos.length === 1 ? '' : 'n'} sin compañía. ¡Conectémonos!
            </p>
            {solos.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {solos.map(m => <MemberChip key={m.id} m={m} />)}
              </div>
            ) : (
              <div className="glass-premium rounded-xl p-8 text-center text-muted-foreground">Todas las ARMYs registradas irán acompañadas</div>
            )}
          </section>
        </AnimatedSection>

        {/* Meeting Point */}
        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Punto de encuentro sugerido</h2>
            </div>
            <div className="glass-premium rounded-2xl p-6 space-y-3 glow-purple-intense">
              <p className="text-foreground font-medium">Por definir con el grupo 📍</p>
              <p className="text-sm text-muted-foreground">
                Una vez que más ARMYs se registren, definiremos un punto de encuentro seguro cerca del venue para Campo C.
                Pronto publicaremos la ubicación exacta.
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* Tips */}
        <AnimatedSection>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Recomendaciones para Campo C</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((t, i) => (
                <motion.div
                  key={t.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="card-premium p-5 flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <t.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{t.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
