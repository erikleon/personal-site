import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Playlists from "../../pages/playlists";

const mockSpotify = (body: unknown) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: async () => body } as Response),
  ) as unknown as typeof fetch;
};

const renderPage = async () => {
  const view = render(<Playlists data={{ access_token: "token" }} />);
  await act(async () => {});
  return view;
};

describe("Playlists", () => {
  it("sends the access token to Spotify", async () => {
    mockSpotify({ items: [] });
    await renderPage();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.spotify.com"),
      { headers: { Authorization: "Bearer token" } },
    );
  });

  it("embeds each playlist", async () => {
    mockSpotify({ items: [{ id: "p1" }, { id: "p2" }] });
    const { container } = await renderPage();
    const srcs = Array.from(container.querySelectorAll("iframe")).map((f) =>
      f.getAttribute("src"),
    );
    expect(srcs).toEqual([
      expect.stringContaining("/embed/playlist/p1"),
      expect.stringContaining("/embed/playlist/p2"),
    ]);
  });

  it("does not crash when Spotify returns an error body", async () => {
    mockSpotify({ error: { status: 401, message: "Invalid access token" } });
    const { container } = await renderPage();
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });
});
