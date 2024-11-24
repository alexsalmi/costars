import CSSearchBar from '@/components/inputs/search';
import CSCardTrack from '@/components/presentation/cardTrack';
import CSTextDisplay from '@/components/presentation/display';
import '@/styles/pages/unlimited.scss';

const content = [
	{
		label: 'Jennifer Lawrence',
		image: 'https://image.tmdb.org/t/p/w500/k6CsASaySnS3ag0Y2Ns2vqPahVn.jpg'
	},
	{
		label: 'Movie',
		image: 'https://image.tmdb.org/t/p/w500/k6CsASaySnS3ag0Y2Ns2vqPahVn.jpg',
		movie: true
	}
]

export default function UnlimitedGame() {
  return (
    <div className='unlimited-page'>
			<CSSearchBar value=''></CSSearchBar>
			<div className='unlimited-page-scores'>
				<CSTextDisplay>
					Current Score: 1
				</CSTextDisplay>
				<CSTextDisplay>
					High Score: 1
				</CSTextDisplay>
			</div>
			<CSCardTrack values={content} prompt='What else has Jennifer Lawrence been in?'/>

    </div>
  );
}
