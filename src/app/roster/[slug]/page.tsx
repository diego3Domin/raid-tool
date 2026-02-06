"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRoster, RosterEntry } from "@/lib/roster";
import { getChampionBySlug } from "@/lib/champions";
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
import { Badge } from "@/components/ui/badge";

const GEAR_SETS = [
  "Life", "Offense", "Defense", "Speed", "Critical Rate", "Critical Damage",
  "Accuracy", "Resistance", "Lifesteal", "Destroy", "Retaliation",
  "Fury", "Curing", "Reflex", "Stalwart", "Relentless", "Savage",
  "Immortal", "Divine Offense", "Divine Critical Rate", "Divine Life",
  "Divine Speed", "Swift Parry", "Deflection", "Resilience",
  "Perception", "Cruel", "Immunity", "Stun", "Toxic", "Frost",
  "Daze", "Cursed", "Regeneration", "Guardian", "Untouchable",
  "Avenging", "Bolster", "Bloodthirst", "Lethal", "Stone Skin",
];

export default function RosterDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { roster, updateEntry, isInRoster } = useRoster();

  const champion = getChampionBySlug(params.slug);
  const entry = roster.find((r) => r.champion_id === champion?.id);

  const [stars, setStars] = useState(6);
  const [level, setLevel] = useState(60);
  const [ascension, setAscension] = useState(6);
  const [gearSets, setGearSets] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (entry) {
      setStars(entry.stars);
      setLevel(entry.level);
      setAscension(entry.ascension);
      setGearSets(entry.gear_sets);
    }
  }, [entry]);

  if (authLoading || !user || !champion) return null;

  if (!isInRoster(champion.id)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-muted-foreground">
          {champion.name} is not in your roster.
        </p>
        <Button asChild className="mt-4">
          <Link href="/roster">Back to Roster</Link>
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    updateEntry(champion.id, {
      stars,
      level,
      ascension,
      gear_sets: gearSets,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleGearSet = (set: string) => {
    setGearSets((prev) =>
      prev.includes(set) ? prev.filter((s) => s !== set) : [...prev, set]
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/roster"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Roster
      </Link>

      {/* Hero */}
      <div className="mb-8 flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {champion.avatar_url ? (
            <img
              src={champion.avatar_url}
              alt={champion.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
              {champion.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{champion.name}</h1>
          <p className="text-sm text-muted-foreground">
            {champion.rarity} • {champion.affinity} • {champion.role} •{" "}
            {champion.faction}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stars, Level, Ascension */}
        <Card>
          <CardHeader>
            <CardTitle>Champion Build</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Stars</label>
                <Select
                  value={String(stars)}
                  onValueChange={(v) => setStars(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        {"★".repeat(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Level</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Ascension
                </label>
                <Select
                  value={String(ascension)}
                  onValueChange={(v) => setAscension(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((a) => (
                      <SelectItem key={a} value={String(a)}>
                        {a === 0 ? "None" : `${a}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gear Sets */}
        <Card>
          <CardHeader>
            <CardTitle>Gear Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {GEAR_SETS.map((set) => (
                <button
                  key={set}
                  onClick={() => toggleGearSet(set)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    gearSets.includes(set)
                      ? "border-gold bg-gold/20 text-gold"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {set}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Masteries placeholder */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Masteries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon — mastery tree selection.
            </p>
          </CardContent>
        </Card>

        {/* Skill Books placeholder */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Skill Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Coming soon — track books used per skill.
            </p>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>Save Build</Button>
          {saved && <span className="text-sm text-green-400">Saved!</span>}
        </div>
      </div>
    </div>
  );
}
