import { FilterContext } from '@/utils/filters-provider';
import { useContext, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function FilterDates() {
  const context = useContext(FilterContext);
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate()
    )
  );
  const [endDate, setEndDate] = useState<Date>(currentDate);

  if (!context) {
    throw new Error('Header must be used within a FilterProvider');
  }

  const { filters, setFilters } = context;

  useEffect(() => {
    if (startDate && endDate) {
      setFilters({
        ...filters,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });
    }
  }, [startDate, endDate]);

  return (
    <DatePicker
      selected={startDate}
      onChange={(dates: [Date, Date]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
      }}
      className={startDate && endDate ? 'has-value' : ''}
      selectsStart
      startDate={startDate}
      endDate={endDate}
      dateFormat="MM/yyyy"
      showMonthYearPicker
      selectsRange
    />
  );
}
