import Image from 'next/image';
import logo from '@/../public/costars_primary_logo.png';
import Menu from './menu';
import Link from 'next/link';

interface IHeaderProps {
	showLogo?: boolean
}

export default function Header({ showLogo }: IHeaderProps) {
  return (
    <header>
				{showLogo ?
					<Link href="/">
						<Image
							src={logo}
							alt="Costars logo"
							height={32}
						/>
					</Link> : <></>
				}
				<Menu />
    </header>
  );
}
