"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useFusions, FusionRequirement } from "@/lib/fusions";
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

const REQ_TYPES: FusionRequirement["type"][] = ["champion", "fragment", "event"];

export default function FusionTrackerPage() {
  const { user } = useAuth();
  const { fusions, saveFusion, deleteFusion, updateRequirement } = useFusions();

  const [showCreate, setShowCreate] = useState(false);
  const [fusionName, setFusionName] = useState("");
  const [championName, setChampionName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [requirements, setRequirements] = useState<Omit<FusionRequirement, "id">[]>([]);
  const [newReqName, setNewReqName] = useState("");
  const [newReqType, setNewReqType] = useState<FusionRequirement["type"]>("fragment");
  const [newReqTarget, setNewReqTarget] = useState(100);

  const addRequirement = () => {
    if (!newReqName.trim()) return;
    setRequirements([
      ...requirements,
      { name: newReqName.trim(), type: newReqType, targetCount: newReqTarget, currentCount: 0 },
    ]);
    setNewReqName("");
    setNewReqTarget(100);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!fusionName.trim()) return;
    saveFusion({
      name: fusionName.trim(),
      champion_name: championName.trim(),
      end_date: endDate || undefined,
      requirements: requirements.map((r) => ({ ...r, id: crypto.randomUUID() })),
      notes,
    });
    // Reset
    setFusionName("");
    setChampionName("");
    setEndDate("");
    setNotes("");
    setRequirements([]);
    setShowCreate(false);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gold">Fusion Tracker</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">Log in</Link> to track your fusion progress.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gold">Fusion Tracker</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "New Fusion"}
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Track a New Fusion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Fusion Event Name</label>
                <Input
                  placeholder="e.g. Sigmund Fragment Fusion"
                  value={fusionName}
                  onChange={(e) => setFusionName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Target Champion</label>
                <Input
                  placeholder="e.g. Sigmund the Highshield"
                  value={championName}
                  onChange={(e) => setChampionName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">End Date (optional)</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <Input
                  placeholder="Any notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="mb-2 block text-sm font-medium">Requirements</label>
              {requirements.length > 0 && (
                <ul className="mb-3 space-y-1">
                  {requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">{r.type}</span>
                      <span>{r.name}</span>
                      <span className="text-muted-foreground">0 / {r.targetCount}</span>
                      <button
                        onClick={() => removeRequirement(i)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Requirement name"
                    value={newReqName}
                    onChange={(e) => setNewReqName(e.target.value)}
                  />
                </div>
                <Select value={newReqType} onValueChange={(v) => setNewReqType(v as FusionRequirement["type"])}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REQ_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={newReqTarget}
                  onChange={(e) => setNewReqTarget(Number(e.target.value) || 1)}
                  className="w-20"
                  placeholder="Target"
                />
                <Button size="sm" variant="outline" onClick={addRequirement}>
                  Add
                </Button>
              </div>
            </div>

            <Button onClick={handleCreate} disabled={!fusionName.trim()}>
              Create Fusion Tracker
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active fusions */}
      {fusions.length === 0 && !showCreate ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No active fusions being tracked. Click &ldquo;New Fusion&rdquo; to start.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fusions.map((fusion) => {
            const totalReqs = fusion.requirements.length;
            const completedReqs = fusion.requirements.filter(
              (r) => r.currentCount >= r.targetCount
            ).length;
            const overallProgress = totalReqs > 0
              ? fusion.requirements.reduce((sum, r) => sum + r.currentCount, 0) /
                fusion.requirements.reduce((sum, r) => sum + r.targetCount, 0)
              : 0;

            return (
              <Card key={fusion.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      {fusion.name}
                      {fusion.champion_name && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          — {fusion.champion_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {fusion.end_date && (
                        <span className="text-xs text-muted-foreground">
                          Ends: {new Date(fusion.end_date).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() => deleteFusion(fusion.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Overall progress bar */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Overall: {completedReqs}/{totalReqs} requirements
                      </span>
                      <span className="font-medium text-gold">
                        {Math.round(overallProgress * 100)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gold transition-all"
                        style={{ width: `${overallProgress * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Individual requirements */}
                  {fusion.requirements.length > 0 ? (
                    <div className="space-y-2">
                      {fusion.requirements.map((req) => {
                        const progress = req.targetCount > 0
                          ? req.currentCount / req.targetCount
                          : 0;
                        const isComplete = req.currentCount >= req.targetCount;
                        return (
                          <div key={req.id} className="flex items-center gap-3">
                            <span className="rounded bg-muted px-2 py-0.5 text-[10px]">
                              {req.type}
                            </span>
                            <span className={`flex-1 text-sm ${isComplete ? "text-green-400 line-through" : ""}`}>
                              {req.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateRequirement(fusion.id, req.id, Math.max(0, req.currentCount - 1))
                                }
                                className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent"
                              >
                                -
                              </button>
                              <Input
                                type="number"
                                value={req.currentCount}
                                onChange={(e) =>
                                  updateRequirement(
                                    fusion.id,
                                    req.id,
                                    Math.max(0, Number(e.target.value) || 0)
                                  )
                                }
                                className="h-7 w-16 text-center text-xs"
                              />
                              <button
                                onClick={() =>
                                  updateRequirement(fusion.id, req.id, req.currentCount + 1)
                                }
                                className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent"
                              >
                                +
                              </button>
                              <span className="w-12 text-right text-xs text-muted-foreground">
                                / {req.targetCount}
                              </span>
                            </div>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isComplete ? "bg-green-400" : "bg-gold"
                                }`}
                                style={{ width: `${Math.min(progress * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No requirements added. Edit this fusion to add some.
                    </p>
                  )}

                  {fusion.notes && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Notes: {fusion.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
