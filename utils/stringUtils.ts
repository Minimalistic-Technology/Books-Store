// utils/stringUtils.ts
export const normalizeUrlParam = (name: string) => name.trim().replace(/\s+/g, '-').toLowerCase();

export const normalizeDisplayName = (name: string | undefined | null) => {
  if (!name || typeof name !== 'string') {
    
    return 'Unnamed Category';
  }
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};