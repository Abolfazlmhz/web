/*
Copyright 2025 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

/**
 * List of RTL (Right-to-Left) languages supported by Element
 * Based on common RTL languages that might be used in Matrix clients
 */
const RTL_LANGUAGES = new Set([
    "fa", // Persian/Farsi
    "ar", // Arabic
    "he", // Hebrew
    "ur", // Urdu
    "yi", // Yiddish
    "az", // Azerbaijani (when written in Arabic script)
    "dv", // Divehi
    "ku", // Kurdish (when written in Arabic script)
    "ps", // Pashto
    "sd", // Sindhi
    "ug", // Uyghur
]);

/**
 * Determines if a given language code represents a right-to-left language
 * @param languageCode - The language code to check (e.g., "en", "fa", "ar-SA")
 * @returns true if the language is RTL, false otherwise
 */
export function isRTLLanguage(languageCode: string): boolean {
    // Extract the base language code (e.g., "ar" from "ar-SA")
    const baseLanguage = languageCode.split('-')[0].toLowerCase();
    return RTL_LANGUAGES.has(baseLanguage);
}

/**
 * Gets the appropriate document direction for a given language
 * @param languageCode - The language code to check
 * @returns "rtl" if the language is RTL, "ltr" otherwise
 */
export function getDocumentDirection(languageCode: string): "rtl" | "ltr" {
    return isRTLLanguage(languageCode) ? "rtl" : "ltr";
}
