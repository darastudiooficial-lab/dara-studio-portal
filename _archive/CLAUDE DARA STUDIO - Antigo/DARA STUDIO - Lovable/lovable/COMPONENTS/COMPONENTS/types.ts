import { z } from "zod";

// ─── COUNTRY / REGION ───
export const COUNTRIES = [
  { value: "US", label: "United States", flag: "🇺🇸", unit: "sqft", currency: "USD", postalLabel: "ZIP Code", buildingCode: "IRC / IBC" },
  { value: "BR", label: "Brazil", flag: "🇧🇷", unit: "m²", currency: "BRL", postalLabel: "CEP", buildingCode: "NBR" },
] as const;

// ─── PROJECT TYPES WITH COMPLEXITY MULTIPLIERS ───
export const PROJECT_TYPES = [
  { value: "deck_porch", label: "Deck / Porch / Outdoor Structure", factor: 0.70 },
  { value: "garage", label: "Garage", factor: 0.85 },
  { value: "kitchen_remodel", label: "Kitchen Remodel", factor: 0.95 },
  { value: "bathroom_remodel", label: "Bathroom Remodel", factor: 0.95 },
  { value: "interior_renovation", label: "Interior Renovation", factor: 1.00 },
  { value: "home_addition", label: "Home Addition", factor: 1.10 },
  { value: "single_family", label: "Single Family Home", factor: 1.15 },
  { value: "custom_home", label: "Custom Home", factor: 1.20 },
  { value: "adu", label: "ADU (Accessory Dwelling Unit)", factor: 1.15 },
  { value: "multi_family", label: "Multi-Family Residential", factor: 1.30 },
  { value: "small_commercial", label: "Small Commercial Building", factor: 1.35 },
  { value: "3d_visualization", label: "3D Visualization Only", factor: 0 },
] as const;

// ─── CLIENT TYPES ───
export const CLIENT_TYPES = [
  { value: "homeowner", label: "Homeowner", requiresCompany: false },
  { value: "contractor", label: "Builder / Contractor", requiresCompany: true },
  { value: "architect", label: "Architect", requiresCompany: true },
  { value: "developer", label: "Developer", requiresCompany: true },
  { value: "investor", label: "Investor", requiresCompany: true },
  { value: "real_estate", label: "Real Estate Agent", requiresCompany: true },
] as const;

export const PROFESSIONAL_TYPES = ["contractor", "architect", "developer", "investor", "real_estate"];

// ─── OPTIONAL SERVICES ───
export const OPTIONAL_SERVICES = [
  { id: "3d_exterior", label: "3D Exterior Rendering", price: 500 },
  { id: "3d_kitchen", label: "3D Kitchen Design", price: 350 },
  { id: "3d_bathroom", label: "3D Bathroom Design", price: 250 },
] as const;

// ─── DRAFTING SERVICES ───
export const DRAFTING_SERVICES = [
  { id: "full_construction_set", label: "Full Construction Document Set" },
  { id: "floor_plans_only", label: "Floor Plans Only" },
  { id: "as_built", label: "As-Built Drawings" },
] as const;

// ─── DESIGN SERVICES ───
export const DESIGN_SERVICES = [
  { id: "architectural_design", label: "Architectural Design" },
  { id: "space_planning", label: "Space Planning" },
  { id: "interior_layout", label: "Interior Layout" },
] as const;

// ─── PROJECT SIZE RANGES ───
export const SIZE_OPTIONS = [
  { value: "under_800", label: "Under 800 sqft", avg: 600 },
  { value: "800_1200", label: "800 – 1,200 sqft", avg: 1000 },
  { value: "1200_1800", label: "1,200 – 1,800 sqft", avg: 1500 },
  { value: "1800_2500", label: "1,800 – 2,500 sqft", avg: 2150 },
  { value: "2500_3500", label: "2,500 – 3,500 sqft", avg: 3000 },
  { value: "3500_5000", label: "3,500 – 5,000 sqft", avg: 4250 },
  { value: "5000_plus", label: "5,000+ sqft", avg: 6000 },
  { value: "custom", label: "I know the exact size", avg: 0 },
] as const;

