import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApprovedMembers } from '@/services/memberService';
import { filterMembers, sortMembers, getUniqueDistricts, type SortOption } from '@/utils/filters';
import { BTS_MEMBERS, type BTSMember, type ArrivalMode, type Member } from '@/types/member';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarField } from '@/components/StarField';
import { Search, LayoutGrid, List, Users, MapPin, Music, Clock, Heart, Loader2 } from 'lucide-react';

function ProfileCard({ member }: { member: Member }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3 hover:glow-purple transition-all group">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
          {member.nickname.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{member.nickname}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{member.district}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{member.bias}</Badge>
        {member.biasWrecker && <Badge variant="outline" className="text-xs">{member.biasWrecker}</Badge>}
        <Badge variant="secondary" className="text-xs">{member.arrivalMode === 'sola/o' ? '🙋 Sola/o' : '👥 Acompañada/o'}</Badge>
        {member.earlyQueueInterest && <Badge variant="secondary" className="text-xs">🌙 Madrugada</Badge>}
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1"><Music className="h-3 w-3" />{member.favoriteAlbum}</p>
        <p className="flex items-center gap-1"><Heart className="h-3 w-3" />{member.favoriteSong}</p>
        <p className="flex items-center gap-1"><Clock className="h-3 w-3" />Llegada: {member.arrivalTime}</p>
      </div>
      {member.message && (
        <p className="text-sm text-muted-foreground italic border-t border-border/50 pt-2">"{member.message}"</p>
      )}
      {member.instagram && <p className="text-xs text-primary">{member.instagram}</p>}
    </div>
  );
}

export default function CommunityWall() {
  const { data: approved = [], isLoading } = useQuery({
    queryKey: ['approved-members'],
    queryFn: getApprovedMembers,
  });

  const districts = useMemo(() => getUniqueDistricts(approved), [approved]);

  const [search, setSearch] = useState('');
  const [biasFilter, setBiasFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [arrivalModeFilter, setArrivalModeFilter] = useState<string>('all');
  const [earlyQueueFilter, setEarlyQueueFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [view, setView] = useState<'grid'|'list'>('grid');

  const filtered = useMemo(() => {
    const f = filterMembers(
      approved, search,
      biasFilter !== 'all' ? biasFilter as BTSMember : undefined,
      districtFilter !== 'all' ? districtFilter : undefined,
      arrivalModeFilter !== 'all' ? arrivalModeFilter as ArrivalMode : undefined,
      earlyQueueFilter === 'all' ? undefined : earlyQueueFilter === 'true',
    );
    return sortMembers(f, sort);
  }, [approved, search, biasFilter, districtFilter, arrivalModeFilter, earlyQueueFilter, sort]);

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
      <div className="container mx-auto px-4 relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Muro de Campo C</h1>
          <p className="text-muted-foreground">ARMYs verificadas que estarán el 07 de octubre 💜</p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre..." className="pl-10 bg-background/50" />
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant={view==='grid'?'default':'ghost'} onClick={()=>setView('grid')}><LayoutGrid className="h-4 w-4" /></Button>
              <Button size="icon" variant={view==='list'?'default':'ghost'} onClick={()=>setView('list')}><List className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Select value={biasFilter} onValueChange={setBiasFilter}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Bias" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {BTS_MEMBERS.map(m=><SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Distrito" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {districts.map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={arrivalModeFilter} onValueChange={setArrivalModeFilter}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Modo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="sola/o">Sola/o</SelectItem>
                <SelectItem value="acompañada/o">Acompañada/o</SelectItem>
              </SelectContent>
            </Select>
            <Select value={earlyQueueFilter} onValueChange={setEarlyQueueFilter}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Madrugada" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={v=>setSort(v as SortOption)}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Ordenar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="alphabetical">Alfabético</SelectItem>
                <SelectItem value="district">Distrito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {filtered.length} ARMY{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3 glow-purple">
            <Heart className="mx-auto h-12 w-12 text-primary animate-float" />
            <p className="text-lg font-semibold text-foreground">No se encontraron ARMYs</p>
            <p className="text-muted-foreground text-sm">Intenta con otros filtros o sé la primera en registrarte 💜</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(m => <ProfileCard key={m.id} member={m} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(m => (
              <div key={m.id} className="glass rounded-xl p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                  {m.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{m.nickname}</p>
                  <p className="text-xs text-muted-foreground">{m.district} · {m.bias} · {m.arrivalTime}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {m.earlyQueueInterest && <Badge variant="secondary" className="text-xs">🌙</Badge>}
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{m.arrivalMode === 'sola/o' ? '🙋' : '👥'}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
