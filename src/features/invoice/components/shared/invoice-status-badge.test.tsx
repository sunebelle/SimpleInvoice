import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils/render";
import { InvoiceStatusBadge } from "./invoice-status-badge";

describe("InvoiceStatusBadge", () => {
  it("renders active status with label", () => {
    render(
      <InvoiceStatusBadge
        statusList={[
          { key: "Paid", value: true },
          { key: "Due", value: false },
        ]}
      />,
    );

    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("falls back to first status when none active", () => {
    render(
      <InvoiceStatusBadge
        statusList={[
          { key: "Draft", value: false },
          { key: "Sent", value: false },
        ]}
      />,
    );

    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
