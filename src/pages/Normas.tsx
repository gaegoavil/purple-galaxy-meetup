import { StarField } from '@/components/StarField';
import { Shield, Eye, Ticket, Heart, Users, AlertTriangle } from 'lucide-react';

const rules = [
  { icon: Eye, title: 'No compartir datos sensibles', desc: 'Nunca compartas fotos de tu entrada, QR, código de barras ni datos personales completos.' },
  { icon: Ticket, title: 'Cuidar tus entradas', desc: 'Mantén tu entrada segura. No publiques capturas ni detalles de compra.' },
  { icon: Heart, title: 'Apoyarnos entre ARMYs', desc: 'Si alguien necesita ayuda, ofrece tu apoyo. La solidaridad nos hace más fuertes.' },
  { icon: Users, title: 'Mantener el respeto', desc: 'Trata a todas las miembros con respeto. No se tolera discriminación ni agresión.' },
  { icon: Shield, title: 'Priorizar la seguridad del grupo', desc: 'Si ves algo sospechoso, avisa. La seguridad de todas es responsabilidad de todas.' },
  { icon: AlertTriangle, title: 'Denunciar irregularidades', desc: 'Si alguien intenta estafar, vender entradas falsas o poner en riesgo al grupo, reporta inmediatamente.' },
];

export default function Normas() {
  return (
    <div className="min-h-screen py-12 relative">
      <StarField count={30} />
      <div className="container mx-auto px-4 max-w-3xl relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Normas y Seguridad</h1>
          <p className="text-muted-foreground">Reglas básicas para mantener segura nuestra comunidad de Campo C</p>
        </div>

        <div className="space-y-4">
          {rules.map(r => (
            <div key={r.title} className="glass rounded-2xl p-6 flex items-start gap-4 hover:glow-purple transition-shadow">
              <r.icon className="h-7 w-7 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 text-center space-y-3 glow-purple">
          <Shield className="mx-auto h-10 w-10 text-primary" />
          <p className="text-lg font-semibold text-foreground">Tu seguridad es nuestra prioridad</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Al registrarte en Lachimolala aceptas estas normas. El incumplimiento puede resultar en la exclusión de la comunidad.
          </p>
        </div>
      </div>
    </div>
  );
}
