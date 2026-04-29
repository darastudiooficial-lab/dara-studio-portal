export const STEPS = [
  "Location", "About You", "Project", "Scope", "Services",
  "Program", "Files", "Rush", "Review"
];

export const ROLES = [
  { id: "homeowner",  label: "Homeowner",       icon: "🏠" },
  { id: "builder",    label: "Builder",          icon: "🔨" },
  { id: "architect",  label: "Architect",        icon: "📐" },
  { id: "developer",  label: "Developer",        icon: "🏗️" },
  { id: "investor",   label: "Investor",         icon: "💼" },
  { id: "agent",      label: "Real Estate Agent",icon: "🤝" },
];

export const STATUSES = [
  { id: "vacant",      label: "Vacant Lot",          icon: "🌿" },
  { id: "construction",label: "Under Construction",   icon: "🔧" },
  { id: "occupied",    label: "Occupied",             icon: "🏡" },
];

export const ROOM_GROUPS = [
  {
    label: "Core Rooms",
    items: [
      { id: "bedrooms",     label: "Bedrooms"    },
      { id: "bathrooms",    label: "Bathrooms"   },
      { id: "halfBaths",    label: "Half Baths"  },
      { id: "livingRooms",  label: "Living Rooms"},
      { id: "familyRoom",   label: "Family Room" },
      { id: "diningRoom",   label: "Dining Room" },
    ],
  },
  {
    label: "Kitchen & Utility",
    items: [
      { id: "kitchen",      label: "Kitchen"         },
      { id: "pantry",       label: "Pantry"          },
      { id: "closet",       label: "Walk-in Closet"  },
      { id: "laundry",      label: "Laundry"         },
      { id: "garageBays",   label: "Garage Bays"     },
    ],
  },
  {
    label: "Outdoor & Special",
    items: [
      { id: "deck",         label: "Covered Deck"    },
      { id: "porch",        label: "Screened Porch"  },
      { id: "office",       label: "Home Office"     },
      { id: "gym",          label: "Gym"             },
      { id: "fireplace",    label: "Fireplace"       },
      { id: "wineCellar",   label: "Wine Cellar"     },
      { id: "elevator",     label: "Elevator"        },
    ],
  },
];

export const ROOM_DEFAULTS = {
  bedrooms: 3, bathrooms: 2, halfBaths: 0, livingRooms: 1,
  familyRoom: 0, diningRoom: 1, kitchen: 1, pantry: 0,
  closet: 1, laundry: 1, garageBays: 1, deck: 0, porch: 0,
  office: 0, gym: 0, fireplace: 0, wineCellar: 0, elevator: 0,
};

export const SCOPE_TYPES = [
  { id: "newConstruction", label: "New Construction",    icon: "🏗️", desc: "Full set of drawings for a new build" },
  { id: "remodel",         label: "Remodel / Renovation",icon: "🔨", desc: "Alterations to an existing structure" },
  { id: "addition",        label: "Addition / Extension", icon: "📐", desc: "Adding square footage to existing home" },
  { id: "adu",             label: "ADU / Guest House",    icon: "🏠", desc: "Accessory dwelling unit or detached suite" },
  { id: "asBuilt",         label: "As-Built Drawings",    icon: "📋", desc: "Documenting an existing structure" },
  { id: "landscape",       label: "Landscape Design",     icon: "🌿", desc: "Outdoor spaces, hardscape & planting" },
];

