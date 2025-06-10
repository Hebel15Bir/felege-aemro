export const todayEthCalendar = () => {
  const today = new Date();
  const months = [
    'መስከረም',
    'ጥቅምት',
    'ኅዳር',
    'ታኅሣሥ',
    'ጥር',
    'የካቲት',
    'መጋቢት',
    'ሚያዝያ',
    'ግንቦት',
    'ሠኔ',
    'ሐምሌ',
    'ነሐሴ',
    'ጳጉሜን',
  ];

  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  const isLeapYear = year % 4 === 0;
  const newYearDate = isLeapYear ? 12 : 11;
  const newYearYear = month < 8 && date < newYearDate ? year - 1 : year;

  const ethNewYear = new Date(newYearYear, 8, newYearDate);

  const daysSinceNewYear = Math.floor(
    (today.getTime() - ethNewYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  const ethMonth = Math.floor(daysSinceNewYear / 30);
  const ethDay = daysSinceNewYear % 30;
  const ethYear = newYearYear - 7;

  return {
    year: ethYear,
    month: months[ethMonth],
    date: ethDay,
  };
};
