import { motion } from 'framer-motion';
import { StarField } from '@/components/StarField';
import { AnimatedSection } from '@/components/AnimatedSection';
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
        <AnimatedSection>
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">Normas y Seguridad</h1>
            <p className="text-muted-foreground">Reglas básicas para mantener segura nuestra comunidad de Campo C</p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {rules.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card-premium p-6 flex items-start gap-4"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <r.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="glass-premium rounded-2xl p-8 text-center space-y-3 glow-red-intense">
            <Shield className="mx-auto h-10 w-10 text-primary" />
            <p className="text-lg font-semibold text-foreground">Tu seguridad es nuestra prioridad</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Al registrarte en la comunidad ARIRANG Campo C aceptas estas normas. El incumplimiento puede resultar en la exclusión de la comunidad.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
