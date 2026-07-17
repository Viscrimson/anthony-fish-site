const placeholderPatterns = [
  /\btodo\b/i,
  /sample placeholder/i,
  /^this is a test[\s.!?,\-]*$/i,
];

const sourceLabelsByHost = new Map([
  ["aqueon.com", "Aqueon"],
  ["apifishcare.com", "API Fish Care"],
]);

function isPlaceholderText(value) {
  return placeholderPatterns.some((pattern) => pattern.test(value));
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function humanizeText(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelFromHost(hostname) {
  const normalizedHost = hostname.replace(/^www\./i, "").toLowerCase();
  return sourceLabelsByHost.get(normalizedHost) || humanizeText(normalizedHost);
}

function detailFromUrl(url) {
  const parts = url.pathname.split("/").filter(Boolean);
  const tail = parts.at(-1) ?? "";

  if (!tail) {
    return "";
  }

  const detail = humanizeText(decodeURIComponent(tail.replace(/\.[a-z0-9]+$/i, "")));

  return detail && detail !== labelFromHost(url.hostname) ? detail : "";
}

function labelFromUrlString(value) {
  const url = parseUrl(value);

  return url ? labelFromHost(url.hostname) : "";
}

function detailFromUrlString(value) {
  const url = parseUrl(value);

  return url ? detailFromUrl(url) : "";
}

export function trimText(value) {
  if (typeof value !== "string") {
    return "";
  }

  const text = value.trim();

  return text && !isPlaceholderText(text) ? text : "";
}

export function hasText(value) {
  return trimText(value).length > 0;
}

export function compactStrings(values) {
  return Array.isArray(values) ? values.map(trimText).filter(Boolean) : [];
}

export function buildSearchIndex(values) {
  return compactStrings(values).join(" ").toLowerCase();
}

export function displayDifficulty(value) {
  const text = trimText(value);
  const lower = text.toLowerCase();

  if (lower === "beginner") {
    return "Beginner";
  }

  if (lower === "beginner to intermediate" || lower === "intermediate") {
    return "Intermediate";
  }

  if (lower === "advanced") {
    return "Advanced";
  }

  return text;
}

export function deriveTankBand(value) {
  const text = trimText(value);

  if (!text) {
    return null;
  }

  const match = text.match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return {
      value: text.toLowerCase(),
      label: text,
      sort: Number.POSITIVE_INFINITY,
    };
  }

  const gallons = Number(match[1]);

  if (!Number.isFinite(gallons)) {
    return null;
  }

  return {
    value: `${gallons}`,
    label: `${match[1]}+ gallons`,
    sort: gallons,
  };
}

export function deriveTemperamentStyle(value) {
  const text = trimText(value);

  if (!text) {
    return null;
  }

  const lower = text.toLowerCase();
  const styles = [
    { token: "territorial", label: "Territorial" },
    { token: "schooling", label: "Schooling" },
    { token: "school", label: "Schooling" },
    { token: "group", label: "Schooling" },
    { token: "community", label: "Community" },
    { token: "peaceful", label: "Peaceful" },
    { token: "active", label: "Active" },
  ];

  for (const style of styles) {
    if (lower.includes(style.token)) {
      return {
        value: style.label.toLowerCase(),
        label: style.label,
      };
    }
  }

  return null;
}

export function compactSources(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set();
  const entries = [];

  for (const rawValue of values) {
    if (typeof rawValue === "string") {
      const text = rawValue.trim();

      if (!text) {
        continue;
      }

      const url = parseUrl(text);

      if (url) {
        const href = url.toString();

        if (seen.has(href)) {
          continue;
        }

        seen.add(href);
        entries.push({
          href,
          label: labelFromHost(url.hostname),
          detail: detailFromUrl(url),
        });
        continue;
      }

      if (isPlaceholderText(text) || seen.has(text)) {
        continue;
      }

      seen.add(text);
      entries.push({
        href: "",
        label: text,
        detail: "",
      });
      continue;
    }

    if (!rawValue || typeof rawValue !== "object") {
      continue;
    }

    const rawHref = rawValue.url ?? rawValue.href ?? rawValue.link;
    const href = typeof rawHref === "string" ? rawHref.trim() : "";
    const label =
      trimText(rawValue.label ?? rawValue.title ?? rawValue.name) ||
      (href ? labelFromUrlString(href) : "");
    const detail =
      trimText(rawValue.detail ?? rawValue.note ?? rawValue.summary) ||
      (href ? detailFromUrlString(href) : "");
    const key = href || `${label}|${detail}`;

    if (!label || seen.has(key)) {
      continue;
    }

    seen.add(key);
    entries.push({
      href,
      label,
      detail,
    });
  }

  return entries;
}
