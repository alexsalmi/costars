'use client'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import '@/styles/pages/archive.scss'

export default function CSArchive() {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="archive-container">
        <h3>Archive</h3>
        <span>Select any day in the calendar to match an old pair of daily costars!</span>
        
        <DateCalendar
          className='archive-calendar'
        />
      </div>
    </LocalizationProvider>
  )
}