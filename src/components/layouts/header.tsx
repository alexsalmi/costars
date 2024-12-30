import Image from 'next/image';
import logo from '@/../public/costars_primary_logo.png';
import Link from 'next/link';
import CSNavMenu from './nav-menu';

interface IHeaderProps {
	showLogo?: boolean
}

export default function Header({ showLogo }: IHeaderProps) {
  return (
    <header>
				{showLogo ?
					<Link href="/">
						<Image
							priority
							src={logo}
							alt="Costars logo"
							height={32}
						/>
					</Link> : <></>
				}
				<CSNavMenu />
    </header>
  );
}
