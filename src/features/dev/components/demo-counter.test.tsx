import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@/test/utils/render";
import { DemoCounter } from "./demo-counter";

describe("DemoCounter", () => {
  it("renders initial count and increments on click", () => {
    render(<DemoCounter initialCount={2} />);

    expect(screen.getByTestId("counter-value")).toHaveTextContent("2");
    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("3");
  });

  it("resets to initial count", () => {
    render(<DemoCounter initialCount={5} />);

    fireEvent.click(screen.getByRole("button", { name: "Increment" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("5");
  });
});
