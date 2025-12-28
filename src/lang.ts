import { moment } from "obsidian";

let selectedLanguage = 'auto';

export function setLanguage(lang: string) { selectedLanguage = lang; }

const en = {
    RIBBON_STUDY: "Leitner - Start study",
    RIBBON_STATS: "Leitner - Statistics",
    MSG_NO_CARDS: "All done for today!",
    MSG_CALCULATING: "Calculating cards...",

    SESSION_DONE_TITLE: "Session complete!",
    SESSION_DONE_MSG: "Come back tomorrow for more.",
    CARD_PROGRESS: "Card",
    LEVEL: "Level",
    BTN_FORGOT: "Forgot",
    BTN_REMEMBER: "Remember",
    BTN_SHOW_ANSWER: "Show answer",

    STATS_HEADER: "Card Statistics",
    STAT_DUE: "To study",
    STAT_OVERDUE: "Overdue",
    STAT_NEW: "New",
    STAT_FUTURE: "Future",

    SETTING_LIMIT_NAME: "Daily card limit",
    SETTING_LIMIT_DESC: "Maximum number of cards per session",

    SETTING_LANG_NAME: "Language",
    SETTING_LANG_DESC: "Choose the interface language (`auto` = Obsidian language)",
};

const pl: typeof en = {
    RIBBON_STUDY: "Leitner - Rozpocznij naukę",
    RIBBON_STATS: "Leitner - Statystyki",
    MSG_NO_CARDS: "Wszystko na dziś zrobione!",
    MSG_CALCULATING: "Przeliczam karty...",

    SESSION_DONE_TITLE: "Sesja zakończona!",
    SESSION_DONE_MSG: "Wróć tro po więcej wiedzy.",
    CARD_PROGRESS: "Karta",
    LEVEL: "Poziom",
    BTN_FORGOT: "Zapomniałem",
    BTN_REMEMBER: "Pamiętam",
    BTN_SHOW_ANSWER: "Pokaż odpowiedź",

    STATS_HEADER: "Statystyki kart",
    STAT_DUE: "Do nauki",
    STAT_OVERDUE: "Zaległe",
    STAT_NEW: "Nowe",
    STAT_FUTURE: "Przyszłe",

    SETTING_LIMIT_NAME: "Dzienny limit kart",
    SETTING_LIMIT_DESC: "Maksymalna liczba kart w jednej sesji",

    SETTING_LANG_NAME: "Język",
    SETTING_LANG_DESC: "Wybierz język interfejsu (`auto` = język Obsidian)",
};

const uk: typeof en = {
    RIBBON_STUDY: "Leitner - Почати навчання",
    RIBBON_STATS: "Leitner - Статистика",
    MSG_NO_CARDS: "На сьогодні все!",
    MSG_CALCULATING: "Обчислення карток...",

    SESSION_DONE_TITLE: "Сесія завершена!",
    SESSION_DONE_MSG: "Повертайся завтра за новими знаннями.",
    CARD_PROGRESS: "Картка",
    LEVEL: "Рівень",
    BTN_FORGOT: "Не пам'ятаю",
    BTN_REMEMBER: "Пам'ятаю",
    BTN_SHOW_ANSWER: "Показати відповідь",

    STATS_HEADER: "Статистика карток",
    STAT_DUE: "До вивчення",
    STAT_OVERDUE: "Прострочені",
    STAT_NEW: "Нові",
    STAT_FUTURE: "Майбутні",

    SETTING_LIMIT_NAME: "Денний ліміт карток",
    SETTING_LIMIT_DESC: "Максимальна кількість карток за сесію",

    SETTING_LANG_NAME: "Мова",
    SETTING_LANG_DESC: "Виберіть мову інтерфейсу (`auto` = мова Obsidian)",
};

const locales: { [key: string]: typeof en } = {
    en,
    pl,
    uk,
};

export function t(key: keyof typeof en): string {
    const currentLocale = selectedLanguage === 'auto' ? moment.locale() : selectedLanguage;
    const localeData = locales[currentLocale] || en;
    return localeData[key] || en[key];
}