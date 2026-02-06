"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import {
  useTierLists,
  CONTENT_AREAS,
  TIERS,
  TIER_COLORS,
  Tier,
  TierPlacement,
} from "@/lib/tier-lists";
import { getAllChampions } from "@/lib/champions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allChampions = getAllChampions();
const championById = new Map(allChampions.map((c) => [c.id, c]));

export default function TierListsPage() {
  const { user } = useAuth();
  const {
    tierLists,
    saveTierList,
    updateTierList,
    deleteTierList,
    communityVotes,
    castVote,
    getUserVote,
    getAggregatedVotes,
  } = useTierLists();

  const isAdmin = user?.admin_role === true;

  const [selectedArea, setSelectedArea] = useState(CONTENT_AREAS[0]);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");

  // Admin: tier list for the selected content area
  const curatedList = useMemo(
    () => tierLists.find((t) => t.content_area === selectedArea),
    [tierLists, selectedArea]
  );

  // Community aggregated votes for the selected area
  const communityTiers = useMemo(
    () => getAggregatedVotes(selectedArea),
    [getAggregatedVotes, selectedArea]
  );

  const handleCreateList = () => {
    const name = newListName || `${selectedArea} Tier List`;
    saveTierList({
      name,
      content_area: selectedArea,
      placements: [],
    });
    setNewListName("");
  };

  const handleSetTier = (listId: string, championId: string, tier: Tier) => {
    const list = tierLists.find((t) => t.id === listId);
    if (!list) return;
    const filtered = list.placements.filter((p) => p.champion_id !== championId);
    updateTierList(listId, {
      placements: [...filtered, { champion_id: championId, tier }],
    });
  };

  const handleRemoveFromTier = (listId: string, championId: string) => {
    const list = tierLists.find((t) => t.id === listId);
    if (!list) return;
    updateTierList(listId, {
      placements: list.placements.filter((p) => p.champion_id !== championId),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#D4A43C]">Tier Lists</h1>

      {/* Content area selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">Content Area:</label>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="curated">
        <TabsList>
          <TabsTrigger value="curated">Curated</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Curated Tier List Tab */}
        <TabsContent value="curated" className="mt-4">
          {curatedList ? (
            <TierDisplay
              placements={curatedList.placements}
              listId={curatedList.id}
              isAdmin={isAdmin}
              editing={editingListId === curatedList.id}
              onToggleEdit={() =>
                setEditingListId(
                  editingListId === curatedList.id ? null : curatedList.id
                )
              }
              onSetTier={handleSetTier}
              onRemove={handleRemoveFromTier}
              onDelete={() => deleteTierList(curatedList.id)}
              title={curatedList.name}
            />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No curated tier list for {selectedArea} yet.
                </p>
                {isAdmin && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Input
                      placeholder="Tier list name (optional)"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleCreateList}>Create Tier List</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Community Voted Tab */}
        <TabsContent value="community" className="mt-4">
          <CommunityTierView
            contentArea={selectedArea}
            communityTiers={communityTiers}
            user={user}
            castVote={castVote}
            getUserVote={getUserVote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Tier Display Component ─── */

function TierDisplay({
  placements,
  listId,
  isAdmin,
  editing,
  onToggleEdit,
  onSetTier,
  onRemove,
  onDelete,
  title,
}: {
  placements: TierPlacement[];
  listId: string;
  isAdmin: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  onSetTier: (listId: string, championId: string, tier: Tier) => void;
  onRemove: (listId: string, championId: string) => void;
  onDelete: () => void;
  title: string;
}) {
  const [search, setSearch] = useState("");

  const placedIds = new Set(placements.map((p) => p.champion_id));

  const searchResults = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase();
    return allChampions
      .filter((c) => c.name.toLowerCase().includes(query) && !placedIds.has(c.id))
      .slice(0, 8);
  }, [search, placedIds]);

  const grouped = useMemo(() => {
    const map = new Map<Tier, TierPlacement[]>();
    for (const tier of TIERS) map.set(tier, []);
    for (const p of placements) {
      map.get(p.tier)?.push(p);
    }
    return map;
  }, [placements]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {isAdmin && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onToggleEdit}>
                {editing ? "Done" : "Edit"}
              </Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {TIERS.map((tier) => {
          const champs = grouped.get(tier) ?? [];
          return (
            <div key={tier} className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-lg font-bold ${TIER_COLORS[tier]}`}
              >
                {tier}
              </div>
              <div className="flex min-h-[40px] flex-1 flex-wrap items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5">
                {champs.length === 0 && (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                {champs.map((p) => {
                  const c = championById.get(p.champion_id);
                  if (!c) return null;
                  return (
                    <div
                      key={p.champion_id}
                      className="group relative flex items-center gap-1.5 rounded bg-muted px-2 py-1"
                    >
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-medium">{c.name}</span>
                      {editing && (
                        <button
                          onClick={() => onRemove(listId, p.champion_id)}
                          className="ml-1 text-xs text-destructive hover:text-destructive/80"
                        >
                          x
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Admin: add champions */}
        {editing && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-2 text-sm font-medium">Add Champion to Tier</p>
            <Input
              placeholder="Search champions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="mt-1 rounded-md border border-border">
                {searchResults.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px]">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm">{c.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {TIERS.map((tier) => (
                        <button
                          key={tier}
                          onClick={() => {
                            onSetTier(listId, c.id, tier);
                            setSearch("");
                          }}
                          className={`rounded border px-1.5 py-0.5 text-xs font-bold ${TIER_COLORS[tier]}`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Community Tier View ─── */

function CommunityTierView({
  contentArea,
  communityTiers,
  user,
  castVote,
  getUserVote,
}: {
  contentArea: string;
  communityTiers: Map<string, Tier>;
  user: { id: string } | null;
  castVote: (userId: string, championId: string, contentArea: string, tier: Tier) => void;
  getUserVote: (userId: string, championId: string, contentArea: string) => { tier: Tier } | undefined;
}) {
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    if (!search) return [];
    const query = search.toLowerCase();
    return allChampions
      .filter((c) => c.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [search]);

  // Group community tiers for display
  const grouped = useMemo(() => {
    const map = new Map<Tier, string[]>();
    for (const tier of TIERS) map.set(tier, []);
    for (const [champId, tier] of communityTiers) {
      map.get(tier)?.push(champId);
    }
    return map;
  }, [communityTiers]);

  const hasVotes = communityTiers.size > 0;

  return (
    <div className="space-y-4">
      {/* Aggregated community tier display */}
      {hasVotes ? (
        <Card>
          <CardHeader>
            <CardTitle>Community Tier List — {contentArea}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TIERS.map((tier) => {
              const champIds = grouped.get(tier) ?? [];
              return (
                <div key={tier} className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-lg font-bold ${TIER_COLORS[tier]}`}
                  >
                    {tier}
                  </div>
                  <div className="flex min-h-[40px] flex-1 flex-wrap items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5">
                    {champIds.length === 0 && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                    {champIds.map((id) => {
                      const c = championById.get(id);
                      if (!c) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-1.5 rounded bg-muted px-2 py-1"
                        >
                          {c.avatar_url ? (
                            <img
                              src={c.avatar_url}
                              alt={c.name}
                              className="h-6 w-6 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold">
                              {c.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs font-medium">{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No community votes for {contentArea} yet. Be the first to vote!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Vote on champions */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search a champion to vote on..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="mt-2 space-y-1">
                {searchResults.map((c) => {
                  const existing = getUserVote(user.id, c.id, contentArea);
                  return (
                    <li
                      key={c.id}
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[10px]">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm">{c.name}</span>
                        {existing && (
                          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${TIER_COLORS[existing.tier]}`}>
                            Your vote: {existing.tier}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {TIERS.map((tier) => (
                          <button
                            key={tier}
                            onClick={() => castVote(user.id, c.id, contentArea, tier)}
                            className={`rounded border px-1.5 py-0.5 text-xs font-bold transition-opacity ${TIER_COLORS[tier]} ${
                              existing?.tier === tier ? "ring-2 ring-white/50" : ""
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {!search && (
              <p className="mt-2 text-xs text-muted-foreground">
                Search for a champion to vote on their tier for {contentArea}.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">Log in</a> to vote on champion tiers.
        </p>
      )}
    </div>
  );
}
