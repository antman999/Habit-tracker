import { parseISO, differenceInDays } from "date-fns";
interface WeekDate {
  display: string;
  iso: string;
}

interface DateGroup {
  single: Date[];
  start: Date[];
  middle: Date[];
  end: Date[];
}

function getDateSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentWeekDatesFormatted(): WeekDate[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates: WeekDate[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDayDate = new Date(startOfWeek);
    currentDayDate.setDate(startOfWeek.getDate() + i);

    const dayNumber = currentDayDate.getDate();
    const suffix = getDateSuffix(dayNumber);
    const dayName = currentDayDate.toLocaleDateString("en-US", {
      weekday: "narrow",
    });
    const monthName = currentDayDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const formattedDisplay = `${dayName}, ${monthName} ${dayNumber}${suffix}`;
    const formattedIso = formatIsoDate(currentDayDate);
    weekDates.push({ display: formattedDisplay, iso: formattedIso });
  }

  return weekDates;
}

export function groupConsecutiveDates(isoDates: string[]): DateGroup {
  if (!isoDates || isoDates.length === 0) {
    return { single: [], start: [], middle: [], end: [] };
  }
  const dates = isoDates
    .map((iso) => parseISO(iso))
    .sort((a, b) => a.getTime() - b.getTime());
  const groups: DateGroup = { single: [], start: [], middle: [], end: [] };
  if (dates.length === 0) return groups;
  let currentRange: Date[] = [dates[0]];
  for (let i = 1; i < dates.length; i++) {
    if (differenceInDays(dates[i], dates[i - 1]) === 1) {
      currentRange.push(dates[i]);
    } else {
      processRange(currentRange, groups);
      currentRange = [dates[i]];
    }
  }
  processRange(currentRange, groups);
  return groups;
}

export function processRange(range: Date[], groups: DateGroup) {
  if (range.length === 1) {
    groups.single.push(range[0]);
  } else if (range.length > 1) {
    groups.start.push(range[0]);
    groups.end.push(range[range.length - 1]);
    for (let j = 1; j < range.length - 1; j++) {
      groups.middle.push(range[j]);
    }
  }
}
