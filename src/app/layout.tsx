import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ProgressProvider } from "@/lib/progress";
import { Nav } from "@/components/nav";
import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: {
    default: "AI Engineer Path: from full-stack dev to AI engineer",
    template: "%s · AI Engineer Path",
  },
  description:
    "A curated, phase-by-phase AI engineering curriculum: LLMs, prompting, embeddings, RAG, agents, multimodal and production, with the best free resources and progress tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} h-full antialiased`}>
      <body className="noise flex min-h-full flex-col">
        <ProgressProvider>
          <Background />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
