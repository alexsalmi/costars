'use client'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import '@/styles/components/search.scss'
import { SearchOutlined} from '@mui/icons-material';
import { SyntheticEvent, useRef, useState } from "react";
import { search } from '@/services/tmdb.service';
import useGameState from '@/store/game.state';
import debounce from 'debounce';

interface ICSSearchBar {
	onSubmit: (value: GameEntity) => void
}

export default function CSSearchBar({ onSubmit } : ICSSearchBar) {
	const { history, current } = useGameState();
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([] as GameEntity[]);
	const [error, setError] = useState(false);
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
		// If the user didn't select one of the autocomplete options, take the first one
		if (typeof value === 'string')
			value = options[0];

		if (!value) return;

		setValue('');

		try {
			onSubmit(value);
		}
		catch {
			setError(true);
			setTimeout(() => setError(false), 1000);
		}

		inputRef.current?.querySelector("input")?.focus();
	};
	

  return (
		<div className={`
			search-bar-container
			${options.length > 0 ? 'open ' : ''}
			${error ? 'incorrect' : ''}
		`}>
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
				filterOptions={options => options}
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
