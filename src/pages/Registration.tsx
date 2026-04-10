import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StarField } from '@/components/StarField';
import { memberService } from '@/services/memberService';
import { BTS_MEMBERS, BTS_ALBUMS, type MemberFormData, type BTSMember, type ArrivalMode } from '@/types/member';
import { Heart, Loader2 } from 'lucide-react';

const arrivalTimes = ['03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00'];
const armySinceYears = Array.from({length:13},(_,i)=>`${2013+i}`);

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [district, setDistrict] = useState('');
  const [country, setCountry] = useState('Perú');
  const [bias, setBias] = useState('');
  const [biasWrecker, setBiasWrecker] = useState('');
  const [favoriteAlbum, setFavoriteAlbum] = useState('');
  const [favoriteSong, setFavoriteSong] = useState('');
  const [armySince, setArmySince] = useState('');
  const [arrivalMode, setArrivalMode] = useState<ArrivalMode>('sola/o');
  const [arrivalTime, setArrivalTime] = useState('');
  const [earlyQueue, setEarlyQueue] = useState(false);
  const [confirmsOct, setConfirmsOct] = useState(false);
  const [confirmsCampoC, setConfirmsCampoC] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [instagram, setInstagram] = useState('');
  const [message, setMessage] = useState('');

  function validate() {
    const e: Record<string,string> = {};
    if (!nickname.trim()) e.nickname = 'Ingresa tu nombre o apodo ARMY';
    if (nickname.trim().length > 50) e.nickname = 'Máximo 50 caracteres';
    if (!district.trim()) e.district = 'Ingresa tu distrito o ciudad';
    if (!bias) e.bias = 'Selecciona tu bias';
    if (!favoriteAlbum) e.favoriteAlbum = 'Selecciona un álbum';
    if (!favoriteSong.trim()) e.favoriteSong = 'Ingresa tu canción favorita';
    if (!armySince) e.armySince = 'Selecciona desde cuándo eres ARMY';
    if (!arrivalTime) e.arrivalTime = 'Selecciona hora de llegada';
    if (!confirmsOct) e.confirmsOct = 'Debes confirmar tu asistencia el 07 de octubre';
    if (!confirmsCampoC) e.confirmsCampoC = 'Debes confirmar que tu zona es Campo C';
    if (!hasTicket) e.hasTicket = 'Debes confirmar que tienes entrada';
    if (!acceptedRules) e.acceptedRules = 'Debes aceptar las normas de seguridad';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate latency

    const data: MemberFormData = {
      nickname: nickname.trim(),
      age: age ? parseInt(age) : undefined,
      district: district.trim(),
      country: country.trim() || 'Perú',
      bias: bias as BTSMember,
      biasWrecker: biasWrecker ? biasWrecker as BTSMember : undefined,
      favoriteAlbum, favoriteSong: favoriteSong.trim(), armySince,
      arrivalMode, arrivalTime,
      earlyQueueInterest: earlyQueue,
      confirmsOctober7: confirmsOct,
      confirmsZonaCampoC: confirmsCampoC,
      hasConfirmedTicket: hasTicket,
      acceptedSafetyRules: acceptedRules,
      instagram: instagram.trim() || undefined,
      message: message.trim() || undefined,
    };
    memberService.register(data);
    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <StarField count={60} />
        <div className="glass rounded-3xl p-10 md:p-16 max-w-md text-center space-y-6 glow-purple relative z-10">
          <Heart className="mx-auto h-16 w-16 text-primary animate-float" />
          <h2 className="text-3xl font-bold text-gradient">¡Borahae! 💜</h2>
          <p className="text-muted-foreground">
            Tu registro fue enviado exitosamente. Está <span className="text-primary font-semibold">pendiente de verificación</span>. 
            Una vez aprobado, aparecerás en el muro de Campo C.
          </p>
          <Button onClick={() => { setSuccess(false); setNickname(''); setAge(''); setDistrict(''); setBias(''); setBiasWrecker(''); setFavoriteAlbum(''); setFavoriteSong(''); setArmySince(''); setArrivalMode('sola/o'); setArrivalTime(''); setEarlyQueue(false); setConfirmsOct(false); setConfirmsCampoC(false); setHasTicket(false); setAcceptedRules(false); setInstagram(''); setMessage(''); }} variant="outline">
            Registrar otra ARMY
          </Button>
        </div>
      </div>
    );
  }

  const field = (name: string, label: string, children: React.ReactNode, helper?: string) => (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>
      {children}
      {helper && !errors[name] && <p className="text-xs text-muted-foreground">{helper}</p>}
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen py-12 relative">
      <StarField count={40} />
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Únete a Lachimolala</h1>
          <p className="text-muted-foreground">Regístrate para ser parte de nuestra comunidad de Campo C – 07 de octubre</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-10 space-y-6 glow-purple">
          {/* Identity */}
          <div className="space-y-1 pb-2 border-b border-border/50">
            <h3 className="font-semibold text-primary text-lg">Identidad ARMY</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {field('nickname', 'Nombre o apodo ARMY *',
              <Input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="Tu nombre o nick ARMY" maxLength={50} className="bg-background/50" />
            )}
            {field('age', 'Edad',
              <Input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Opcional" min={13} max={99} className="bg-background/50" />,
              'Opcional'
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {field('district', 'Distrito o ciudad *',
              <Input value={district} onChange={e=>setDistrict(e.target.value)} placeholder="Ej: Miraflores, Lima" maxLength={100} className="bg-background/50" />
            )}
            {field('country', 'País',
              <Input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Perú" maxLength={50} className="bg-background/50" />,
              'Por defecto: Perú'
            )}
          </div>

          {/* BTS Preferences */}
          <div className="space-y-1 pb-2 border-b border-border/50 pt-4">
            <h3 className="font-semibold text-primary text-lg">Preferencias BTS</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {field('bias', 'Bias *',
              <Select value={bias} onValueChange={setBias}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>{BTS_MEMBERS.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {field('biasWrecker', 'Bias wrecker',
              <Select value={biasWrecker} onValueChange={setBiasWrecker}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Opcional" /></SelectTrigger>
                <SelectContent>{BTS_MEMBERS.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>,
              'Opcional'
            )}
          </div>
          {field('favoriteAlbum', 'Álbum favorito *',
            <Select value={favoriteAlbum} onValueChange={setFavoriteAlbum}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Selecciona un álbum" /></SelectTrigger>
              <SelectContent>{BTS_ALBUMS.map(a=><SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {field('favoriteSong', 'Canción favorita *',
            <Input value={favoriteSong} onChange={e=>setFavoriteSong(e.target.value)} placeholder="Ej: Spring Day" maxLength={100} className="bg-background/50" />
          )}
          {field('armySince', 'ARMY desde *',
            <Select value={armySince} onValueChange={setArmySince}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Año" /></SelectTrigger>
              <SelectContent>{armySinceYears.map(y=><SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          )}

          {/* Event Details */}
          <div className="space-y-1 pb-2 border-b border-border/50 pt-4">
            <h3 className="font-semibold text-primary text-lg">Detalles del evento</h3>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">¿Irás sola/o o acompañada/o? *</Label>
            <RadioGroup value={arrivalMode} onValueChange={v=>setArrivalMode(v as ArrivalMode)} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="sola/o" id="solo" />
                <Label htmlFor="solo">Sola/o</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="acompañada/o" id="accompanied" />
                <Label htmlFor="accompanied">Acompañada/o</Label>
              </div>
            </RadioGroup>
          </div>
          {field('arrivalTime', '¿A qué hora planeas llegar? *',
            <Select value={arrivalTime} onValueChange={setArrivalTime}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Hora aprox." /></SelectTrigger>
              <SelectContent>{arrivalTimes.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          )}
          <div className="flex items-center gap-3">
            <Checkbox id="earlyQueue" checked={earlyQueue} onCheckedChange={v=>setEarlyQueue(!!v)} />
            <Label htmlFor="earlyQueue">¿Te interesa hacer cola de madrugada?</Label>
          </div>

          {/* Verification */}
          <div className="space-y-1 pb-2 border-b border-border/50 pt-4">
            <h3 className="font-semibold text-primary text-lg">Verificación</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Checkbox id="confirmsOct" checked={confirmsOct} onCheckedChange={v=>setConfirmsOct(!!v)} />
                <Label htmlFor="confirmsOct">¿Confirmas que asistirás el 07 de octubre? *</Label>
              </div>
              {errors.confirmsOct && <p className="text-xs text-destructive ml-7">{errors.confirmsOct}</p>}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Checkbox id="confirmsCampoC" checked={confirmsCampoC} onCheckedChange={v=>setConfirmsCampoC(!!v)} />
                <Label htmlFor="confirmsCampoC">¿Tu zona es Campo C? *</Label>
              </div>
              {errors.confirmsCampoC && <p className="text-xs text-destructive ml-7">{errors.confirmsCampoC}</p>}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Checkbox id="hasTicket" checked={hasTicket} onCheckedChange={v=>setHasTicket(!!v)} />
                <Label htmlFor="hasTicket">¿Tienes entrada confirmada? *</Label>
              </div>
              {errors.hasTicket && <p className="text-xs text-destructive ml-7">{errors.hasTicket}</p>}
            </div>
          </div>

          {/* Proof placeholder */}
          <div className="space-y-2 opacity-50">
            <Label>Comprobante (próximamente)</Label>
            <Input disabled placeholder="Subida de imagen disponible pronto" className="bg-background/50" />
            <p className="text-xs text-muted-foreground">Esta función estará habilitada próximamente para verificación</p>
          </div>

          {/* Social */}
          <div className="space-y-1 pb-2 border-b border-border/50 pt-4">
            <h3 className="font-semibold text-primary text-lg">Social y mensaje</h3>
          </div>
          {field('instagram', 'Instagram u otra red social',
            <Input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@tu_usuario" maxLength={100} className="bg-background/50" />,
            'Opcional – solo visible para miembros aprobadas'
          )}
          {field('message', 'Mensaje para la comunidad',
            <Textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Comparte algo con las ARMYs de Campo C..." maxLength={500} className="bg-background/50 resize-none" rows={3} />,
            'Opcional – máx. 500 caracteres'
          )}

          {/* Terms */}
          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Checkbox id="acceptedRules" checked={acceptedRules} onCheckedChange={v=>setAcceptedRules(!!v)} className="mt-0.5" />
              <Label htmlFor="acceptedRules" className="leading-relaxed">
                Acepto las normas de seguridad y convivencia del grupo Lachimolala. Me comprometo a cuidar la comunidad y no compartir datos sensibles. *
              </Label>
            </div>
            {errors.acceptedRules && <p className="text-xs text-destructive ml-7">{errors.acceptedRules}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full text-base glow-purple" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" /> Enviando...</> : 'Enviar registro 💜'}
          </Button>
        </form>
      </div>
    </div>
  );
}
