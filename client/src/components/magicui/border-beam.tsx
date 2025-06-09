"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  reverse?: boolean;
  initialOffset?: number;
  style?: React.CSSProperties;
}

export const BorderBeam = ({
  className,
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = "#5729FF",
  colorTo = "#BFA8FF",
  reverse = false,
  initialOffset = 0,
  style,
}: BorderBeamProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className={cn(
          "absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className,
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          animation: `border-beam ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          animationDirection: reverse ? "reverse" : "normal",
          offsetDistance: `${initialOffset}%`,
          ...style,
        } as React.CSSProperties}
      />
    </div>
  );
};
