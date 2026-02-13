import { cn } from "@/lib/utils";
import { ALL_TREES, getMasteryBuild, type MasteryNode } from "@/lib/masteries";
import { MASTERY_TREE_COLORS } from "@/lib/constants";

interface MasteryTreeDiagramProps {
  masteryTree: string;
  role: string;
}

const TREE_NAMES = ["Offense", "Defense", "Support"] as const;
const TIERS = [6, 5, 4, 3, 2, 1] as const;

function MasteryNodeCell({
  node,
  isSelected,
  isCapstone,
}: {
  node: MasteryNode;
  isSelected: boolean;
  isCapstone: boolean;
}) {
  return (
    <div className="group/node relative">
      <div
        className={cn(
          "rounded-sm border px-1.5 py-1 text-center leading-tight font-medium transition-all cursor-default select-none",
          isCapstone ? "py-1.5 text-[9px] font-bold min-w-[56px]" : "text-[8px] min-w-[48px]",
          isSelected
            ? "bg-[#C8963E]/15 border-[#C8963E] text-[#C8963E]"
            : "bg-[#1A1A20] border-[#2A2A30] text-[#3A3630]"
        )}
        style={
          isSelected
            ? { boxShadow: "0 0 6px rgba(200, 150, 62, 0.3)" }
            : undefined
        }
      >
        {node.name}
      </div>
      {/* CSS-only tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 mb-1.5 w-48 rounded border border-[#C8963E]/30 bg-[#0A0A0F] p-2 text-left opacity-0 shadow-lg transition-opacity duration-150 group-hover/node:opacity-100">
        <p className="text-[10px] font-bold text-[#C8963E]">{node.name}</p>
        <p className="mt-0.5 text-[9px] leading-snug text-[#7A7570]">
          {node.description}
        </p>
      </div>
    </div>
  );
}

export function MasteryTreeDiagram({ masteryTree, role }: MasteryTreeDiagramProps) {
  const build = getMasteryBuild(masteryTree, role);
  const selectedSet = new Set(build.selectedNodes);

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-3 gap-2" style={{ minWidth: 480 }}>
        {TREE_NAMES.map((treeName) => {
          const isActive =
            treeName === build.primaryTree || treeName === build.secondaryTree;
          const nodes = ALL_TREES[treeName];
          const accentColor =
            MASTERY_TREE_COLORS[treeName as keyof typeof MASTERY_TREE_COLORS];

          return (
            <div
              key={treeName}
              className={cn("space-y-1", !isActive && "opacity-20")}
            >
              {/* Tree header */}
              <div
                className="text-center text-[10px] font-bold uppercase tracking-wider pb-0.5"
                style={{ color: accentColor }}
              >
                {treeName}
                {treeName === build.primaryTree && (
                  <span className="ml-1 text-[8px] opacity-60">PRIMARY</span>
                )}
              </div>

              {/* Tiers: T6 (top) → T1 (bottom) */}
              {TIERS.map((tier) => {
                const tierNodes = nodes.filter((n) => n.tier === tier);
                return (
                  <div
                    key={tier}
                    className="flex flex-wrap justify-center gap-1"
                  >
                    {tierNodes.map((node) => (
                      <MasteryNodeCell
                        key={node.id}
                        node={node}
                        isSelected={selectedSet.has(node.id)}
                        isCapstone={tier === 6}
                      />
                    ))}
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
