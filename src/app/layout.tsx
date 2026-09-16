import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AiAssistantWidget } from "@/components/ai-assistant-widget";
import { ScrollToTop } from "@/components/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const urduFont = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QanoonPK — Pakistan Legal Directory | قانون پی کے",
  description:
    "Pakistan's bilingual (Urdu/English) digital directory of federal & provincial laws — searchable, categorized, and free. Informational only, not legal advice.",
  keywords: [
    "Pakistan laws", "Pakistani law", "PPC", "PECA", "Income Tax Ordinance",
    "Family law Pakistan", "Cyber crime Pakistan", "Qanoon", "QanoonPK",
    "Urdu law", "Pakistan legal directory", "Muslim Family Laws Ordinance",
    "Legal directory Pakistan", "Pakistan law online", "Qanun-e-Shahadat",
    "CrPC", "Criminal law Pakistan", "Tax law Pakistan", "Hudood Ordinance",
  ],
  authors: [{ name: "QanoonPK" }],
  creator: "QanoonPK",
  metadataBase: new URL("https://qanoonpk.example"),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
    languages: { "en": "/", "ur": "/" },
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: "QanoonPK — Pakistan Legal Directory",
    description: "Bilingual digital directory of Pakistan's federal & provincial laws — searchable, categorized, and free.",
    siteName: "QanoonPK",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ur_PK"],
    url: "https://qanoonpk.example",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "QanoonPK — Pakistan Legal Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QanoonPK — Pakistan Legal Directory",
    description: "Bilingual digital directory of Pakistan's federal & provincial laws.",
    creator: "@qanoonpk",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Legal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${urduFont.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <SiteHeader />
              <main className="flex-1 flex flex-col">{children}</main>
              <SiteFooter />
              <AiAssistantWidget />
              <ScrollToTop />
              <Toaster />
              <SonnerToaster position="top-center" richColors />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
