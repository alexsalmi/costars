'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { SyntheticEvent, useRef, useState } from "react";
import { search, isMatch } from '@/services/tmdb.service';
import useGameState from '@/store/game.state';
import { debounce } from '@/services/utils';

export default function CSSearchBar() {
	const { history, current, addEntity } = useGameState();
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([] as GameEntity[]);
	const inputRef = useRef(null as HTMLElement | null);

	const debouncedSearch = debounce(async (query: string, type: TmdbType) => {
		if(query === '')
			return;

		const res = await search(query, type);

		setOptions(res);
	}, 300);

	const onType = (e: SyntheticEvent, value: string) => {
		if(!value) setOptions([]);

		debouncedSearch(value || '', current?.type === 'person' ? 'movie' : 'person')
	}

	const submit = async (value: GameEntity | string | null) => {
		if (!value) return;
		if (typeof value === 'string')
			value = options[0];

		setValue('');

		const match = await isMatch(value, current);

		if (match)
			addEntity(value);

		inputRef.current?.querySelector("input")?.focus();
	}

  return (
		<div className={`search-bar-container ${options.length > 0 ? 'open' : ''}`}>
			<SearchOutlined className='search-bar-icon'/>
			<Autocomplete className="search-bar-input"
				ref={inputRef}
				freeSolo
				blurOnSelect
				selectOnFocus
				clearOnBlur
				handleHomeEndKeys
				value={value}
				options={options}
				onInputChange={onType}
				onChange={async (e, value) => 
					submit(value)
				}
				renderInput={(params) =>
					<TextField {...params} placeholder='Search...' />
				}
				getOptionDisabled={(option) =>
					history.find(entity => 
						entity.type === option.type &&
						entity.id === option.id
					) !== undefined
				}
			/>
		</div>
  );
}
