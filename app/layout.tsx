import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeSync } from "@/components/theme-sync";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/content/site";
import { DEFAULT_THEME, showThemeToggle, themeBootScript } from "@/lib/theme";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: "%s · Tahaylia Higgins",
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${geist.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript() }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <ThemeSync />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        {showThemeToggle() ? <ThemeToggle /> : null}
      </body>
    </html>
  );
}
