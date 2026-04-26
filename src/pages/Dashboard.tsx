import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Profile {
  full_name: string | null;
  email: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, email, created_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data as Profile | null);
        setLoading(false);
      });
  }, [user]);

  return (
    <>
      <SEOHead title="Dashboard | Agentic Scrape" description="Your Agentic Scrape dashboard." />
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 pb-24">
          <div className="mb-12">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>
            <p className="mt-3 text-muted-foreground">
              Manage your scraping workflows and review recent activity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Account</CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <p><span className="text-muted-foreground">Name:</span> {profile?.full_name || "—"}</p>
                    <p><span className="text-muted-foreground">Email:</span> {profile?.email || user?.email}</p>
                    <p><span className="text-muted-foreground">Joined:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Try a scrape</CardTitle>
                <CardDescription>Run live extraction agents</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/case-studies">
                  <Button variant="secondary" className="w-full">Open Case Studies</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Session</CardTitle>
                <CardDescription>Manage your sign-in</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={signOut}>
                  Sign out
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;