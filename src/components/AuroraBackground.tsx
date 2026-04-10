/**
 * Cinematic aurora background layer – ARIRANG red/black concert atmosphere.
 */
export function AuroraBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      <div
        className="absolute -top-1/4 -left-1/4 w-[80%] h-[60%] rounded-full animate-aurora opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(0 80% 45% / 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[50%] rounded-full animate-aurora opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(348 70% 35% / 0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animationDelay: '4s',
          animationDirection: 'reverse',
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50%] h-[30%] rounded-full animate-aurora opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(15 60% 40% / 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDelay: '8s',
        }}
      />
    </div>
  );
}
