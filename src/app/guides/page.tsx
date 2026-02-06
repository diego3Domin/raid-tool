"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useGuides } from "@/lib/guides";
import { getAllChampions } from "@/lib/champions";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const allChampions = getAllChampions();

const GUIDE_TAGS = [
  "Beginner",
  "Advanced",
  "Speed Tune",
  "Clan Boss",
  "Arena",
  "Dungeons",
  "Hydra",
  "Doom Tower",
  "Build Guide",
  "Gear Guide",
  "Tier List",
];

export default function GuidesPage() {
  const { user } = useAuth();
  const { guides, saveGuide } = useGuides();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [championSearch, setChampionSearch] = useState("");
  const [selectedChampionId, setSelectedChampionId] = useState<string | undefined>();
  const [filterTag, setFilterTag] = useState("");

  const championResults = useMemo(() => {
    if (!championSearch) return [];
    const q = championSearch.toLowerCase();
    return allChampions.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5);
  }, [championSearch]);

  const selectedChampion = selectedChampionId
    ? allChampions.find((c) => c.id === selectedChampionId)
    : undefined;

  const filteredGuides = useMemo(() => {
    if (!filterTag) return guides;
    return guides.filter((g) => g.tags.includes(filterTag));
  }, [guides, filterTag]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = () => {
    if (!user || !title.trim()) return;
    saveGuide({
      author_id: user.id,
      author_name: user.display_name,
      title: title.trim(),
      champion_id: selectedChampionId,
      tags: selectedTags,
      body,
    });
    // Reset
    setTitle("");
    setBody("");
    setSelectedTags([]);
    setSelectedChampionId(undefined);
    setChampionSearch("");
    setShowCreate(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Page header */}
      <div className="mb-10 relative">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-[#E8C460] via-[#D4A43C] to-[#A67C1E] bg-clip-text text-5xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(212,164,60,0.4)]">
              Guides
            </h1>
            <p className="text-slate-400 font-medium">Community wisdom and strategies</p>
            <div className="h-[2px] w-32 bg-gradient-to-r from-[#D4A43C] to-transparent mt-2"></div>
            <div className="h-[1px] w-32 bg-gradient-to-r from-[#E8C460] to-transparent -mt-[1px]"></div>
          </div>
          {user && (
            <Button onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? "Cancel" : "Write a Guide"}
            </Button>
          )}
        </div>
      </div>

      {/* Create guide form */}
      {showCreate && user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Guide title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Champion selector */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Champion (optional)
              </label>
              {selectedChampion ? (
                <div className="flex items-center gap-2">
                  {selectedChampion.avatar_url && (
                    <img
                      src={selectedChampion.avatar_url}
                      alt={selectedChampion.name}
                      className="h-6 w-6 rounded object-cover"
                    />
                  )}
                  <span className="text-sm">{selectedChampion.name}</span>
                  <button
                    onClick={() => {
                      setSelectedChampionId(undefined);
                      setChampionSearch("");
                    }}
                    className="text-xs text-destructive"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    placeholder="Search champion..."
                    value={championSearch}
                    onChange={(e) => setChampionSearch(e.target.value)}
                  />
                  {championResults.length > 0 && (
                    <ul className="mt-1 rounded-md border border-border">
                      {championResults.map((c) => (
                        <li key={c.id}>
                          <button
                            onClick={() => {
                              setSelectedChampionId(c.id);
                              setChampionSearch("");
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                          >
                            {c.avatar_url && (
                              <img
                                src={c.avatar_url}
                                alt={c.name}
                                className="h-5 w-5 rounded object-cover"
                              />
                            )}
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {GUIDE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? "border-[#D4A43C] bg-[#D4A43C]/20 text-[#D4A43C]"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div>
              <label className="mb-1 block text-sm font-medium">Content</label>
              <TiptapEditor content={body} onChange={setBody} />
            </div>

            <Button onClick={handlePublish} disabled={!title.trim()}>
              Publish Guide
            </Button>
          </CardContent>
        </Card>
      )}

      {!user && (
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>{" "}
          to write guides.
        </p>
      )}

      {/* Filter tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterTag("")}
          className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
            !filterTag
              ? "border-[#D4A43C] bg-[#D4A43C]/20 text-[#D4A43C]"
              : "border-border text-muted-foreground hover:border-muted-foreground"
          }`}
        >
          All
        </button>
        {GUIDE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? "" : tag)}
            className={`rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${
              filterTag === tag
                ? "border-[#D4A43C] bg-[#D4A43C]/20 text-[#D4A43C]"
                : "border-border text-muted-foreground hover:border-muted-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Guides list */}
      {filteredGuides.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No guides yet. Be the first to write one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredGuides.map((guide) => {
            const champ = guide.champion_id
              ? allChampions.find((c) => c.id === guide.champion_id)
              : undefined;
            const score = guide.upvotes.length - guide.downvotes.length;
            return (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <Card className="transition-colors hover:border-[#D4A43C]/50">
                  <CardContent className="flex items-center gap-4 py-4">
                    {/* Vote score */}
                    <div className="flex flex-col items-center text-sm">
                      <span
                        className={
                          score > 0
                            ? "font-bold text-green-400"
                            : score < 0
                            ? "font-bold text-red-400"
                            : "text-muted-foreground"
                        }
                      >
                        {score > 0 ? `+${score}` : score}
                      </span>
                      <span className="text-[10px] text-muted-foreground">votes</span>
                    </div>

                    {/* Champion avatar */}
                    {champ?.avatar_url && (
                      <img
                        src={champ.avatar_url}
                        alt={champ.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {guide.author_name} &middot;{" "}
                        {new Date(guide.created_at).toLocaleDateString()} &middot;{" "}
                        {guide.comments.length} comment
                        {guide.comments.length !== 1 ? "s" : ""}
                      </p>
                      {guide.tags.length > 0 && (
                        <div className="mt-1 flex gap-1">
                          {guide.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
