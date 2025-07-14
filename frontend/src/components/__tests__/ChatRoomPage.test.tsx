import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatRoomPage from "../../pages/explore/ChatRoomPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as cookieUtils from "../../utils/cookies";
import { vi } from "vitest";

vi.mock("../../hooks/useChatWebSocket", () => ({
  default: () => ({
    sendMessage: vi.fn(),
    isConnected: true,
    reconnect: vi.fn(),
  }),
}));

vi.mock("../../components/chat/ChatHeader", () => ({
  __esModule: true,
  default: () => <div>ChatHeader</div>,
}));

vi.mock("../../components/chat/ChatMessages", () => ({
  __esModule: true,
  default: () => <div>ChatMessages</div>,
}));

vi.mock("../../components/chat/ChatInput", () => ({
  __esModule: true,
  default: ({ input, setInput, handleSend }: any) => (
    <div>
      <input
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  ),
}));

vi.spyOn(cookieUtils, "getCookie").mockImplementation((key: string) => {
  if (key === "petProfileId") return "sender123";
  return null;
});

global.fetch = vi.fn().mockImplementation((url: string) => {
  if (url.includes("/api/users/receiver456")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ userName: "Receiver" }),
    });
  }
  if (url.includes("/api/chat/room")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }
  return Promise.reject(new Error("Not found"));
});

describe("ChatRoomPage Messaging", () => {
  it("sends a message and clears input", async () => {
    render(
      <MemoryRouter initialEntries={["/chat/receiver456"]}>
        <Routes>
          <Route path="/chat/:otherUserId" element={<ChatRoomPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("ChatHeader")).toBeInTheDocument();
    expect(screen.getByText("ChatMessages")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      "Type a message"
    ) as HTMLInputElement;
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");

    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
