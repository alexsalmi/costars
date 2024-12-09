import Image from 'next/image';
import CSButton from "@/components/inputs/button";
import logo from '@/../public/costars_primary_logo.png';
import '@/styles/pages/home.scss';
import Link from 'next/link';
import { getDailyCostars } from '@/services/cache.service';
import CSDailyCostars from '@/components/presentation/daily-costars';

interface IHomeProps {
  placeholder: boolean
}

export default async function Home({placeholder}: IHomeProps) {
  const { target, starter } = placeholder ? 
    {target: {} as GameEntity, starter: {} as GameEntity} :
    await getDailyCostars();

  return (
    <div className="home-page">
      <Image
        src={logo}
        alt="Costars logo"
        height={80}
      />
      <CSDailyCostars starter={starter} target={target}/>
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