export const SIZE_OPTIONS_BR = [
  { value: "under_80", label: "Até 80 m²", avg: 60 },
  { value: "80_150", label: "80 – 150 m²", avg: 115 },
  { value: "150_250", label: "150 – 250 m²", avg: 200 },
  { value: "250_400", label: "250 – 400 m²", avg: 325 },
  { value: "400_plus", label: "400+ m²", avg: 500 },
  { value: "custom", label: "Sei o tamanho exato", avg: 0 },
] as const;

// ─── FLOOR OPTIONS (multi-select checkboxes) ───
export const FLOOR_OPTIONS = [
  { value: "1_floor", label: "1 Floor", factor: 1.0 },
  { value: "2_floors", label: "2 Floors", factor: 1.0 },
  { value: "3_floors", label: "3 Floors", factor: 1.05 },
  { value: "basement", label: "Basement", factor: 1.10 },
  { value: "finished_basement", label: "Finished Basement", factor: 1.15 },
] as const;

// ─── PROJECT CONDITIONS ───
export const CONSTRUCTION_TYPE = [
  { value: "new_construction", label: "New Construction" },
  { value: "existing_structure", label: "Existing Structure" },
  { value: "partial_demolition", label: "Partial Demolition + New" },
] as const;

export const SITE_CONDITIONS = [
  { value: "flat", label: "Flat / Standard Lot" },
  { value: "sloped", label: "Sloped / Hillside" },
  { value: "waterfront", label: "Waterfront" },
  { value: "irregular", label: "Irregular Shape" },
  { value: "unknown", label: "Not Sure" },
] as const;

// ─── RUSH FEE OPTIONS ───
export const RUSH_OPTIONS = [
  { value: "3_weeks", label: "3 Weeks", rushPercent: 15 },
  { value: "2_weeks", label: "2 Weeks", rushPercent: 25 },
  { value: "1_week", label: "1 Week", rushPercent: 40 },
] as const;

// ─── TIMELINE OPTIONS (kept for backwards compat) ───
export const TIMELINE_OPTIONS = [
  { value: "standard", label: "Standard Delivery", rushPercent: 0 },
  { value: "3_weeks", label: "3 Weeks", rushPercent: 15 },
  { value: "2_weeks", label: "2 Weeks", rushPercent: 25 },
  { value: "1_week", label: "1 Week", rushPercent: 40 },
] as const;

// ─── RUSH REQUIRED DOCUMENTS ───
export const RUSH_REQUIRED_DOCS = [
  { id: "plot_plan", label: "Property Survey / Plot Plan" },
  { id: "site_photos", label: "Site Photos" },
  { id: "measurements", label: "Measurements" },
] as const;

// ─── UPLOAD DOCUMENT TYPES ───
export const UPLOAD_DOC_TYPES = [
  { id: "plot_plan", label: "Property Survey / Plot Plan" },
  { id: "site_photos", label: "Site Photos" },
  { id: "measurements", label: "Measurements" },
  { id: "reference_images", label: "Reference Images" },
  { id: "existing_plans", label: "Existing Plans" },
  { id: "sketches", label: "Sketches / Hand Drawings" },
] as const;

