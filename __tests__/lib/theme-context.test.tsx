import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { usePreferredTheme } from "../../lib/theme-context";

type Listener = (e: MediaQueryListEvent) => void;

let systemDark = false;
let mediaListeners: Listener[] = [];

beforeEach(() => {
  window.localStorage.clear();
  systemDark = false;
  mediaListeners = [];
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    get matches() {
      return systemDark;
    },
    media: query,
    addEventListener: (_: string, l: Listener) => mediaListeners.push(l),
    removeEventListener: (_: string, l: Listener) => {
      mediaListeners = mediaListeners.filter((x) => x !== l);
    },
  }));
});

afterEach(() => jest.restoreAllMocks());

const setSystemDark = (dark: boolean) => {
  systemDark = dark;
  mediaListeners.forEach((l) => l({ matches: dark } as MediaQueryListEvent));
};

describe("usePreferredTheme", () => {
  it("follows the OS preference when nothing is saved", () => {
    systemDark = true;
    const { result } = renderHook(() => usePreferredTheme());
    expect(result.current[0]).toBe("dark");
  });

  it("prefers a saved theme over the OS preference", () => {
    systemDark = true;
    window.localStorage.setItem("theme", "light");
    const { result } = renderHook(() => usePreferredTheme());
    expect(result.current[0]).toBe("light");
  });

  it("ignores an invalid saved value", () => {
    window.localStorage.setItem("theme", "blue");
    const { result } = renderHook(() => usePreferredTheme());
    expect(result.current[0]).toBe("light");
  });

  it("saves and applies a new theme", () => {
    const { result } = renderHook(() => usePreferredTheme());
    act(() => result.current[1]("dark"));
    expect(result.current[0]).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("updates when another tab changes the saved theme", () => {
    const { result } = renderHook(() => usePreferredTheme());
    act(() => {
      window.localStorage.setItem("theme", "dark");
      window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
    });
    expect(result.current[0]).toBe("dark");
  });

  it("follows live OS changes when nothing is saved", () => {
    const { result } = renderHook(() => usePreferredTheme());
    act(() => setSystemDark(true));
    expect(result.current[0]).toBe("dark");
  });

  it("still toggles when localStorage is blocked", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => usePreferredTheme());
    act(() => result.current[1]("dark"));
    expect(result.current[0]).toBe("dark");
  });

  it("renders light on the server", () => {
    systemDark = true;
    window.localStorage.setItem("theme", "dark");
    function Probe() {
      return <span>{usePreferredTheme()[0]}</span>;
    }
    expect(renderToString(<Probe />)).toContain("light");
  });
});
