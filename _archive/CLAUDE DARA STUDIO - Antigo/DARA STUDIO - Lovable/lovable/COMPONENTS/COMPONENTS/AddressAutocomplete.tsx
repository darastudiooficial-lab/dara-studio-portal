import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin } from "lucide-react";

interface AddressResult {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    suburb?: string;
    neighbourhood?: string;
  };
  lat: string;
  lon: string;
}

interface AddressData {
  street_name: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Props {
  onSelect: (data: AddressData) => void;
  placeholder?: string;
}

const AddressAutocomplete = ({ onSelect, placeholder = "Search address..." }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length < 3) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch { setResults([]); }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (r: AddressResult) => {
    const a = r.address;
    const cityName = a.city || a.town || a.village || "";
    let country = "Other";
    if (a.country_code === "us") country = "USA";
    else if (a.country_code === "br") country = "Brazil";

    onSelect({
      street_name: a.road || "",
      street_number: a.house_number || "",
      neighborhood: a.suburb || a.neighbourhood || "",
      city: cityName,
      state: a.state || "",
      zip_code: a.postcode || "",
      country,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    });
    setQuery(r.display_name);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            className="pl-10"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {results.map((r, i) => (
                <CommandItem key={i} onSelect={() => handleSelect(r)} className="cursor-pointer">
                  <MapPin className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">{r.display_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddressAutocomplete;
