export const THEMES = ["green", "coral"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "green";

const STORAGE_KEY = "theme";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "green" || value === "coral";
}

export function readClientTheme(): Theme {
  const query = new URLSearchParams(window.location.search).get("theme");
  if (isTheme(query)) return query;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // sessionStorage can throw in private browsing modes.
  }

  return DEFAULT_THEME;
}

export function persistTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);

  try {
    sessionStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures; the attribute still updates this page.
  }

  const url = new URL(window.location.href);
  url.searchParams.set("theme", theme);
  window.history.replaceState(null, "", url);
}

export function themeBootScript(): string {
  const fallback = JSON.stringify(DEFAULT_THEME);
  const key = JSON.stringify(STORAGE_KEY);

  return `(()=>{try{var d=${fallback};var q=new URLSearchParams(location.search).get("theme");var n=q==="green"||q==="coral"?q:null;var s=null;try{s=sessionStorage.getItem(${key})}catch(e){}var t=n||(s==="green"||s==="coral"?s:d);document.documentElement.setAttribute("data-theme",t);if(n)sessionStorage.setItem(${key},n);}catch(e){}})();`;
}

export function showThemeToggle(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  );
}
