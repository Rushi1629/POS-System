import { Coffee } from "lucide-react";

interface ApiLoaderProps {
  message?: string;
  fullscreen?: boolean;
}

export function ApiLoader({
  message = "Brewing your request…",
  fullscreen = true,
}: ApiLoaderProps) {
  return (
    <div
      className={
        (fullscreen ? "fixed inset-0 z-50 " : "absolute inset-0 ") +
        "flex items-center justify-center bg-background/40 backdrop-blur-md"
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex flex-col items-center gap-6 rounded-2xl border border-border/40 bg-card/70 px-10 py-8 shadow-2xl backdrop-blur-xl">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-linear-to-br from-amber-500/20 via-orange-400/10 to-rose-500/20 blur-xl" />

        {/* Cup with rising steam */}
        <div className="relative flex h-20 w-20 items-end justify-center">
          {/* Steam */}
          <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-6 w-1 rounded-full bg-foreground/30"
                style={{
                  animation: `cafe-steam 1.6s ease-in-out ${i * 0.25}s infinite`,
                  filter: "blur(1px)",
                }}
              />
            ))}
          </div>

          {/* Cup */}
          <div className="relative flex h-14 w-16 items-center justify-center rounded-b-2xl rounded-t-md bg-linear-to-b from-amber-700 to-amber-900 shadow-inner">
            <Coffee className="h-6 w-6 text-amber-100/90" strokeWidth={2.2} />
            {/* Handle */}
            <span className="absolute -right-3 top-3 h-6 w-4 rounded-r-full border-4 border-amber-800" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Secret Cafe
          </p>
          <p className="text-sm text-foreground/90">{message}</p>

          {/* Bouncing dots */}
          <div className="mt-1 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-foreground/60"
                style={{
                  animation: `cafe-bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <span className="sr-only">Loading</span>
      </div>

      <style>{`
        @keyframes cafe-steam {
          0%   { transform: translateY(0) scaleX(1); opacity: 0; }
          30%  { opacity: 0.8; }
          100% { transform: translateY(-22px) scaleX(1.4); opacity: 0; }
        }
        @keyframes cafe-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default ApiLoader;
