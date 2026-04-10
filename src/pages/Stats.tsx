import { memberService } from '@/services/memberService';
import { computeStats } from '@/utils/stats';
import { StarField } from '@/components/StarField';
import { Users, Music, MapPin, Heart, Clock, User, Moon, UserCheck } from 'lucide-react';

export default function Stats() {
  const approved = memberService.getApproved();
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

  return (
    <div className="min-h-screen py-12 relative">
      <StarField count={30} />
      <div className="container mx-auto px-4 relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Estadísticas de Campo C</h1>
          <p className="text-muted-foreground">Datos en tiempo real de nuestra comunidad verificada</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(c => (
            <div key={c.label} className="glass rounded-2xl p-6 text-center space-y-2 hover:glow-purple transition-shadow">
              <c.icon className="mx-auto h-7 w-7 text-primary" />
              <div className="text-2xl md:text-3xl font-bold text-primary">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>

        {s.latestMember && (
          <div className="glass rounded-2xl p-6 glow-purple text-center space-y-2">
            <UserCheck className="mx-auto h-7 w-7 text-primary" />
            <p className="text-sm text-muted-foreground">Última ARMY verificada</p>
            <p className="text-xl font-bold text-foreground">{s.latestMember.nickname}</p>
            <p className="text-xs text-muted-foreground">{s.latestMember.district} · {s.latestMember.bias}</p>
          </div>
        )}
      </div>
    </div>
  );
}
