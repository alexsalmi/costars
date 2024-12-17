import Image from 'next/image';
import logo from '@/../public/costars_primary_logo.png';
import Link from 'next/link';
import { AccountCircleOutlined, HelpOutlineOutlined, DarkModeOutlined, CalendarMonthOutlined } from '@mui/icons-material';
import CSButton from '@/components/inputs/button';

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
				<div className='header-nav'>
					<CSButton secondary>
						<DarkModeOutlined />
					</CSButton>
					<CSButton secondary>
						<HelpOutlineOutlined />
					</CSButton>
					<CSButton secondary>
						<CalendarMonthOutlined />
					</CSButton>
					<CSButton secondary>
						<AccountCircleOutlined />
					</CSButton>
				</div>
    </header>
  );
}
