import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Deep Ocean Intelligence Archive — The 95% Never Seen",
  description: "An immersive deep-sea exploration platform. Dive through the ocean's depth zones, discover unknown species, and experience the crushing beauty of the abyss.",
  keywords: ["deep ocean", "marine biology", "ocean exploration", "bioluminescence", "abyssal zone", "marine conservation"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased"
        style={{
          background: '#050A0E',
          color: '#fff',
          fontFamily: "'Space Mono', monospace",
          overflowX: 'hidden',
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
