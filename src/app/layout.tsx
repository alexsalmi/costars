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
  description:
    "Your favorite movie trivia game! Connect pairs of actors by the movies they've starred in and the costars they've worked with. Come back every day for the new pair of Daily Costars!",
  keywords:
    'costars, game, costarsgame, trivia, movie, movies, actor, actors, costar, co star, co stars, co-star, co-stars, daily, challenge',
  authors: { name: 'Alex Salmi', url: 'https://asalmi.com' },
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
          customDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          selfHosted
          trackOutboundLinks
          taggedEvents
          enabled
        />
      </head>
      <body className='app'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <AppRouterCacheProvider>
            <StoreProvider>
              <InitStateProvider>
                <div>
                  {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
                </div>
                {children}
                </InitStateProvider>
            </StoreProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
