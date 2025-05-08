interface WeekDate {
  display: string;
  iso: string;
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
