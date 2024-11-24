'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { SyntheticEvent, useState } from "react";
import { search } from '@/services/tmdbService';

interface ICSSearchBarProps {
	value: string,
}

export default function CSSearchBar({}: ICSSearchBarProps) {
	const [value, setValue] = useState('');


  return (
		<div className='search-bar-container'>
			<SearchOutlined className='search-bar-icon'/>
			<Autocomplete className="search-bar-input"
				freeSolo
				blurOnSelect
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				options={['a', 'ab', 'abc']}
				inputValue={value}
				onInputChange={(event: SyntheticEvent, newValue: string | null) => {
          setValue(newValue || '');
        }}
				onChange={(e, value) => search(value || '', 'person')}
				renderInput={(params) => <TextField {...params}/>}
			/>
		</div>
  );
}
