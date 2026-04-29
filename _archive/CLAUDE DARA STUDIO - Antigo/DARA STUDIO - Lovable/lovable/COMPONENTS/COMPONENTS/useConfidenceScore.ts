import { useMemo } from "react";
import { CONFIDENCE_WEIGHTS } from "./types";

interface ConfidenceInput {
  city: string;
  state: string;
  projectType: string;
  projectSize: string;
  customSqft?: number;
  rooms: Record<string, number>;
  filesCount: number;
  timeline: string;
}

export function useConfidenceScore(input: ConfidenceInput) {
  return useMemo(() => {
    let score = 0;

    // Location (10%)
    if (input.city && input.state) {
      score += CONFIDENCE_WEIGHTS.location;
    } else if (input.city || input.state) {
      score += CONFIDENCE_WEIGHTS.location * 0.5;
    }

    // Project Type (20%)
    if (input.projectType) {
      score += CONFIDENCE_WEIGHTS.projectType;
    }

    // Project Size (25%)
    if (input.projectSize) {
      score += CONFIDENCE_WEIGHTS.projectSize;
      if (input.projectSize === "custom" && input.customSqft) {
        // exact size = full weight already
      }
    }

    // Program Requirements (15%)
    const filledRooms = Object.values(input.rooms).filter((v) => v > 0).length;
    if (filledRooms >= 4) {
      score += CONFIDENCE_WEIGHTS.programRequirements;
    } else if (filledRooms >= 2) {
      score += CONFIDENCE_WEIGHTS.programRequirements * 0.6;
    } else if (filledRooms >= 1) {
      score += CONFIDENCE_WEIGHTS.programRequirements * 0.3;
    }

    // Uploaded Documents (20%)
    if (input.filesCount >= 3) {
      score += CONFIDENCE_WEIGHTS.uploadedDocuments;
    } else if (input.filesCount >= 1) {
      score += CONFIDENCE_WEIGHTS.uploadedDocuments * (input.filesCount / 3);
    }

    // Timeline (10%)
    if (input.timeline) {
      score += CONFIDENCE_WEIGHTS.timeline;
    }

    return Math.min(Math.round(score), 100);
  }, [input.city, input.state, input.projectType, input.projectSize, input.customSqft, input.rooms, input.filesCount, input.timeline]);
}
