import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

const TRACKS = [
  { src: '/audio/body-to-body.mp3', name: 'Body to Body – BTS' },
  { src: '/audio/song-2.mp3', name: 'DNA – BTS' },
  { src: '/audio/song-3.mp3', name: 'Blood Sweat & Tears – BTS' },
  { src: '/audio/song-4.mp3', name: 'SWIM – BTS' },
  { src: '/audio/song-5.mp3', name: 'Save Me – BTS' },
  { src: '/audio/song-6.mp3', name: 'Boy With Luv – BTS' },
];

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
  currentTrackIndex: number;
  totalTracks: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
  restart: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
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
  const [trackIndex, setTrackIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(
    () => localStorage.getItem(LS_KEY) !== null
  );

  const track = TRACKS[trackIndex];

  const nextTrack = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  useEffect(() => {
    const wasPlaying = audioRef.current ? !audioRef.current.paused : false;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.src);
    audio.loop = TRACKS.length === 1;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.preload = 'auto';

    audioRef.current = audio;
    setHasError(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };

    const onMeta = () => {
      setDuration(audio.duration || 0);
    };

    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      if (TRACKS.length > 1) {
        setTrackIndex((prev) => (prev + 1) % TRACKS.length);
      }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    if (wasPlaying) {
      audio.play().catch(() => setHasError(true));
    }

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [track.src, volume, isMuted]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setHasError(true));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !audioRef.current.muted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  const setVolume = useCallback((v: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);

  const seek = useCallback((t: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = t;
  }, []);

  const restart = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  return (
    <Ctx.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        progress,
        duration,
        currentTime,
        trackName: track.name,
        hasError,
        hasInteracted,
        currentTrackIndex: trackIndex,
        totalTracks: TRACKS.length,
        play,
        pause,
        togglePlay,
        toggleMute,
        setVolume,
        seek,
        restart,
        nextTrack,
        prevTrack,
        setHasInteracted,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
