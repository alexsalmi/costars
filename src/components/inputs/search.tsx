'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { useState } from "react";
import { search } from '@/services/tmdbService';
import { debounce } from '@/services/utils';

interface ICSSearchBarProps {
	value: string,
}

export default function CSSearchBar({}: ICSSearchBarProps) {
	const [options, setOptions] = useState([]);

	const debouncedSearch = debounce(async (query: string) => {
		const res = await search(query, 'person');

		if(res)
			setOptions(res);
	}, 300);

  return (
		<div className='search-bar-container'>
			<SearchOutlined className='search-bar-icon'/>
			<Autocomplete className="search-bar-input"
				freeSolo
				blurOnSelect
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				options={options}
				onInputChange={(e, value) => debouncedSearch(value || '')}
				onChange={(e, value) => search(value || '', 'person')}
				renderInput={(params) => <TextField {...params}/>}
			/>
		</div>
  );
}
