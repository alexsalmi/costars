import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Provider as StoreProvider } from 'jotai'
import { Quicksand } from 'next/font/google';
import "@/styles/resets.scss";
import "@/styles/variables.scss";
import "@/styles/global.scss";
import ThemeProvider from "@/components/layouts/theme-provider";
import BootstrapData from "@/components/layouts/bootstrap-data";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AppRouterCacheProvider>
            <StoreProvider>
              <BootstrapData>
                {children}
              </BootstrapData>
            </StoreProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