// ─── PROGRAM REQUIREMENTS (expanded) ───
export const ROOM_TYPES = [
  // Core rooms
  { id: "bedrooms", label: "Bedrooms", defaultCount: 0, category: "Core Rooms" },
  { id: "bathrooms", label: "Bathrooms", defaultCount: 0, category: "Core Rooms" },
  { id: "half_baths", label: "Half Baths", defaultCount: 0, category: "Core Rooms" },
  { id: "living_rooms", label: "Living Rooms", defaultCount: 0, category: "Core Rooms" },
  { id: "family_room", label: "Family Room", defaultCount: 0, category: "Core Rooms" },
  { id: "double_height_living", label: "Double Height Living Room", defaultCount: 0, category: "Core Rooms" },
  // Kitchen & Dining
  { id: "kitchen", label: "Kitchen", defaultCount: 0, category: "Kitchen & Dining" },
  { id: "kitchen_island", label: "Kitchen Island", defaultCount: 0, category: "Kitchen & Dining" },
  { id: "pantry", label: "Pantry", defaultCount: 0, category: "Kitchen & Dining" },
  { id: "butler_pantry", label: "Butler Pantry", defaultCount: 0, category: "Kitchen & Dining" },
  { id: "dining", label: "Dining Room", defaultCount: 0, category: "Kitchen & Dining" },
  // Utility
  { id: "walk_in_closet", label: "Walk-in Closet", defaultCount: 0, category: "Utility & Storage" },
  { id: "mudroom", label: "Mudroom", defaultCount: 0, category: "Utility & Storage" },
  { id: "laundry", label: "Laundry Room", defaultCount: 0, category: "Utility & Storage" },
  { id: "garage_bays", label: "Garage Bays", defaultCount: 0, category: "Utility & Storage" },
  // Outdoor
  { id: "covered_deck", label: "Covered Deck", defaultCount: 0, category: "Outdoor Spaces" },
  { id: "screened_porch", label: "Screened Porch", defaultCount: 0, category: "Outdoor Spaces" },
  { id: "outdoor_kitchen", label: "Outdoor Kitchen", defaultCount: 0, category: "Outdoor Spaces" },
  // Special
  { id: "office", label: "Home Office", defaultCount: 0, category: "Special Features" },
  { id: "fireplace", label: "Fireplace", defaultCount: 0, category: "Special Features" },
  { id: "gym", label: "Gym", defaultCount: 0, category: "Special Features" },
  { id: "wine_cellar", label: "Wine Cellar", defaultCount: 0, category: "Special Features" },
  { id: "sauna", label: "Sauna", defaultCount: 0, category: "Special Features" },
  { id: "elevator", label: "Elevator", defaultCount: 0, category: "Special Features" },
] as const;

// ─── CONFIDENCE SCORE WEIGHTS ───
export const CONFIDENCE_WEIGHTS = {
  location: 10,
  projectType: 20,
  projectSize: 25,
  programRequirements: 15,
  uploadedDocuments: 20,
  timeline: 10,
} as const;

// ─── BASE RATE ───
export const BASE_RATE = 1.60; // USD per sqft

// ─── RUSH FEE MINIMUM SQFT ───
export const RUSH_MIN_SQFT = 1200;

// ─── FORM SCHEMA ───
export const estimateFormSchema = z.object({
  country: z.string().min(1, "Required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  clientType: z.string().min(1, "Required"),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  projectDescription: z.string().optional(),
  projectSize: z.string().min(1, "Required"),
  customSqft: z.number().optional(),
  floors: z.array(z.string()),
  lotSize: z.string().optional(),
  projectType: z.string().min(1, "Required"),
  constructionType: z.string().optional(),
  siteCondition: z.string().optional(),
  draftingServices: z.array(z.string()),
  designServices: z.array(z.string()),
  optionalServices: z.array(z.string()),
  rooms: z.record(z.number()).optional(),
  specialRequirements: z.string().optional(),
  timeline: z.string(),
  rushService: z.string().optional(),
  agreeTerms: z.boolean(),
  notes: z.string().optional(),
});

export type EstimateFormData = z.infer<typeof estimateFormSchema>;

export const TOTAL_STEPS = 10;

export const STEP_LABELS = [
  "Location",
  "About You",
  "Details",
  "Project Type",
  "Services",
  "Program",
  "Files",
  "Overview",
  "Rush Fees",
  "Review",
];

// US States for dropdown
export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
] as const;

// Brazilian states
export const BR_STATES = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará",
  "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
  "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará",
  "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
  "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima",
  "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
] as const;
