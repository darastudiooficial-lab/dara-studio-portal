import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const STAGE_COLORS: Record<string, string> = {
  "Lead": "#6b7280",
  "Budget Sent": "#3b82f6",
  "Budget Approved": "#10b981",
  "Waiting Payment": "#f59e0b",
  "In Progress": "#8b5cf6",
  "Preview Sent": "#06b6d4",
  "Revision": "#f97316",
  "Final Review": "#14b8a6",
  "Completed": "#22c55e",
  "On Hold": "#9ca3af",
  "Cancelled": "#dc2626",
  "Delayed": "#ef4444",
};

let MapContainer: any, TileLayer: any, Marker: any, Popup: any, L: any;

const AdminMap = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, leaflet]) => {
      MapContainer = rl.MapContainer;
      TileLayer = rl.TileLayer;
      Marker = rl.Marker;
      Popup = rl.Popup;
      L = leaflet.default;
      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, companies(name)")
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  const createIcon = (color: string) =>
    L.divIcon({
      className: "",
      html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

  // Massachusetts center
  const maCenter: [number, number] = [42.4072, -71.3824];

  // Get unique cities
  const cities = [...new Set(projects.map(p => p.city).filter(Boolean))].sort();
  const displayedProjects = selectedCity ? projects.filter(p => p.city === selectedCity) : projects;

  if (!mapReady) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("admin.mapView")}</h1>
          <p className="text-sm text-muted-foreground">{t("admin.loadingMap")}</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("admin.mapView")}</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("admin.noProjectsWithLocation")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin.mapView")}</h1>
        <p className="text-muted-foreground">{displayedProjects.length} {t("admin.projectsWithLocation")}</p>
      </div>

      {/* City filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCity === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCity(null)}
        >
          {t("admin.allCities")} ({projects.length})
        </Button>
        {cities.map(city => {
          const count = projects.filter(p => p.city === city).length;
          return (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(city)}
            >
              {city} ({count})
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {Object.entries(STAGE_COLORS).map(([stage, color]) => (
          <div key={stage} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            {stage}
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ height: "calc(100vh - 300px)" }}>
        <MapContainer center={maCenter} zoom={9} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {displayedProjects.map((p) => (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={createIcon(STAGE_COLORS[p.stage] || "#6b7280")}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{[p.street_number, p.street_name].filter(Boolean).join(" ") || t("admin.noAddress")}</p>
                  <p className="text-xs text-muted-foreground">{p.companies?.name}</p>
                  {p.city && <p className="text-xs">{p.city}, {p.state}</p>}
                  <Badge variant="outline">{p.stage || "—"}</Badge>
                  {p.total_value > 0 && (
                    <p className="text-xs">{p.currency === "BRL" ? "R$" : "$"}{Number(p.total_value).toLocaleString()}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminMap;
