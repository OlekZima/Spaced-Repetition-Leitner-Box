import { TFile } from "obsidian";

export interface SpacedRepetitionLeitnerBoxSettings {
    language: string; // 'auto', 'en', 'pl', 'uk'
}

export const DEFAULT_SETTINGS: SpacedRepetitionLeitnerBoxSettings = {
    language: 'auto',
};

export interface LeitnerCard {
    file: TFile;
    index: number;
    question: string;
    answer: string;
    level: number;
    lastReviewed: Date;
    originalRaw: string;
}

export interface LeitnerStats {
    dueToday: number;
    overdue: number;
    future: number;
    newCards: number;
}