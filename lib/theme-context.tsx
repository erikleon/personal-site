import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

export const ThemeContext = createContext<Theme>("light");

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
// Used only when localStorage is unavailable (e.g. blocked site data).
let memoryTheme: Theme | null = null;

type StoredTheme = { available: true; theme: Theme | null } | { available: false };

function readStoredTheme(): StoredTheme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return {
      available: true,
      theme: saved === "light" || saved === "dark" ? saved : null,
    };
  } catch {
    return { available: false };
  }
}

function darkMedia(): MediaQueryList | null {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(DARK_QUERY)
    : null;
}

function getSnapshot(): Theme {
  const stored = readStoredTheme();
  const explicit = stored.available ? stored.theme : memoryTheme;
  return explicit ?? (darkMedia()?.matches ? "dark" : "light");
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const media = darkMedia();
  window.addEventListener("storage", onChange);
  media?.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
    media?.removeEventListener("change", onChange);
  };
}

/**
 * The visitor's theme: their saved choice, else the OS preference.
 * Renders "light" on the server and during hydration.
 */
export function usePreferredTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    memoryTheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: memoryTheme keeps the choice for this page view.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return [theme, setTheme];
}
