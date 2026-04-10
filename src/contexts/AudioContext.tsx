import { createContext, useContext, useRef, useState, useCallback, useEffect, ReactNode } from 'react';

// ─── PLAYLIST CONFIG ─────────────────────────────────────────────
// Add more songs here to create a playlist. For now we have one track.
const TRACKS = [
  { src: '/audio/body-to-body.mp3', name: 'Body to Body – BTS' },
  // { src: '/audio/another-song.mp3', name: 'Another Song – BTS' },
];
// ─────────────────────────────────────────────────────────────────

interface AudioContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  trackName: string;
  hasError: boolean;
  hasInteracted: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
  restart: () => void;
  setHasInteracted: (v: boolean) => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}

const LS_KEY = 'lachimolala-music-pref';

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackIndex] = useState(0); // ready for playlist
  const [hasError, setHasError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => localStorage.getItem(LS_KEY) !== null);

  const track = TRACKS[trackIndex];

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(track.src);
    audio.loop = true; // single-track loop
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration);
    const onError = () => setHasError(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.src]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setHasError(true));
  }, []);
  const pause = useCallback(() => { audioRef.current?.pause(); }, []);
  const togglePlay = useCallback(() => { isPlaying ? pause() : play(); }, [isPlaying, pause, play]);
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(m => !m);
  }, [isMuted]);
  const setVolume = useCallback((v: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);
  const seek = useCallback((t: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = t;
  }, []);
  const restart = useCallback(() => { seek(0); play(); }, [seek, play]);

  return (
    <Ctx.Provider value={{
      isPlaying, isMuted, volume, progress, duration, currentTime,
      trackName: track.name, hasError, hasInteracted,
      play, pause, togglePlay, toggleMute, setVolume, seek, restart,
      setHasInteracted,
    }}>
      {children}
    </Ctx.Provider>
  );
}
