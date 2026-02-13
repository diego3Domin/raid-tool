import { cn } from "@/lib/utils";
import { ALL_TREES, getMasteryBuild, type MasteryNode } from "@/lib/masteries";
import { MASTERY_TREE_COLORS } from "@/lib/constants";

interface MasteryTreeDiagramProps {
  masteryTree: string;
  role: string;
}

const TREE_NAMES = ["Offense", "Defense", "Support"] as const;
const TIERS = [1, 2, 3, 4, 5, 6] as const;
const TIER_NUMERALS = ["I", "II", "III", "IV", "V", "VI"] as const;

function MasteryNodeCell({
  node,
  isSelected,
  isCapstone,
  accentColor,
}: {
  node: MasteryNode;
  isSelected: boolean;
  isCapstone: boolean;
  accentColor: string;
}) {
  return (
    <div className="group/node relative">
      <div
        className={cn(
          "rounded-md border-2 text-center leading-tight font-semibold transition-all cursor-default select-none",
          isCapstone
            ? "px-3 py-2 text-[11px] font-bold min-w-[80px]"
            : "px-2 py-1.5 text-[10px] min-w-[68px]",
          isSelected
            ? "text-white"
            : "bg-[#12121A] border-[#2A2A30] text-[#3A3A40]"
        )}
        style={
          isSelected
            ? {
                backgroundColor: `${accentColor}20`,
                borderColor: accentColor,
                color: accentColor,
                boxShadow: `0 0 8px ${accentColor}40, inset 0 0 12px ${accentColor}10`,
              }
            : undefined
        }
      >
        {node.name}
      </div>
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 mb-2 w-52 rounded-md border border-[#C8963E]/30 bg-[#0A0A0F] p-2.5 text-left opacity-0 shadow-xl transition-opacity duration-150 group-hover/node:opacity-100">
        <p className="text-xs font-bold text-[#C8963E]">{node.name}</p>
        <p className="mt-1 text-[10px] leading-snug text-[#7A7570]">
          {node.description}
        </p>
      </div>
    </div>
  );
}

function TierConnector({ accentColor, hasSelected }: { accentColor: string; hasSelected: boolean }) {
  return (
    <div className="flex justify-center py-0.5">
      <div
        className="w-0.5 h-3 rounded-full"
        style={{
          backgroundColor: hasSelected ? `${accentColor}60` : "#2A2A30",
        }}
      />
    </div>
  );
}

export function MasteryTreeDiagram({ masteryTree, role }: MasteryTreeDiagramProps) {
  const build = getMasteryBuild(masteryTree, role);
  const selectedSet = new Set(build.selectedNodes);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-3 gap-3" style={{ minWidth: 640 }}>
        {TREE_NAMES.map((treeName) => {
          const isActive =
            treeName === build.primaryTree || treeName === build.secondaryTree;
          const nodes = ALL_TREES[treeName];
          const accentColor =
            MASTERY_TREE_COLORS[treeName as keyof typeof MASTERY_TREE_COLORS];

          return (
            <div
              key={treeName}
              className={cn(
                "rounded-md border bg-[#0E0E14] p-2.5 transition-opacity",
                isActive ? "border-[#2A2A30]" : "border-[#1A1A20] opacity-20"
              )}
            >
              {/* Tree header */}
              <div
                className="mb-3 rounded-sm py-1.5 text-center text-xs font-bold uppercase tracking-widest"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}10`,
                  borderBottom: `2px solid ${accentColor}40`,
                }}
              >
                {treeName}
                {treeName === build.primaryTree && (
                  <span className="ml-1.5 text-[9px] font-medium opacity-50">
                    PRIMARY
                  </span>
                )}
              </div>

              {/* Tiers: T6 (top) → T1 (bottom) */}
              {TIERS.map((tier, tierIdx) => {
                const tierNodes = nodes.filter((n) => n.tier === tier);
                const tierHasSelected = tierNodes.some((n) =>
                  selectedSet.has(n.id)
                );

                return (
                  <div key={tier}>
                    {/* Connector line between tiers */}
                    {tierIdx > 0 && (
                      <TierConnector
                        accentColor={accentColor}
                        hasSelected={tierHasSelected}
                      />
                    )}

                    {/* Tier row */}
                    <div className="flex items-center gap-1.5">
                      {/* Tier numeral */}
                      <span
                        className={cn(
                          "w-5 shrink-0 text-center text-[9px] font-bold",
                          tierHasSelected ? "text-[#5A5550]" : "text-[#2A2A30]"
                        )}
                      >
                        {TIER_NUMERALS[tierIdx]}
                      </span>

                      {/* Nodes */}
                      <div className="flex flex-1 flex-wrap justify-center gap-1.5">
                        {tierNodes.map((node) => (
                          <MasteryNodeCell
                            key={node.id}
                            node={node}
                            isSelected={selectedSet.has(node.id)}
                            isCapstone={tier === 6}
                            accentColor={accentColor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
