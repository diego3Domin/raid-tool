"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useTeams, CONTENT_TYPES, TeamSlot } from "@/lib/teams";
import { getAllChampions } from "@/lib/champions";
import { Champion } from "@/types/champion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const allChampions = getAllChampions();
const championById = new Map(allChampions.map((c) => [c.id, c]));

export default function TeamBuilderPage() {
  const { user } = useAuth();
  const { teams, saveTeam, deleteTeam } = useTeams();

  const [category, setCategory] = useState("Clan Boss");
  const [detail, setDetail] = useState("");
  const [stage, setStage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [slots, setSlots] = useState<TeamSlot[]>([]);
  const [search, setSearch] = useState("");
  const [rosterOnly, setRosterOnly] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const contentType = CONTENT_TYPES[category];
  const teamSize = contentType?.defaultSize ?? 5;

  const searchResults = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase();
    const slotIds = new Set(slots.map((s) => s.champion_id));
    return allChampions
      .filter((c) => c.name.toLowerCase().includes(query) && !slotIds.has(c.id))
      .slice(0, 8);
  }, [search, slots]);

  const addSlot = (championId: string) => {
    if (slots.length >= teamSize) return;
    setSlots([...slots, { champion_id: championId }]);
    setSearch("");
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlotSpeed = (index: number, raw: string) => {
    const speed = raw === "" ? undefined : Number(raw);
    if (speed !== undefined && isNaN(speed)) return;
    setSlots(slots.map((s, i) => (i === index ? { ...s, speed } : s)));
  };

  const handleSave = () => {
    if (!user) return;
    saveTeam({
      name: teamName || `${category} ${detail} Team`,
      content_category: category,
      content_detail: detail,
      content_stage: stage || undefined,
      slots,
      ai_explanation: aiExplanation || undefined,
    });
    // Reset form
    setSlots([]);
    setTeamName("");
    setSearch("");
    setAiExplanation("");
  };

  const generateAiExplanation = async () => {
    if (slots.length < 2) return;
    setAiLoading(true);
    // Mock AI response — will be replaced with Claude API call later
    await new Promise((r) => setTimeout(r, 1500));
    const champNames = slots
      .map((s) => championById.get(s.champion_id)?.name ?? "Unknown")
      .join(", ");
    setAiExplanation(
      `Team Synergy Analysis for ${category}${detail ? ` — ${detail}` : ""}:\n\n` +
      `Champions: ${champNames}\n\n` +
      `This is a placeholder analysis. When the Claude API is connected, this will provide:\n` +
      `• Detailed synergy breakdown between champions\n` +
      `• Skill rotation recommendations\n` +
      `• Speed tune suggestions for optimal turn order\n` +
      `• Gear set recommendations per champion\n` +
      `• Potential weaknesses and counters to watch for`
    );
    setAiLoading(false);
  };

  // Sort slots by speed for turn order display
  const turnOrder = [...slots]
    .map((s, i) => ({ ...s, originalIndex: i }))
    .filter((s) => s.speed)
    .sort((a, b) => (b.speed ?? 0) - (a.speed ?? 0));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* War table header */}
      <div className="mb-10 relative">
        <h1 className="mb-2 bg-gradient-to-r from-[#E8C460] via-[#D4A43C] to-[#A67C1E] bg-clip-text text-5xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(212,164,60,0.4)]">
          Team Builder
        </h1>
        <p className="text-slate-400 font-medium">Forge your battle formation</p>
        <div className="h-[2px] w-32 bg-gradient-to-r from-[#D4A43C] to-transparent mt-2"></div>
        <div className="h-[1px] w-32 bg-gradient-to-r from-[#E8C460] to-transparent -mt-[1px]"></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Builder */}
        <div className="space-y-4 lg:col-span-2">
          {/* Content selector */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Select value={category} onValueChange={(v) => { setCategory(v); setDetail(""); setStage(""); }}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CONTENT_TYPES).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {contentType?.details.length > 0 && (
                  <Select value={detail} onValueChange={setDetail}>
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Select detail" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentType.details.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {contentType?.hasStages && (
                  <Input
                    placeholder="Stage (e.g. 25)"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-32"
                  />
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Team size: {teamSize} champions
              </p>
            </CardContent>
          </Card>

          {/* Team slots */}
          <Card>
            <CardHeader>
              <CardTitle>
                Team Slots ({slots.length}/{teamSize})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {slots.map((slot, i) => {
                const champ = championById.get(slot.champion_id);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-border p-2"
                  >
                    {champ?.avatar_url ? (
                      <img src={champ.avatar_url} alt={champ.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-sm font-bold text-muted-foreground">
                        {champ?.name.charAt(0) ?? "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{champ?.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {champ?.rarity} • {champ?.role}
                      </p>
                    </div>
                    <Input
                      type="number"
                      placeholder="SPD"
                      value={slot.speed ?? ""}
                      onChange={(e) => updateSlotSpeed(i, e.target.value)}
                      className="w-20"
                    />
                    <button
                      onClick={() => removeSlot(i)}
                      className="rounded px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {slots.length < teamSize && (
                <div>
                  <Input
                    placeholder="Search champions to add..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <ul className="mt-1 rounded-md border border-border">
                      {searchResults.map((c) => (
                        <li key={c.id}>
                          <button
                            onClick={() => addSlot(c.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          >
                            {c.avatar_url ? (
                              <img src={c.avatar_url} alt={c.name} className="h-6 w-6 rounded object-cover" />
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs">{c.name.charAt(0)}</div>
                            )}
                            <span>{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.rarity} • {c.role}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Speed tune turn order */}
          {turnOrder.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Turn Order (Speed Tune)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {turnOrder.map((s, i) => {
                    const champ = championById.get(s.champion_id);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-[#D4A43C]">{i + 1}</span>
                        <div className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted">
                          {champ?.avatar_url ? (
                            <img src={champ.avatar_url} alt={champ.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                              {champ?.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{s.speed}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Synergy Explanation */}
          {slots.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  AI Synergy Breakdown
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateAiExplanation}
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Analyzing..." : "Generate Analysis"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiExplanation ? (
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {aiExplanation}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click &ldquo;Generate Analysis&rdquo; to get an AI-powered synergy breakdown for your team.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Save */}
          {user && slots.length > 0 && (
            <div className="flex items-center gap-3">
              <Input
                placeholder="Team name (optional)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-64"
              />
              <Button onClick={handleSave}>Save Team</Button>
            </div>
          )}
          {!user && slots.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">Log in</Link> to save teams.
            </p>
          )}
        </div>

        {/* Right: Saved teams */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Saved Teams</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="text-primary hover:underline">Log in</Link> to see saved teams.
                </p>
              ) : teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved teams yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {teams.map((team) => (
                    <li
                      key={team.id}
                      className="flex items-center justify-between rounded-md border border-border p-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {team.content_category}
                          {team.content_detail ? ` — ${team.content_detail}` : ""}
                          {team.content_stage ? ` (${team.content_stage})` : ""}
                        </p>
                        <div className="mt-1 flex gap-1">
                          {team.slots.map((s, i) => {
                            const c = championById.get(s.champion_id);
                            return c?.avatar_url ? (
                              <img key={i} src={c.avatar_url} alt={c.name} className="h-6 w-6 rounded object-cover" />
                            ) : (
                              <div key={i} className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px]">
                                {c?.name.charAt(0) ?? "?"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
