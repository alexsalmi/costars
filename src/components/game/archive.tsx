'use client';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { getDayNumber } from '@/utils/utils';
import { redirect, RedirectType } from 'next/navigation';
import {
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers/PickersDay/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { useEffect, useState } from 'react';
import { PickerSelectionState } from '@mui/x-date-pickers/internals';
import { DateView } from '@mui/x-date-pickers/models';
import useGameState from '@/store/game.state';
import { StarBorderOutlined, Star } from '@mui/icons-material';
import { getDailyCostarsByMonth } from '@/services/cache.service';
import '@/styles/pages/archive.scss';

interface IPrevResults {
  score: number;
  date: string;
}

export default function CSArchive() {
  const { userDailySolutions } = useGameState();
  const [prevResults, setPrevResults] = useState<Array<IPrevResults>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrevResults(dayjs());
  }, [userDailySolutions]);

  const getPrevResults = async (date: Dayjs) => {
    if (!userDailySolutions) return;

    setLoading(true);
    const costars =
      (await getDailyCostarsByMonth(date.month() + 1, date.year())) || [];

    const results =
      userDailySolutions
        ?.filter((sol) => costars.some((c) => c.id === sol.daily_id))
        .map((res) => ({
          score: res.solution.reduce(
            (acc, curr) => acc + (curr.type === 'movie' ? 1 : 0),
            0,
          ),
          date: costars.find((c) => c.id === res.daily_id)!.date,
        })) || [];

    setPrevResults(results);
    setLoading(false);
  };

  const selectDate = (
    date: Dayjs | null,
    selectionState?: PickerSelectionState,
    selectedView?: DateView,
  ) => {
    if (!date || selectedView !== 'day') return;

    if (date && date.isSame(dayjs(), 'date'))
      redirect('/daily', RedirectType.push);

    const day_number = getDayNumber(date.toISOString());

    redirect(`/daily/${day_number}`, RedirectType.push);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='archive-container'>
        <h3>Archive</h3>
        <span>
          Select any day in the calendar to match an old pair of daily costars!
        </span>

        <DateCalendar
          className='archive-calendar'
          views={dayjs().year() > 2024 ? ['day', 'year'] : ['day', 'month']}
          onChange={selectDate}
          onMonthChange={getPrevResults}
          minDate={dayjs('12/15/2024')}
          maxDate={dayjs()}
          loading={loading}
          disableHighlightToday
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: DayIcon,
          }}
          slotProps={{
            day: {
              prevResults,
            } as PickersDayProps<Dayjs> & { prevResults: Array<IPrevResults> },
          }}
        />

        <span>
          <Star /> = Perfect Game
          <StarBorderOutlined /> = Completed
        </span>
      </div>
    </LocalizationProvider>
  );
}

function DayIcon(
  props: PickersDayProps<Dayjs> & { prevResults?: Array<IPrevResults> },
) {
  const { prevResults = [], day, outsideCurrentMonth, ...other } = props;

  const score =
    (!props.outsideCurrentMonth &&
      prevResults.find((sol) => dayjs(sol.date).isSame(day))?.score) ||
    0;

  return (
    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day}>
      <div className={`archive-day-icon ${score ? 'completed' : ''}`}>
        {score === 2 ? (
          <Star />
        ) : score ? (
          <StarBorderOutlined />
        ) : (
          <span>{day.date()}</span>
        )}
      </div>
    </PickersDay>
  );
}
