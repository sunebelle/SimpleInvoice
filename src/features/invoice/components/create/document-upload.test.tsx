import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@/test/utils/render";
import { DocumentUpload } from "./document-upload";

describe("DocumentUpload", () => {
  it("calls onChange when file selected", async () => {
    const onChange = vi.fn();
    render(<DocumentUpload documents={[]} onChange={onChange} />);

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
    });
    expect(onChange.mock.calls[0][0][0].documentName).toBe("test.pdf");
  });

  it("renders uploaded documents with preview link", () => {
    render(
      <DocumentUpload
        documents={[
          {
            documentId: "doc-1",
            documentName: "receipt.png",
            documentUrl: "data:image/png;base64,abc",
          },
        ]}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("receipt.png")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Preview" })).toBeInTheDocument();
  });
});
