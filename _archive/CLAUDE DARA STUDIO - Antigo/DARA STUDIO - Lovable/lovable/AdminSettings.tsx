import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Settings, Palette, Globe, Bell, Shield, Save, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("studio_settings").select("*").limit(1).single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("studio_settings").update({
      studio_name: settings.studio_name,
      tagline: settings.tagline,
      logo_url: settings.logo_url,
      primary_color: settings.primary_color,
      accent_color: settings.accent_color,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      custom_domain: settings.custom_domain,
    }).eq("id", settings.id);
    if (error) toast.error("Failed to save settings");
    else toast.success("Settings saved successfully");
    setSaving(false);
  };

  if (loading) return <div className="p-6 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration and white-label branding</p>
      </div>

      {/* Branding / White Label */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">White Label Branding</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Studio Name</Label>
              <Input value={settings?.studio_name || ""} onChange={e => setSettings((s: any) => ({ ...s, studio_name: e.target.value }))} />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input value={settings?.tagline || ""} onChange={e => setSettings((s: any) => ({ ...s, tagline: e.target.value }))} placeholder="e.g. Drafting & 3D Support" />
            </div>
          </div>
          <div>
            <Label>Logo URL</Label>
            <Input value={settings?.logo_url || ""} onChange={e => setSettings((s: any) => ({ ...s, logo_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={settings?.primary_color || "#b8860b"} onChange={e => setSettings((s: any) => ({ ...s, primary_color: e.target.value }))} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={settings?.primary_color || ""} onChange={e => setSettings((s: any) => ({ ...s, primary_color: e.target.value }))} className="flex-1" />
              </div>
            </div>
            <div>
              <Label>Accent Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={settings?.accent_color || "#f5a623"} onChange={e => setSettings((s: any) => ({ ...s, accent_color: e.target.value }))} className="w-12 h-10 p-1 cursor-pointer" />
                <Input value={settings?.accent_color || ""} onChange={e => setSettings((s: any) => ({ ...s, accent_color: e.target.value }))} className="flex-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Contact Email</Label><Input value={settings?.contact_email || ""} onChange={e => setSettings((s: any) => ({ ...s, contact_email: e.target.value }))} /></div>
          <div><Label>Contact Phone</Label><Input value={settings?.contact_phone || ""} onChange={e => setSettings((s: any) => ({ ...s, contact_phone: e.target.value }))} placeholder="(000) 000-0000" /></div>
        </CardContent>
      </Card>

      {/* Domain */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Custom Domain</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div><Label>Domain</Label><Input value={settings?.custom_domain || ""} onChange={e => setSettings((s: any) => ({ ...s, custom_domain: e.target.value }))} placeholder="portal.yourstudio.com" /></div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Notifications</CardTitle></div>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Email notification settings will be available here.</p></CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Security</CardTitle></div>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Authentication and access control settings.</p></CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Settings</>}
      </Button>
    </div>
  );
};

export default AdminSettings;
