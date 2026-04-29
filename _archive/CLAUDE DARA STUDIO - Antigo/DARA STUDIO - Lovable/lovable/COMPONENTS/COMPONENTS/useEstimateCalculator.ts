import { useMemo } from "react";
import {
  BASE_RATE,
  PROJECT_TYPES,
  SIZE_OPTIONS,
  SIZE_OPTIONS_BR,
  FLOOR_OPTIONS,
  RUSH_OPTIONS,
  OPTIONAL_SERVICES,
} from "./types";

interface CalcInput {
  country: string;
  projectType: string;
  projectSize: string;
  customSqft?: number;
  floors: string[];
  rushService: string;
  optionalServices: string[];
  draftingServices: string[];
}

export function useEstimateCalculator(input: CalcInput) {
  return useMemo(() => {
    const { country, projectType, projectSize, customSqft, floors, rushService, optionalServices, draftingServices } = input;

    // Need at minimum projectType and projectSize to calculate
    if (!projectType || !projectSize) {
      return { low: 0, high: 0, total: 0, breakdown: [], currency: "USD", canCalculate: false };
    }

    // Special case: 3D Visualization Only
    if (projectType === "3d_visualization") {
      let vizTotal = 0;
      const vizBreakdown: { label: string; value: number }[] = [];
      for (const id of optionalServices) {
        const svc = OPTIONAL_SERVICES.find((s) => s.id === id);
        if (svc) {
          vizTotal += svc.price;
          vizBreakdown.push({ label: svc.label, value: svc.price });
        }
      }
      if (vizTotal === 0) {
        vizTotal = 500;
        vizBreakdown.push({ label: "3D Visualization (base)", value: 500 });
      }
      return { low: vizTotal, high: vizTotal, total: vizTotal, breakdown: vizBreakdown, currency: "USD", canCalculate: true };
    }

    // Get area
    const isBR = country === "BR";
    const sizeOpts = isBR ? SIZE_OPTIONS_BR : SIZE_OPTIONS;
    const sizeOpt = sizeOpts.find((s) => s.value === projectSize);
    let area = projectSize === "custom" && customSqft ? customSqft : (sizeOpt?.avg || 0);
    
    // Convert m² to sqft for calculation if Brazil
    if (isBR && area > 0) {
      area = area * 10.764; // 1 m² = 10.764 sqft
    }

    if (area === 0) return { low: 0, high: 0, total: 0, breakdown: [], currency: "USD", canCalculate: false };

    // Project type factor
    const projOpt = PROJECT_TYPES.find((p) => p.value === projectType);
    const projFactor = projOpt?.factor || 1;

    // Floor factor (multi-select: use highest factor)
    const selectedFloors = floors || [];
    const floorFactor = selectedFloors.length > 0
      ? Math.max(...selectedFloors.map(f => FLOOR_OPTIONS.find(fo => fo.value === f)?.factor || 1))
      : 1;

    // Base cost
    const baseCost = area * BASE_RATE * projFactor * floorFactor;

    // Optional services
    const hasFullSet = draftingServices.includes("full_construction_set");
    let servicesCost = 0;
    const serviceItems: { label: string; value: number }[] = [];
    for (const id of optionalServices) {
      const svc = OPTIONAL_SERVICES.find((s) => s.id === id);
      if (svc) {
        // 3D Exterior is free if Full Construction Document Set is selected
        const price = (svc.id === "3d_exterior" && hasFullSet) ? 0 : svc.price;
        servicesCost += price;
        serviceItems.push({ label: svc.label, value: price });
      }
    }

    // Rush fee
    const rushOpt = RUSH_OPTIONS.find(r => r.value === rushService);
    const rushPercent = rushOpt?.rushPercent || 0;
    const rushFee = rushPercent > 0 ? baseCost * (rushPercent / 100) : 0;

    const total = Math.round(baseCost + servicesCost + rushFee);

    // Build range (±variation)
    const low = Math.round(total * 0.92);
    const high = Math.round(total * 1.10);

    // Breakdown (for admin only — not shown to client)
    const breakdown: { label: string; value: number }[] = [
      { label: `Base Drafting Fee (${Math.round(area).toLocaleString()} sqft × $${BASE_RATE}/sqft)`, value: Math.round(area * BASE_RATE) },
    ];

    if (projFactor !== 1) {
      breakdown.push({ label: `Complexity (${projOpt?.label} ×${projFactor})`, value: Math.round(area * BASE_RATE * projFactor - area * BASE_RATE) });
    }

    if (floorFactor !== 1) {
      breakdown.push({ label: `Floor Adjustment (×${floorFactor})`, value: Math.round(baseCost - area * BASE_RATE * projFactor) });
    }

    breakdown.push(...serviceItems);

    if (rushFee > 0) {
      breakdown.push({ label: `Rush Fee (+${rushPercent}%)`, value: Math.round(rushFee) });
    }

    // Complexity label for client display
    const complexityLabel = projFactor <= 0.85 ? "Simple" : projFactor <= 1.05 ? "Standard" : projFactor <= 1.20 ? "Moderate" : "Complex";

    return { low, high, total, breakdown, currency: "USD", canCalculate: true, complexityLabel };
  }, [input.country, input.projectType, input.projectSize, input.customSqft, input.floors, input.rushService, input.optionalServices, input.draftingServices]);
}
