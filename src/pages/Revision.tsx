// TODO: Este módulo usa una contraseña temporal enviada via Edge Function.
// Debe reemplazarse con autenticación real via Supabase Auth + roles de admin (tabla user_roles con RLS).

import { useState, useCallback, useEffect } from 'react';
import { adminListMembers, adminUpdateStatus } from '@/services/memberService';
import { Member, MemberStatus } from '@/types/member';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, Eye, XCircle, User, MapPin, Heart, Music, Ticket, Users, LogOut, Lock, ShieldAlert, Loader2 } from 'lucide-react';

const ADMIN_SESSION_KEY = 'lachimolala_admin_session';
const ADMIN_PW_KEY = 'lachimolala_admin_pw';

function getStoredPassword(): string | null {
  return sessionStorage.getItem(ADMIN_PW_KEY);
}

function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' && !!getStoredPassword();
}

function setAdminSession(password: string | null) {
  if (password) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    sessionStorage.setItem(ADMIN_PW_KEY, password);
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PW_KEY);
  }
}

// --- Password Gate ---

function AdminLoginGate({ onAuth }: { onAuth: (password: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validate password by attempting to list members
      await adminListMembers(password, 'pending');
      setAdminSession(password);
      onAuth(password);
    } catch {
      setError('Contraseña incorrecta. Intenta de nuevo.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16 max-w-md flex flex-col items-center">
      <Card className="glass glow-purple w-full">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-gradient">Área Restringida</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Este panel es de uso interno exclusivo para la moderación de Lachimolala.</p>
          <p className="text-muted-foreground text-xs mt-1">Ingresa la contraseña de administrador para continuar.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="glass"
              autoFocus
            />
            {error && (
              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

// --- Review panel ---

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

function MemberReviewCard({ member, onStatusChange, updating }: { member: Member; onStatusChange: (id: string, status: MemberStatus) => void; updating: string | null }) {
  const config = STATUS_CONFIG[member.status];
  const isUpdating = updating === member.id;

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
            <Button size="sm" onClick={() => onStatusChange(member.id, 'approved')} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-foreground">
              {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />} Aprobar
            </Button>
          )}
          {member.status !== 'under_review' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(member.id, 'under_review')} disabled={isUpdating}>
              <Eye className="h-3.5 w-3.5 mr-1" /> En revisión
            </Button>
          )}
          {member.status !== 'rejected' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(member.id, 'rejected')} disabled={isUpdating} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <XCircle className="h-3.5 w-3.5 mr-1" /> Rechazar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Revision() {
  const [authed, setAuthed] = useState(isAdminAuthenticated);
  const [password, setPasswordState] = useState<string>(getStoredPassword() || '');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MemberStatus>('pending');

  const loadMembers = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const data = await adminListMembers(pw);
      setMembers(data);
    } catch {
      // If auth fails, force re-login
      setAdminSession(null);
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = useCallback((pw: string) => {
    setPasswordState(pw);
    setAuthed(true);
    loadMembers(pw);
  }, [loadMembers]);

  const handleLogout = () => {
    setAdminSession(null);
    setAuthed(false);
    setMembers([]);
  };

  const handleStatusChange = useCallback(async (id: string, status: MemberStatus) => {
    setUpdating(id);
    try {
      await adminUpdateStatus(password, id, status);
      // Reload all members
      await loadMembers(password);
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  }, [password, loadMembers]);

  // Auto-load on mount if session exists
  useEffect(() => {
    if (authed && password) {
      loadMembers(password);
    }
  }, []);

  if (!authed) {
    return <AdminLoginGate onAuth={handleAuth} />;
  }

  const byStatus = (status: MemberStatus) => members.filter(m => m.status === status);
  const counts: Record<MemberStatus, number> = {
    pending: byStatus('pending').length,
    under_review: byStatus('under_review').length,
    approved: byStatus('approved').length,
    rejected: byStatus('rejected').length,
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gradient">Panel de Revisión</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadMembers(password)} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Recargar
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mb-6">Gestiona los registros de ARMYs para Campo C.</p>

      {loading && members.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as MemberStatus)}>
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
                    <MemberReviewCard key={m.id} member={m} onStatusChange={handleStatusChange} updating={updating} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
