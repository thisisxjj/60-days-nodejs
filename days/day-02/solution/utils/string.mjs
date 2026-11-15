export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str, length) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W]+/g, "-")
    .replace("^-+|-+$/g", "");
}
