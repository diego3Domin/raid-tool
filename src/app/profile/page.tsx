"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, updateProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setDisplayName(user.display_name);
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ display_name: displayName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This will log you out and clear all local data.")) {
      localStorage.clear();
      logout();
      router.push("/");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gold">Profile</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <Input value={user.email} disabled />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save Changes</Button>
                {saved && (
                  <span className="text-sm text-green-400">Saved!</span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Delete your account and clear all local data. This cannot be
              undone.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
