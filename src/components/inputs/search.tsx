'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { useState } from "react";
import { search, isMatch } from '@/services/tmdb.service';
import useGameState from '@/store/game.state';
import { debounce } from '@/services/utils';

export default function CSSearchBar() {
	const { current, addEntity } = useGameState();
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([] as GameEntity[]);

	const debouncedSearch = debounce(async (query: string, type: TmdbType) => {
		const res = await search(query, type);

		if(res)
			setOptions(res);
	}, 300);

	const submit = async (value: GameEntity) => {
		if (!value) return;

		setValue('');

		const match = await isMatch(value, current);

		if (match)
			addEntity(value);
	}
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
				onInputChange={(e, value) =>
					debouncedSearch(value || '', current?.type === 'person' ? 'movie' : 'person')
				}
				onChange={async (e, value) => 
					submit(value as GameEntity)
				}
				renderInput={(params) =>
					<TextField {...params} placeholder='Search...' />
				}
			/>
		</div>
  );
}
