import { getFormattedDateString } from '@/utils/utils';
import CSModal from './modal';
import CSButton from '../inputs/buttons/button';
import Link from 'next/link';
import '@/styles/modals/spoiler-alert-modal.scss';

interface ICSSpoilerAlertModal {
  isOpen: boolean;
  close: () => void;
  daily?: DailyCostars;
}

export default function CSSpoilerAlertModal({
  isOpen,
  close,
  daily,
}: ICSSpoilerAlertModal) {
  if (!daily) return <></>;

  return (
    <CSModal isOpen={isOpen} className='spoiler-alert-modal'>
      <h3>Spoiler Alert!</h3>
      <span>
        This solution is for{' '}
        <strong>
          Daily Costars #{daily!.day_number} (
          {getFormattedDateString(daily!.date)})
        </strong>
        , which you haven&apos;t completed yet.
      </span>
      <Link href={`/daily/${daily?.day_number}`}>
        <CSButton>
          Play Daily Costars #{daily!.day_number} (
          {getFormattedDateString(daily!.date)})
        </CSButton>
      </Link>
      <CSButton secondary onClick={close}>
        View Solution Anyway
      </CSButton>
    </CSModal>
  );
}
