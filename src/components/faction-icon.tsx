/**
 * Faction icons for RAID: Shadow Legends factions.
 * Uses official icons from InTeleria, with SVG fallback for newer factions.
 */

// Official faction icon URLs from InTeleria
const FACTION_ICON_URLS: Record<string, string> = {
  "Banner Lords": "https://www.inteleria.com/wp-content/uploads/2019/10/bannerlords.png",
  "High Elves": "https://www.inteleria.com/wp-content/uploads/2019/10/highelves.png",
  "The Sacred Order": "https://www.inteleria.com/wp-content/uploads/2019/10/thesacredorder.png",
  "Dark Elves": "https://www.inteleria.com/wp-content/uploads/2019/10/darkelves.png",
  "Barbarians": "https://www.inteleria.com/wp-content/uploads/2019/10/barbarians.png",
  "Undead Hordes": "https://www.inteleria.com/wp-content/uploads/2019/10/undeadhordes.png",
  "Orcs": "https://www.inteleria.com/wp-content/uploads/2019/10/orcs.png",
  "Lizardmen": "https://www.inteleria.com/wp-content/uploads/2019/10/lizardmen.png",
  "Demonspawn": "https://www.inteleria.com/wp-content/uploads/2019/10/demonspawn.png",
  "Dwarves": "https://www.inteleria.com/wp-content/uploads/2019/10/dwarves.png",
  "Knight Revenant": "https://www.inteleria.com/wp-content/uploads/2019/10/knightrevenant.png",
  "Ogryn Tribes": "https://www.inteleria.com/wp-content/uploads/2019/10/ogryntribes.png",
  "Skinwalkers": "https://www.inteleria.com/wp-content/uploads/2019/10/skinwalkers.png",
  "Shadowkin": "https://www.inteleria.com/wp-content/uploads/2019/10/shadowkin.png",
  "Sylvan Watchers": "https://www.inteleria.com/wp-content/uploads/2019/10/sylvanwatchers.png",
};

interface FactionIconProps {
  faction: string;
  size?: number;
  className?: string;
}

export function FactionIcon({ faction, size = 18, className }: FactionIconProps) {
  const iconUrl = FACTION_ICON_URLS[faction];

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={faction}
        title={faction}
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain" }}
        loading="lazy"
      />
    );
  }

  // Fallback for factions without official icons (e.g. Argonites)
  return (
    <div
      className={className}
      title={faction}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid #7A7570",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        color: "#7A7570",
        fontWeight: 700,
      }}
    >
      {faction.charAt(0)}
    </div>
  );
}
