export function trimText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function hasText(value) {
  return trimText(value).length > 0;
}

export function compactStrings(values) {
  return Array.isArray(values) ? values.map(trimText).filter(Boolean) : [];
}
