import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Provider as StoreProvider } from 'jotai';
import { Quicksand } from 'next/font/google';
import '@/styles/resets.scss';
import '@/styles/variables.scss';
import '@/styles/global.scss';
import ThemeProvider from '@/components/layouts/providers/theme-provider';
import InitStateProvider from '@/components/layouts/providers/init-state-provider';

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Costars',
  description: 'Your favorite movie trivia game!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={quicksand.className}>
      <head>
        <PlausibleProvider
          domain='costarsgame.com'
          trackOutboundLinks
          taggedEvents
        />
      </head>
      <body className='app'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AppRouterCacheProvider>
            <StoreProvider>
              <InitStateProvider>{children}</InitStateProvider>
            </StoreProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
