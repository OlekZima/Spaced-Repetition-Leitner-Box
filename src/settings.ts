import { App, PluginSettingTab, Setting } from "obsidian";
import SpacedRepetitionLeitnerBox from "./main";
import { t, setLanguage } from "./lang";

export class LeitnerSettingTab extends PluginSettingTab {
	plugin: SpacedRepetitionLeitnerBox;

	constructor(app: App, plugin: SpacedRepetitionLeitnerBox) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(t("SETTING_LANG_NAME"))
			.setDesc(t("SETTING_LANG_DESC"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("auto", "Auto")
					.addOption("en", "English")
					.addOption("pl", "Polski")
					.addOption("uk", "Українська")
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value;
						setLanguage(value);

						await this.plugin.saveSettings();
						this.display();
					})
			);
	}
}