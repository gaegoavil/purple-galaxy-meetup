import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, Music, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react';

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function FloatingMusicPlayer() {
  const {
    isPlaying, isMuted, volume, progress, duration, currentTime,
    trackName, hasError, hasInteracted,
    togglePlay, toggleMute, setVolume, seek, restart,
  } = useAudio();
  const [expanded, setExpanded] = useState(false);

  if (!hasInteracted) return null;

  if (hasError) {
    return (
      <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 glass rounded-2xl p-3 flex items-center gap-2 text-sm text-destructive border border-destructive/30">
        <AlertCircle className="h-4 w-4" />
        <span>No se pudo cargar la música</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 glass rounded-2xl border border-primary/20 shadow-xl transition-all w-[260px]">
      {/* Compact bar */}
      <div className="flex items-center gap-2 p-2.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={togglePlay} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            <Music className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate">{trackName}</span>
          </div>
          {/* Mini progress */}
          <div className="h-1 mt-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setExpanded(e => !e)} aria-label="Expandir reproductor">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Expanded controls */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-2">
          {/* Seek */}
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([v]) => seek(v)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Volume + controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMute} aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={([v]) => setVolume(v)}
              className="flex-1 cursor-pointer"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={restart} aria-label="Reiniciar">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
