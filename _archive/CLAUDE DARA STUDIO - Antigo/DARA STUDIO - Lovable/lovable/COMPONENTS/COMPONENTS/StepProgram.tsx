import { ROOM_TYPES } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LayoutGrid } from "lucide-react";

interface Props {
  rooms: Record<string, number>;
  specialRequirements: string;
  onFieldChange: (field: string, value: any) => void;
}

const StepProgram = ({ rooms, specialRequirements, onFieldChange }: Props) => {
  const setRoom = (id: string, count: number) => {
    onFieldChange("rooms", { ...rooms, [id]: Math.max(0, count) });
  };

  const categories = [...new Set(ROOM_TYPES.map(r => r.category))];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <LayoutGrid className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">Program Requirements</h2>
        <p className="text-muted-foreground mt-1">What spaces does your project need?</p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {ROOM_TYPES.filter(r => r.category === cat).map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium">{room.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRoom(room.id, (rooms[room.id] || 0) - 1)}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm hover:bg-muted transition-colors"
                    >
                      −
                    </button>
                    <Input
                      type="number"
                      value={rooms[room.id] || 0}
                      onChange={(e) => setRoom(room.id, Number(e.target.value))}
                      className="w-16 text-center"
                      min={0}
                    />
                    <button
                      type="button"
                      onClick={() => setRoom(room.id, (rooms[room.id] || 0) + 1)}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <Label>Special Requirements (optional)</Label>
          <Textarea
            value={specialRequirements}
            onChange={(e) => onFieldChange("specialRequirements", e.target.value)}
            rows={3}
            placeholder="e.g. ADA accessibility, home theater, specific materials..."
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default StepProgram;
