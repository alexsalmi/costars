import Image from 'next/image';
import logo from '@/../public/costars_primary_logo.png';
import Menu from './menu';

interface IHeaderProps {
	showLogo?: boolean
}

export default function Header({ showLogo }: IHeaderProps) {
  return (
    <header>
				{showLogo ? 
					<Image
						src={logo}
						alt="Costars logo"
						height={32}
					/> : <></>
				}
				<Menu />
    </header>
  );
}
