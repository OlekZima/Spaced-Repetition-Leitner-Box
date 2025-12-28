import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, SpacedRepetitionLeitnerBoxSettings } from "./types";
import { LeitnerSettingTab } from "./settings";
import { LeitnerService } from "./service";
import { LeitnerStudyModal, LeitnerStatsModal } from "./modals";
import { t, setLanguage } from "./lang";

export default class SpacedRepetitionLeitnerBox extends Plugin {
	settings: SpacedRepetitionLeitnerBoxSettings;
	service: LeitnerService;

	async onload() {
		await this.loadSettings();

		setLanguage(this.settings.language);

		this.service = new LeitnerService(this.app);

		this.addRibbonIcon("play-circle", t("RIBBON_STUDY"), async () => {
			const allCards = await this.service.getAllCards();

			const dueCards = allCards.filter(c => this.service.isCardDue(c));

			if (dueCards.length === 0) {
				new Notice(t("MSG_NO_CARDS"));
				return;
			}

			new LeitnerStudyModal(this.app, this.service, dueCards).open();
		});

		this.addRibbonIcon("bar-chart", t("RIBBON_STATS"), async () => {
			new Notice(t("MSG_CALCULATING"));
			const allCards = await this.service.getAllCards();
			const stats = this.service.calculateStats(allCards);
			new LeitnerStatsModal(this.app, stats).open();
		});

		this.addSettingTab(new LeitnerSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as unknown as Partial<SpacedRepetitionLeitnerBoxSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}