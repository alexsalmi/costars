import '@/styles/presentation/daily-costars.scss';
import CSEntityImage from './entity-image';
import { getTodaysCostars } from '@/services/cache.service';
import CSPlayButton from '../inputs/buttons/play-button';

export default async function CSDailyCostars() {
  const daily = await getTodaysCostars();
  if (!daily) throw Error("Couldn't get Costars");

  return (
    <div className='daily-costars-container'>
      <h3 className='daily-costars-header'>Daily Costars</h3>
      <div className='daily-costars-previews'>
        <CSEntityImage entity={daily?.starter} />
        <div className='daily-costars-names'>
          <span>{daily?.starter.label}</span>
          <span>to</span>
          <span>{daily?.target.label}</span>
        </div>
        <CSEntityImage entity={daily?.target} />
      </div>
      <CSPlayButton daily={daily} />
    </div>
  );
}
