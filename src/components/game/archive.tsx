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
import { StarBorderOutlined, Star } from '@mui/icons-material';
import { getDailyCostarsByMonth } from '@/services/cache.service';
import { getUserDailySolutions } from '@/services/userdata.service';
import '@/styles/game/archive.scss';
import CSBackButton from '../inputs/buttons/back-button';

interface IPrevResults {
  score: number;
  hints: number;
  date: string;
}

interface ICSArchiveProps {
  costars: Array<DailyCostars>;
}

export default function CSArchive({ costars }: ICSArchiveProps) {
  const [prevResults, setPrevResults] = useState<Array<IPrevResults>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrevResults(costars);
    setLoading(false);
  }, []);

  const handleMonthChange = async (date: Dayjs) => {
    setLoading(true);
    const costars =
      (await getDailyCostarsByMonth(date.month() + 1, date.year())) || [];

    getPrevResults(costars);
    setLoading(false);
  };

  const getPrevResults = (costars: Array<DailyCostars>) => {
    const userDailySolutions = getUserDailySolutions();

    const results =
      userDailySolutions
        ?.filter((sol) => costars.some((c) => c.id === sol.daily_id))
        .map((res) => ({
          score: res.solution.reduce(
            (acc, curr) => acc + (curr.type === 'movie' ? 1 : 0),
            0,
          ),
          hints:
            res.hints?.reduce(
              (acc, curr) =>
                acc +
                (res.solution.some((entity) => entity.id === curr.id) ? 1 : 0),
              0,
            ) || 0,
          date: costars.find((c) => c.id === res.daily_id)!.date,
        })) || [];

    setPrevResults(results);
  };

  const selectDate = (
    date: Dayjs | null,
    selectionState?: PickerSelectionState,
    selectedView?: DateView,
  ) => {
    if (!date || selectedView !== 'day') return;

    if (date.isSame(dayjs(), 'date')) redirect('/daily', RedirectType.push);

    const day_number = getDayNumber(date.toISOString());

    redirect(`/daily/${day_number}`, RedirectType.push);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='archive-container'>
        <CSBackButton />
        <h3>Archive</h3>
        <span>
          Select any day in the calendar to match an old pair of daily costars!
        </span>

        <DateCalendar
          className='archive-calendar'
          views={
            dayjs().year() > 2025
              ? ['day', 'year', 'month']
              : dayjs().month() > 0
                ? ['day', 'month']
                : ['day']
          }
          onChange={selectDate}
          onMonthChange={handleMonthChange}
          minDate={dayjs('01/01/2025')}
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

        <span className='archive-legend'>
          <span className={`archive-day-icon completed`}>
            <Star />
          </span>
          <span>= Perfect Game</span>
          <div style={{ width: '20px' }}></div>
          <span className={`archive-day-icon completed`}>
            <StarBorderOutlined />
          </span>
          <span>= Completed</span>
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

  const hints =
    (!props.outsideCurrentMonth &&
      prevResults.find((sol) => dayjs(sol.date).isSame(day))?.hints) ||
    0;

  return (
    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day}>
      <div className={`archive-day-icon ${score ? 'completed' : ''}`}>
        {score === 2 && hints === 0 ? (
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
