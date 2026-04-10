import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getApprovedMembers } from '@/services/memberService';
import { computeStats } from '@/utils/stats';
import { StarField } from '@/components/StarField';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Users, Music, MapPin, Heart, Clock, User, Moon, UserCheck, Loader2 } from 'lucide-react';

export default function Stats() {
  const { data: approved = [], isLoading } = useQuery({
    queryKey: ['approved-members'],
    queryFn: getApprovedMembers,
  });
  const s = computeStats(approved);

  const cards = [
    { icon: Users, label: 'Total ARMYs verificadas', value: s.total },
    { icon: Heart, label: 'Bias más popular', value: s.topBias || '—' },
    { icon: Music, label: 'Álbum más elegido', value: s.topAlbum || '—' },
    { icon: MapPin, label: 'Distrito con más ARMYs', value: s.topDistrict || '—' },
    { icon: User, label: 'Van solas/os', value: s.soloCount },
    { icon: Users, label: 'Van acompañadas/os', value: s.accompaniedCount },
    { icon: Moon, label: 'Cola de madrugada', value: s.earlyQueueCount },
    { icon: Clock, label: 'Hora más común', value: s.commonArrivalTime || '—' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative">
      <StarField count={30} />
      <div className="container mx-auto px-4 relative z-10 space-y-12">
        <AnimatedSection>
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Estadísticas de Campo C</h1>
            <p className="text-muted-foreground">Datos en tiempo real de nuestra comunidad verificada</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card-premium p-6 text-center space-y-2"
            >
              <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </motion.div>
          ))}
        </div>

        {s.latestMember && (
          <AnimatedSection delay={0.2}>
            <div className="glass-premium rounded-2xl p-6 glow-purple-intense text-center space-y-2">
              <UserCheck className="mx-auto h-7 w-7 text-primary" />
              <p className="text-sm text-muted-foreground">Última ARMY verificada</p>
              <p className="text-xl font-bold text-foreground">{s.latestMember.nickname}</p>
              <p className="text-xs text-muted-foreground">{s.latestMember.district} · {s.latestMember.bias}</p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
