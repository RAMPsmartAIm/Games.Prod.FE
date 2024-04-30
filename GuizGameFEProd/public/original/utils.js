import { translations } from "./translations.js";

export function getRandomElementFromArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function getLanguage() {
    return (navigator.language || navigator.userLanguage || "en").split("-")[0];
}

export function getTranslatedCloseText() {
    let userLanguage = getLanguage();
    const translatedText = translations[userLanguage] || translations["en"];
    return translatedText;
}