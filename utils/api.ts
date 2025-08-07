export const API_BASE_URL= "http://localhost:5000/api/bookstore";

// Normalize URL parameters (used in both Header and DynamicCategoryPage)
export const normalizeUrlParam = (param: string | undefined): string => {
  if (!param) return "";
  return decodeURIComponent(param).replace(/\s+/g, "-").toLowerCase();
};

// Normalize display names (used for UI rendering)
export const normalizeDisplayName = (name: string): string => {
  const classMatch = name.match(/Class-(\d+)/i);
  if (classMatch) {
    const num = parseInt(classMatch[1]);
    if (num <= 12) {
      return `Class ${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][num - 1]}`;
    }
  }
  return name
    .replace(/Practical-Notebooks/i, "Practical NoteBooks")
    .replace(/Reference-Books-&-Guides/i, "Reference Books&Notes")
    .replace(/School-Textbooks/i, "School Textbooks")
    .replace(/-/g, " ");
};