/**
 * Hasanat Calculator
 * Based on the Hadith: Reading one letter (harf) of the Quran earns 10 hasanat (good deeds)
 */

/**
 * Counts Arabic letters in a string (excluding diacritics)
 */
export function countArabicLetters(text: string): number {
    if (!text) return 0;

    // Remove diacritics (tashkeel) - only count base Arabic letters
    const arabicLettersOnly = text.replace(/[\u0617-\u061A\u064B-\u0652]/g, '');

    // Count Arabic letters (Unicode range for Arabic letters)
    const arabicLetters = arabicLettersOnly.match(/[\u0621-\u064A]/g);

    return arabicLetters ? arabicLetters.length : 0;
}

/**
 * Calculates hasanat (good deeds) for given Arabic text
 * 1 Arabic letter = 10 hasanat
 */
export function calculateHasanat(text: string): number {
    const letterCount = countArabicLetters(text);
    return letterCount * 10;
}

/**
 * Formats hasanat count with proper number formatting
 */
export function formatHasanat(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
}

/**
 * Gets stats for a full ayah
 */
export function getAyahStats(arabicText: string) {
    const letters = countArabicLetters(arabicText);
    const hasanat = calculateHasanat(arabicText);

    return {
        letters,
        hasanat,
        formatted: formatHasanat(hasanat)
    };
}
