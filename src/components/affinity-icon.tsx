/**
 * Affinity icons for RAID: Shadow Legends.
 * Uses official game icons: Magic (blue swirl), Force (red skull), Spirit (green bolt), Void (purple triangle).
 */

const AFFINITY_DATA: Record<string, { color: string; bg: string; glow: string; icon: string }> = {
  Magic: {
    color: "#60A5FA",
    bg: "#1E3A5F",
    glow: "rgba(96, 165, 250, 0.4)",
    icon: "https://raidwiki.com/assets/images/RSL/Affinities/magic.png",
  },
  Force: {
    color: "#F87171",
    bg: "#5F1E1E",
    glow: "rgba(248, 113, 113, 0.4)",
    icon: "https://raidwiki.com/assets/images/RSL/Affinities/force.png",
  },
  Spirit: {
    color: "#4ADE80",
    bg: "#1E5F2E",
    glow: "rgba(74, 222, 128, 0.4)",
    icon: "https://raidwiki.com/assets/images/RSL/Affinities/spirit.png",
  },
  Void: {
    color: "#C084FC",
    bg: "#3D1E5F",
    glow: "rgba(192, 132, 252, 0.4)",
    icon: "https://raidwiki.com/assets/images/RSL/Affinities/void.png",
  },
};

interface AffinityIconProps {
  affinity: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function AffinityIcon({ affinity, size = 22, showLabel = false, className }: AffinityIconProps) {
  const data = AFFINITY_DATA[affinity];

  if (!data) {
    return (
      <span className={`text-xs font-bold uppercase ${className}`} style={{ color: "#7A7570" }}>
        {affinity}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
      title={affinity}
      style={{ lineHeight: 0 }}
    >
      <img
        src={data.icon}
        alt={affinity}
        width={size}
        height={size}
        style={{
          objectFit: "contain",
          filter: `drop-shadow(0 0 4px ${data.glow})`,
        }}
        loading="lazy"
      />
      {showLabel && (
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: data.color }}
        >
          {affinity}
        </span>
      )}
    </span>
  );
}

export { AFFINITY_DATA };
