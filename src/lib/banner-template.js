export const BANNER_STORAGE_KEY = "aquatic-treasures.banner.main.v1";

export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;

export const BANNER_LIMITS = {
  headlineMaxLength: 72,
  subtitleMaxLength: 180,
  headlineWarningLength: 54,
  subtitleWarningLength: 132,
  minHeadlineFontSize: 54,
  minSubtitleFontSize: 26,
};

export const BANNER_FONT_OPTIONS = [
  { value: "Arial", label: "Arial", css: "Arial, Helvetica, sans-serif" },
  { value: "Trebuchet MS", label: "Trebuchet MS", css: "'Trebuchet MS', Arial, sans-serif" },
  { value: "Georgia", label: "Georgia", css: "Georgia, 'Times New Roman', serif" },
  { value: "Impact", label: "Impact", css: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },
  { value: "Courier New", label: "Courier New", css: "'Courier New', Courier, monospace" },
];

export const DEFAULT_BANNER_STYLE = {
  fontFamily: "Arial",
  headlineColor: "#F5F7F8",
  accentColor: "#65DCE1",
  subtitleColor: "#F4F7F8",
  metaColor: "#57CEDD",
};

export const BANNER_LAYOUT = {
  text: {
    x: 90,
    y: 250,
    width: 1050,
    height: 470,
    headlineMaxFontSize: 166,
    headlineLineHeight: 0.88,
    headlineMaxLines: 3,
    headlineMaxHeight: 300,
    subtitleMaxFontSize: 44,
    subtitleLineHeight: 1.15,
    subtitleMaxLines: 3,
    subtitleMaxHeight: 120,
    metaFontSize: 46,
  },
  presenter: {
    x: 930,
    y: 125,
    width: 1008,
    height: 972,
  },
};

export const DEFAULT_BANNER_RECORD = {
  version: 1,
  templateId: "main",
  headline: "AQUATIC ECOSYSTEMS",
  subtitle: "Space Coast Aquarium Society",
  date: "",
  time: "",
  backgroundSrc: "",
  focalX: 0.5,
  focalY: 0.5,
  zoom: 1,
  ...DEFAULT_BANNER_STYLE,
};

export function clamp(value, minimum, maximum, fallback = minimum) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, numericValue));
}

export function normalizeBannerRecord(value, availableBackgrounds = []) {
  const source = value && typeof value === "object" ? value : {};
  const fallbackBackground = availableBackgrounds[0] ?? "";
  const requestedBackground = typeof source.backgroundSrc === "string" ? source.backgroundSrc : "";
  const isLocalImageData = /^data:image\/(?:avif|jpeg|jpg|png|webp);base64,/i.test(requestedBackground);
  const backgroundSrc = availableBackgrounds.includes(requestedBackground)
    ? requestedBackground
    : isLocalImageData
      ? requestedBackground
      : fallbackBackground;
  const fontFamily = BANNER_FONT_OPTIONS.some((option) => option.value === source.fontFamily)
    ? source.fontFamily
    : DEFAULT_BANNER_STYLE.fontFamily;
  const normalizeColor = (value, fallback) =>
    typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : fallback;

  return {
    version: 1,
    templateId: "main",
    headline:
      typeof source.headline === "string"
        ? source.headline.slice(0, BANNER_LIMITS.headlineMaxLength)
        : DEFAULT_BANNER_RECORD.headline,
    subtitle:
      typeof source.subtitle === "string"
        ? source.subtitle.slice(0, BANNER_LIMITS.subtitleMaxLength)
        : DEFAULT_BANNER_RECORD.subtitle,
    date: typeof source.date === "string" ? source.date : "",
    time: typeof source.time === "string" ? source.time : "",
    backgroundSrc,
    backgroundName:
      isLocalImageData && typeof source.backgroundName === "string"
        ? source.backgroundName.slice(0, 120)
        : "",
    focalX: clamp(source.focalX, 0, 1, 0.5),
    focalY: clamp(source.focalY, 0, 1, 0.5),
    zoom: clamp(source.zoom, 1, 2.4, 1),
    fontFamily,
    headlineColor: normalizeColor(source.headlineColor, DEFAULT_BANNER_STYLE.headlineColor),
    accentColor: normalizeColor(source.accentColor, DEFAULT_BANNER_STYLE.accentColor),
    subtitleColor: normalizeColor(source.subtitleColor, DEFAULT_BANNER_STYLE.subtitleColor),
    metaColor: normalizeColor(source.metaColor, DEFAULT_BANNER_STYLE.metaColor),
  };
}

export function getBannerFontFamily(value) {
  return BANNER_FONT_OPTIONS.find((option) => option.value === value)?.css
    ?? BANNER_FONT_OPTIONS[0].css;
}

export function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

export function formatTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value || "")) {
    return "";
  }

  const [rawHour, minute] = value.split(":").map(Number);
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;
  return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function displayBackgroundName(source) {
  const filename = source.split("/").pop() || "Background";
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/^aquarium-\d+-/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function wrapText(context, value, maximumWidth) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return [];
  }

  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || context.measureText(candidate).width <= maximumWidth) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function fitText(context, value, options) {
  const {
    family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weight = 800,
    maximumWidth,
    maximumHeight,
    maximumFontSize,
    minimumFontSize,
    lineHeight,
    maximumLines,
  } = options;

  for (let fontSize = maximumFontSize; fontSize >= minimumFontSize; fontSize -= 1) {
    context.font = `${weight} ${fontSize}px ${family}`;
    const lines = wrapText(context, value, maximumWidth);
    const height = lines.length * fontSize * lineHeight;

    const linesFitWidth = lines.every((line) => context.measureText(line).width <= maximumWidth);

    if (lines.length <= maximumLines && height <= maximumHeight && linesFitWidth) {
      return {
        fontSize,
        lines,
        lineHeight,
        overflow: false,
      };
    }
  }

  context.font = `${weight} ${minimumFontSize}px ${family}`;
  const lines = wrapText(context, value, maximumWidth);

  return {
    fontSize: minimumFontSize,
    lines,
    lineHeight,
    overflow:
      lines.length > maximumLines ||
      lines.length * minimumFontSize * lineHeight > maximumHeight ||
      lines.some((line) => context.measureText(line).width > maximumWidth),
  };
}

export function slugForFilename(value) {
  return String(value || "draft")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "draft";
}
