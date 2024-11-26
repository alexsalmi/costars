'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { useState } from "react";
import { search, submit } from '@/services/tmdb.service';
import { debounce } from '@/services/utils';

interface ICSSearchBarProps {
	current: GameEntity | undefined,
	add: (guess: GameEntity) => void
}

export default function CSSearchBar({ current, add }: ICSSearchBarProps) {
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([] as GameEntity[]);

	const debouncedSearch = debounce(async (query: string, type: TmdbType) => {
		const res = await search(query, type);

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
				value={value}
				options={options}
				onInputChange={(e, value) => debouncedSearch(value || '', current?.type === 'person' ? 'movie' : 'person')}
				onChange={async (e, value) => {
					setValue('');
					if (await submit(value as GameEntity, current))
						add(value as GameEntity)

				}}
				renderInput={(params) => <TextField {...params}/>}
			/>
		</div>
  );
}
