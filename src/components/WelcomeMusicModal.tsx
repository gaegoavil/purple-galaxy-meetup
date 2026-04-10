import { useAudio } from '@/contexts/AudioContext';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music, VolumeX } from 'lucide-react';

const LS_KEY = 'lachimolala-music-pref';

export function WelcomeMusicModal() {
  const { hasInteracted, setHasInteracted, play } = useAudio();

  if (hasInteracted) return null;

  const choose = (withMusic: boolean) => {
    localStorage.setItem(LS_KEY, withMusic ? 'on' : 'off');
    setHasInteracted(true);
    if (withMusic) play();
  };

  return (
    <Dialog open onOpenChange={() => choose(false)}>
      <DialogContent className="sm:max-w-md glass border-primary/20 text-center">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl text-gradient">
            Bienvenida/o a Lachimolala 💜
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            ¿Quieres entrar con música?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Button onClick={() => choose(true)} className="glow-purple gap-2">
            <Music className="h-4 w-4" /> Entrar con música
          </Button>
          <Button variant="outline" onClick={() => choose(false)} className="gap-2">
            <VolumeX className="h-4 w-4" /> Entrar en silencio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
