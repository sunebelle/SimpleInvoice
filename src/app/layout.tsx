import { siteMetadata } from "@/config/site";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import { UnsavedChangesModal } from "@/features/invoice/components/shared/unsaved-changes-modal";
import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
          <UnsavedChangesModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
