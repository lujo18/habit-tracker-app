export const generateDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
}


export const getMonthName = (monthNumber) => {
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  if (monthNumber >= 0 && monthNumber <= 11) {
    return monthNames[monthNumber];
  } else {
    return "Invalid month number";
  }
}