'use client'
import { useEffect, useState } from 'react';
import { Switch } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export default function Menu() {
	const [open, setOpen] = useState(false);
	const [toggle, setToggle] = useState(true);

	useEffect(() => {
		setToggle(!document.querySelector('html')?.hasAttribute('data-light-mode'));
	}, []);

	const toggleTheme = () => {
		setToggle(!toggle);
		document.querySelector('html')?.toggleAttribute('data-light-mode');
	}

  return (
		<div className='header-menu-container'>
			<button className={`header-menu-button ${open ? 'header-menu-open' : ''}`}
				onClick={() => setOpen(!open)}
			>
				<MenuOutlined className='header-menu-icon'/>
			</button>
			<menu className={`header-menu ${open ? 'header-menu-open' : ''}`}>
				<span className='header-menu-item'>
					<Switch value={toggle} onChange={toggleTheme} />
					Dark mode
				</span>
				<span>Test</span>
			</menu>
		</div>
  );
}