export const API_BASE_URL = 'http://localhost:5000/api/bookstore';
export const normalizeUrlParam = (param: string) =>
  param
    .replace(/-/g, ' ')
    .replace(/(^\w|\s\w)/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '-');