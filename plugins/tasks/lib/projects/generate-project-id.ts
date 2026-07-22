/** biome-ignore-all lint/style/noNonNullAssertion: array length check is already asserted */

/**
 * Generates a 3 letter project id from a project name
 * Examples:
 * Personal Knowledge Management -> PKM
 */
export function generateProjectId(projectName: string) {
  // Ignore words
  const stopwords = ["de", "del", "la", "el", "los", "las", "y", "en", "a"];

  const words = projectName
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .split(/\s+/)
    .filter(p => p && !stopwords.includes(p));

  let id = "";

  if (words.length >= 3) {
    id = words.slice(0, 3).map(p => p[0]).join("");
  } else if (words.length === 2) {
    id = words[0]![0]! + words[1]![0] + (words[1]![1] || words[0]![1] || "x");
  } else if (words.length === 1) {
    const p = words[0]!;
    const consonants = p.replace(/[aeiou]/g, "");
    const vowels = p.replace(/[^aeiou]/g, "");

    if (consonants.length >= 2 && vowels.length >= 1) {
      id = consonants[0]! + vowels[0] + consonants[1];
    } else {
      id = (`${p}xxx`).slice(0, 3);
    }
  }

  return id.toUpperCase();
}