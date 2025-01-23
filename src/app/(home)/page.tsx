import logo from '@/../public/costars_primary_logo.png';
import Image from 'next/image';
import Link from 'next/link';
import CSButton from '@/components/inputs/buttons/button';
import '@/styles/pages/home.scss';
import { Suspense } from 'react';
import CSDailyCostarsSkeleton from '@/components/skeletons/daily-costars-skeleton';
import CSDailyCostars from '@/components/presentation/daily-costars';

export default async function Home() {
  return (
    <div className='home-page'>
      <Image priority src={logo} alt='Costars logo' height={80} />
      <Suspense fallback={<CSDailyCostarsSkeleton />}>
        <CSDailyCostars />
      </Suspense>
      <div className='home-page-button-container'>
        <Link href='/custom'>
          <CSButton secondary>Custom Game</CSButton>
        </Link>
        <Link href='/unlimited'>
          <CSButton secondary>Unlimited</CSButton>
        </Link>
      </div>
    </div>
  );
}

export const experimental_ppr = true;
