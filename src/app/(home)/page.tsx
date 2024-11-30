import Image from 'next/image';
import CSButton from "@/components/inputs/button";
import logo from '@/../public/costars_primary_logo.png';
import '@/styles/pages/home.scss';
import Link from 'next/link';
import { getDaily } from '@/services/scheduler.service';

export default async function Home() {
  const { target, starter } = await getDaily();

  return (
    <div className="home-page">
      <Image
        src={logo}
        alt="Costars logo"
        height={80}
      />

      <div className='home-page-daily-container'>
        <h3>Daily Costars:</h3>
        <div className='home-page-daily-previews'>
          <span>
            <Image src={`https://image.tmdb.org/t/p/w185${starter.profile_path}`}
              width={80} height={120} alt={`Image of ${starter.name}`}
            />
            <span>{starter.name}</span>
          </span>
          <span>
            <Image src={`https://image.tmdb.org/t/p/w185${target.profile_path}`}
              width={80} height={120} alt={`Image of ${target.name}`}
            />
            <span>{target.name}</span>
          </span>
        </div>
        <Link href="/daily">
          <CSButton>
            Play!
          </CSButton>
        </Link>
      </div>

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
