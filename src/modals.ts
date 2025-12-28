import { App, Modal, MarkdownRenderer, Component } from "obsidian";
import { LeitnerCard, LeitnerStats } from "./types";
import { LeitnerService } from "./service";
import { t } from "./lang";

export class LeitnerStudyModal extends Modal {
	private index = 0;
	private showAnswer = false;

	constructor(
		app: App,
		private service: LeitnerService,
		private cards: LeitnerCard[]
	) {
		super(app);
	}

	onOpen() {
		void this.render();
	}

	async render() {
		const { contentEl } = this;
		contentEl.empty();

		if (this.index >= this.cards.length) {
			contentEl.createEl("h2", { text: t("SESSION_DONE_TITLE") });
			contentEl.createEl("p", { text: t("SESSION_DONE_MSG") });
			return;
		}

		const card = this.cards[this.index];
		if (!card) return;

		const header = contentEl.createDiv({ cls: "leitner-header" });
		header.createEl("span", { text: `${t("CARD_PROGRESS")} ${this.index + 1} / ${this.cards.length}` });
		
		header.createEl("span", { 
			text: ` (${t("LEVEL")} ${card.level})`, 
			attr: { style: "color: var(--text-muted); font-size: 0.8em;" }
		});

		const questionEl = contentEl.createDiv({ cls: "leitner-question markdown-rendered" });
		
		await MarkdownRenderer.render(this.app, card.question, questionEl, card.file.path, this as unknown as Component);

		if (this.showAnswer) {
			contentEl.createEl("hr");
			
			const answerEl = contentEl.createDiv({ cls: "leitner-answer markdown-rendered" });
			await MarkdownRenderer.render(this.app, card.answer, answerEl, card.file.path, this as unknown as Component);

			const buttons = contentEl.createDiv({ 
				attr: { style: "display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;" }
			});

			const badBtn = buttons.createEl("button", { text: t("BTN_FORGOT") });
			badBtn.classList.add("mod-warning");
			badBtn.onclick = () => { void this.finishCard(card, false); };

			const goodBtn = buttons.createEl("button", { text: t("BTN_REMEMBER") });
			goodBtn.classList.add("mod-cta");
			goodBtn.onclick = () => { void this.finishCard(card, true); };

		} else {
			const btnContainer = contentEl.createDiv({ 
				attr: { style: "text-align: center; margin-top: 2rem;" }
			});
			const showBtn = btnContainer.createEl("button", { text: t("BTN_SHOW_ANSWER") });
			showBtn.onclick = () => {
				this.showAnswer = true;
				void this.render();
			};
		}
	}

	async finishCard(card: LeitnerCard, correct: boolean) {
		await this.service.updateCardResult(card, correct);
		this.index++;
		this.showAnswer = false;
		void this.render();
	}
}

export class LeitnerStatsModal extends Modal {
	constructor(app: App, private stats: LeitnerStats) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", { text: t("STATS_HEADER") });
		
		const grid = contentEl.createDiv({ 
			attr: { style: "display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" }
		});

		const addStat = (label: string, val: number, icon: string) => {
			const box = grid.createDiv({ 
				attr: { style: "border: 1px solid var(--background-modifier-border); padding: 15px; border-radius: 8px; text-align: center;" }
			});
			box.createDiv({ 
				text: icon, 
				attr: { style: "font-size: 2em; margin-bottom: 5px;" }
			});
			box.createDiv({ 
				text: label, 
				attr: { style: "font-weight: bold; color: var(--text-muted);" }
			});
			box.createDiv({ 
				text: String(val), 
				attr: { style: "font-size: 1.5em;" }
			});
		};

		addStat(t("STAT_DUE"), this.stats.dueToday, "🎓");
		addStat(t("STAT_OVERDUE"), this.stats.overdue, "🔥");
		addStat(t("STAT_NEW"), this.stats.newCards, "🆕");
		addStat(t("STAT_FUTURE"), this.stats.future, "📅");
	}
}