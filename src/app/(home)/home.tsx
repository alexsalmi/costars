import Image from 'next/image';
import CSButton from "@/components/inputs/button";
import logo from '@/../public/costars_primary_logo.png';
import '@/styles/pages/home.scss';
import Link from 'next/link';
import CSDailyCostars from '@/components/presentation/daily-costars';

interface IHomeProps {
	daily: DailyCostars
}

export default async function Home({ daily }: IHomeProps) {
  return (
    <div className="home-page">
      <Image
        src={logo}
        alt="Costars logo"
        height={80}
      />
      <CSDailyCostars daily={daily} />
      <div className='home-page-button-container'>
        <Link href="/custom">
          <CSButton secondary>
            Custom Game
          </CSButton>
        </Link>
        <Link href="/unlimited">
          <CSButton secondary>
            Unlimited
          </CSButton>
        </Link>
      </div>
    </div>
  );
}
