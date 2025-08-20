import * as reactI18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { I18N_LANGUAGE } from "./types";
import { TRANSLATION_KEY } from "./translation_key";

const LANG_KEY = "lang";

reactI18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // lng: savedLang || I18N_LANGUAGE.VIETNAMESE,
        fallbackLng: I18N_LANGUAGE.VIETNAMESE,
        debug: import.meta.env.MODE === "development",
        interpolation: { escapeValue: false },
        backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
        ns: ["translation"],
        defaultNS: "translation",
        supportedLngs: [I18N_LANGUAGE.ENGLISH, I18N_LANGUAGE.VIETNAMESE],
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
            lookupLocalStorage: LANG_KEY,
        },
    });

const i18n = {
    ...reactI18n,
    translationKey: TRANSLATION_KEY,
};

export default i18n;
