import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
	en: { translation: en },
	es: { translation: es },
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		detection: {
			caches: ["localStorage"],
			order: ["localStorage", "navigator"],
		},
		fallbackLng: "es",
		interpolation: {
			escapeValue: false,
		},
		resources,
	});

export default i18n;
