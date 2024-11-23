import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Quicksand } from 'next/font/google';
import "@/styles/resets.scss";
import "@/styles/variables.scss";
import "@/styles/global.scss";

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Costars",
  description: "Your favorite movie trivia game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.className}>
      <body className="app">
        <AntdRegistry>
          {children}
        </AntdRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