export const SERVICES = [
  { id: "floorPlan",     label: "Floor Plans",           icon: "📐", desc: "2D layout of all levels",                included: true  },
  { id: "elevations",    label: "Elevations",            icon: "🏛️", desc: "All 4 exterior views",                   included: true  },
  { id: "sections",      label: "Cross Sections",        icon: "✂️",  desc: "Building cut-through details",           included: true  },
  { id: "sitePlan",      label: "Site Plan",             icon: "🗺️", desc: "Property layout with setbacks",          included: true  },
  { id: "ext3d",         label: "3D Exterior Rendering", icon: "🏠", desc: "Photorealistic exterior visualization",  included: false },
  { id: "int3d",         label: "3D Interior Rendering", icon: "🛋️", desc: "Photorealistic interior visualization",  included: false },
  { id: "walkthrough",   label: "3D Walkthrough Video",  icon: "🎬", desc: "Animated video tour of the design",      included: false },
  { id: "permit",        label: "Permit-Ready Set",      icon: "📄", desc: "Complete drawings for permit submission", included: false },
  { id: "mep",           label: "MEP Coordination",      icon: "⚡", desc: "Mechanical, electrical, plumbing notes",  included: false },
  { id: "structural",    label: "Structural Notes",      icon: "🔩", desc: "Foundation & framing references",        included: false },
];

export function calcEstimate(data) {
  const isUS = data.region === "US";
  const unit = isUS ? 1 : 10.764;
  const w = parseFloat(data.width) || 0;
  const l = parseFloat(data.length) || 0;
  const baseArea = w * l * unit;

  const baseRate = isUS ? 4.5 : 48;
  let lo = baseArea * baseRate;
  let hi = lo * 1.22;

  if (data.levels?.second)  { lo += baseArea * 4.5;  hi += baseArea * 5.5; }
  if (data.levels?.basement){ lo += baseArea * 0.80;  hi += baseArea * 0.90; }
  if (data.levels?.attic)   { lo += baseArea * 0.60;  hi += baseArea * 0.72; }

  // scope type multiplier
  if (data.scopeType === "asBuilt")    { lo *= 0.6; hi *= 0.6; }
  if (data.scopeType === "landscape")  { lo *= 0.5; hi *= 0.5; }
  if (data.scopeType === "adu")        { lo *= 0.8; hi *= 0.8; }

  // add-on services
  const addons = data.selectedServices || [];
  const addonRate = isUS ? 1.2 : 12;
  const addonCount = addons.filter(id => {
    const svc = SERVICES.find(s => s.id === id);
    return svc && !svc.included;
  }).length;
  lo += baseArea * addonRate * addonCount * 0.15;
  hi += baseArea * addonRate * addonCount * 0.18;

  if (data.rush === "express") { lo *= 1.60; hi *= 1.60; }

  const confidence = Math.min(
    20 + (data.region ? 10 : 0) + (baseArea > 0 ? 20 : 0) +
    (data.role ? 10 : 0) + (data.status ? 10 : 0) +
    (data.rooms?.bedrooms ? 10 : 0) + (data.rush ? 10 : 0),
    100
  );

  const symbol = isUS ? "$" : "R$";
  const fmt = (n) => symbol + Math.round(n).toLocaleString(isUS ? "en-US" : "pt-BR");

  const breakdown = [];
  if (baseArea > 0) {
    breakdown.push({ label: `Base Area (${Math.round(baseArea)} ${isUS?"sqft":"m²"})`, val: fmt(baseArea * baseRate) });
  }
  if (data.levels?.second)   breakdown.push({ label: "2nd Floor",  val: `+${fmt(baseArea*4.5)}` });
  if (data.levels?.basement) breakdown.push({ label: "Basement",   val: `+${fmt(baseArea*0.80)}` });
  if (data.levels?.attic)    breakdown.push({ label: "Attic",      val: `+${fmt(baseArea*0.60)}` });
  if (data.scopeType === "asBuilt")   breakdown.push({ label: "As-Built (−40%)", val: "×0.60" });
  if (data.scopeType === "landscape") breakdown.push({ label: "Landscape (−50%)", val: "×0.50" });
  if (data.scopeType === "adu")       breakdown.push({ label: "ADU (−20%)", val: "×0.80" });
  if (addonCount > 0) breakdown.push({ label: `Add-on Services (${addonCount})`, val: `+${fmt(baseArea * addonRate * addonCount * 0.15)}` });
  if (data.rush==="express") breakdown.push({ label: "Rush Express (60%)", val: "×1.60" });

  return { lo: fmt(lo), hi: fmt(hi), confidence, breakdown };
}
