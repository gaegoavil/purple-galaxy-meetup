import { useState, useCallback } from 'react';
import { memberService } from '@/services/memberService';
import { Member, MemberStatus } from '@/types/member';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Eye, XCircle, User, MapPin, Heart, Music, Ticket, Users } from 'lucide-react';

const STATUS_CONFIG: Record<MemberStatus, { label: string; icon: React.ReactNode; badgeClass: string }> = {
  pending: { label: 'Pendiente', icon: <Clock className="h-4 w-4" />, badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  under_review: { label: 'En revisión', icon: <Eye className="h-4 w-4" />, badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  approved: { label: 'Aprobada', icon: <CheckCircle className="h-4 w-4" />, badgeClass: 'bg-green-500/20 text-green-300 border-green-500/30' },
  rejected: { label: 'Rechazada', icon: <XCircle className="h-4 w-4" />, badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-2 py-1.5 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground text-sm shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

function MemberReviewCard({ member, onStatusChange }: { member: Member; onStatusChange: (id: string, status: MemberStatus) => void }) {
  const config = STATUS_CONFIG[member.status];

  return (
    <Card className="glass glow-purple">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            {member.nickname}
          </CardTitle>
          <Badge className={`${config.badgeClass} flex items-center gap-1 text-xs`}>
            {config.icon} {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <InfoRow label="Distrito" value={<span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{member.district}</span>} />
        <InfoRow label="Bias" value={<span className="flex items-center gap-1"><Heart className="h-3 w-3 text-primary" />{member.bias}</span>} />
        <InfoRow label="Álbum favorito" value={<span className="flex items-center gap-1"><Music className="h-3 w-3" />{member.favoriteAlbum}</span>} />
        <InfoRow label="Confirma 7 de octubre" value={member.confirmsOctober7 ? '✅ Sí' : '❌ No'} />
        <InfoRow label="Zona Campo C" value={member.confirmsZonaCampoC ? '✅ Sí' : '❌ No'} />
        <InfoRow label="Entrada confirmada" value={<span className="flex items-center gap-1"><Ticket className="h-3 w-3" />{member.hasConfirmedTicket ? 'Sí' : 'No'}</span>} />
        <InfoRow label="Modo de llegada" value={<span className="flex items-center gap-1"><Users className="h-3 w-3" />{member.arrivalMode}</span>} />
        <InfoRow label="Hora de llegada" value={member.arrivalTime} />
        <InfoRow label="Cola de madrugada" value={member.earlyQueueInterest ? '✅ Sí' : '❌ No'} />
        <InfoRow label="Acepta normas" value={member.acceptedSafetyRules ? '✅ Sí' : '❌ No'} />
        {member.instagram && <InfoRow label="Instagram" value={`@${member.instagram}`} />}
        {member.message && <InfoRow label="Mensaje" value={member.message} />}

        <div className="flex flex-wrap gap-2 pt-4">
          {member.status !== 'approved' && (
            <Button size="sm" onClick={() => onStatusChange(member.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-foreground">
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Aprobar
            </Button>
          )}
          {member.status !== 'under_review' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(member.id, 'under_review')}>
              <Eye className="h-3.5 w-3.5 mr-1" /> En revisión
            </Button>
          )}
          {member.status !== 'rejected' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(member.id, 'rejected')} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <XCircle className="h-3.5 w-3.5 mr-1" /> Rechazar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Revision() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const allMembers = memberService.getAll();

  const handleStatusChange = (id: string, status: MemberStatus) => {
    memberService.updateStatus(id, status);
    refresh();
  };

  const byStatus = (status: MemberStatus) => allMembers.filter(m => m.status === status);
  const counts: Record<MemberStatus, number> = {
    pending: byStatus('pending').length,
    under_review: byStatus('under_review').length,
    approved: byStatus('approved').length,
    rejected: byStatus('rejected').length,
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-gradient mb-2">Panel de Revisión</h1>
      <p className="text-muted-foreground mb-6">Gestiona los registros de ARMYs para Campo C.</p>

      <Tabs defaultValue="pending">
        <TabsList className="glass mb-6 flex flex-wrap h-auto gap-1 p-1">
          {(Object.keys(STATUS_CONFIG) as MemberStatus[]).map(s => (
            <TabsTrigger key={s} value={s} className="flex items-center gap-1.5 text-sm">
              {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label} ({counts[s]})
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(STATUS_CONFIG) as MemberStatus[]).map(status => (
          <TabsContent key={status} value={status}>
            {byStatus(status).length === 0 ? (
              <Card className="glass p-8 text-center">
                <p className="text-muted-foreground">No hay miembros con estado "{STATUS_CONFIG[status].label}".</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {byStatus(status).map(m => (
                  <MemberReviewCard key={m.id} member={m} onStatusChange={handleStatusChange} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
