import type { Metadata } from "next";
import "./globals.css";
import { LabProvider } from "@/lib/store";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PPC Lab — the anti-bullshit robot collective",
  description:
    "An experimental garage full of PPC AI robots that dig through your ad data and tell you the truth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text grain">
        <LabProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </LabProvider>
      </body>
    </html>
  );
}
