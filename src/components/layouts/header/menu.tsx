'use client'
import { useEffect, useState } from 'react';
import Switch from '@mui/material/Switch';
import { MenuOutlined } from '@mui/icons-material';

let initialValue = true;

export default function Menu() {
	const [open, setOpen] = useState(false);
	const [toggle, setToggle] = useState(true);

	useEffect(() => {
		initialValue = !document.querySelector('html')?.hasAttribute('data-light-mode');

		setToggle(initialValue);

		document.querySelector('html')?.toggleAttribute('data-light-mode', !initialValue);
	}, []);

	const toggleTheme = () => {
		setToggle(!toggle);
		document.querySelector('html')?.toggleAttribute('data-light-mode');
	}

  return (
		<div className='header-menu-container'
			onBlur={() => setOpen(false)}
		>
			<button className={`header-menu-button ${open ? 'header-menu-open' : ''}`}
				onClick={() => setOpen(!open)}
			>
				<MenuOutlined className='header-menu-icon'/>
			</button>
			<menu className={`header-menu ${open ? 'header-menu-open' : ''}`}>
				<span className='header-menu-item'>
					<Switch value={toggle} onClick={() => setOpen(true)} onChange={toggleTheme} defaultChecked={initialValue}/>
					Dark mode
				</span>
			</menu>
		</div>
  );
}