import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BitBio — Computational Biology & ML Learning Platform",
  description: "Gamified, pixel-art-driven learning from cells to AlphaFold. Free, forever.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: '#000', overflowX: 'hidden' }} className="text-gray-200 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
