import { App, TFile } from "obsidian";
import { LeitnerCard, LeitnerStats } from "./types";

const LEITNER_INTERVALS: Record<number, number> = {
    1: 1, 2: 2, 3: 4, 4: 7, 5: 14, 6: 30, 7: 60,
};

interface CardMeta {
    level?: number;
    last: string;
}

export class LeitnerService {
    constructor(private app: App) {}

    parseCards(content: string, file: TFile): LeitnerCard[] {
        const cards: LeitnerCard[] = [];
        let index = 0;
        
        const CARD_REGEX = /(^|\n)([^\n]+?)\n\?\n([\s\S]+?)(?:\n(<!--\s*leitner:\s*\{[\s\S]*?\}\s*-->))?(?=\n\s*\n|$)/g;

        for (const match of content.matchAll(CARD_REGEX)) {
            const questionRaw = match[2];
            const answerRaw = match[3];
            const metaRaw = match[4];

            if (!questionRaw || !answerRaw) {
                continue;
            }

            let level = 1;
            let lastReviewed = new Date(0);

            if (metaRaw) {
                try {
                    const metaJson = metaRaw
                        .replace(/<!--\s*leitner:/, "")
                        .replace(/-->/, "")
                        .trim();
                    
                    const meta = JSON.parse(metaJson) as CardMeta;
                    
                    level = meta.level ?? 1;
                    lastReviewed = new Date(meta.last);
                } catch (e) {
                    console.error(`Leitner: Błąd JSON w pliku ${file.path}`, e);
                }
            }

            const originalRaw = match[0].startsWith('\n') && match.index !== 0 
                ? match[0].substring(1) 
                : match[0];

            cards.push({
                file,
                index,
                question: questionRaw.trim(),
                answer: answerRaw.trim(),
                level,
                lastReviewed,
                originalRaw
            });
            index++;
        }
        return cards;
    }

    isCardDue(card: LeitnerCard): boolean {
        if (card.lastReviewed.getTime() === 0) return true;

        const interval = LEITNER_INTERVALS[card.level] ?? 1;
        const due = new Date(card.lastReviewed);
        due.setDate(due.getDate() + interval);
        due.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return due <= today;
    }

    async updateCardResult(card: LeitnerCard, correct: boolean): Promise<boolean> {
        const newLevel = correct ? Math.min(card.level + 1, 7) : 1;
        
        const metaObject: CardMeta = {
            level: newLevel,
            last: new Date().toISOString(),
        };
        
        const metaComment = `<!-- leitner: ${JSON.stringify(metaObject)} -->`;
        const newBlock = `${card.question}\n?\n${card.answer}\n${metaComment}`;

        try {
            await this.app.vault.process(card.file, (data) => {
                return data.replace(card.originalRaw.trim(), newBlock);
            });
            return true;
        } catch (error) {
            console.error("Leitner: Błąd zapisu pliku", error);
            return false;
        }
    }

    async getAllCards(): Promise<LeitnerCard[]> {
        const files = this.app.vault.getMarkdownFiles();
        const allCards: LeitnerCard[] = [];

        for (const file of files) {
            const content = await this.app.vault.read(file);
            allCards.push(...this.parseCards(content, file));
        }
        return allCards;
    }

    calculateStats(cards: LeitnerCard[]): LeitnerStats {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let dueToday = 0;
        let overdue = 0;
        let future = 0;
        let newCards = 0;

        for (const c of cards) {
            if (c.lastReviewed.getTime() === 0) {
                newCards++;
                continue;
            }
            const interval = LEITNER_INTERVALS[c.level] ?? 1;
            const dueDate = new Date(c.lastReviewed);
            dueDate.setDate(dueDate.getDate() + interval);
            dueDate.setHours(0, 0, 0, 0);

            if (dueDate.getTime() === today.getTime()) {
                dueToday++;
            } else if (dueDate < today) {
                overdue++;
            } else {
                future++;
            }
        }
        return { dueToday, overdue, future, newCards };
    }
}