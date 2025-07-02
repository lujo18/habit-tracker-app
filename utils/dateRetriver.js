import { dateToSQL } from "../db/sqliteManager";

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

export const formatChartData = async (data, timeframe, repeat) => {
  let currentGoal = data[0].goal;

  const endDate = new Date()
  const startDate = new Date(new Date().setDate(endDate.getDate() - timeframe + 1))

  console.log("STRAT", startDate)

  const dates = generateDates(startDate, endDate)

  const chartDataPromises = dates.map(async (date, index) => {
    const filterDate = data.filter((value) => {
      const d = new Date(value.date)

      return (
        d.getUTCDate() === date.getUTCDate() &&
        d.getUTCMonth() === date.getUTCMonth() &&
        d.getUTCFullYear() === date.getUTCFullYear()
      )
    })

    if (filterDate[0]) {
      currentGoal = filterDate[0].goal
      return filterDate[0]
    }
    else {
      date = new Date(date)
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`

      const periodKey = await getPeriodKey(repeat, formattedDate)

      return {completionCount: 0, date: formattedDate, periodKey /*, currentGoal -- might need for fill in data when adding dynamic habit*/}
    }
  })

  const chartData = await Promise.all(chartDataPromises)
  console.log(chartData)
  return chartData
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

const getPeriodKey = async (repeat, date = Date.now()) => {
  if (!repeat) {return null}

  let periodKeyDate = new Date(date);
  switch (repeat) {
    case "day": 
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "week":
      periodKeyDate.setDate(periodKeyDate.getDate() - periodKeyDate.getDay())
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "month":
      periodKeyDate.setDate(1);
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    case "year":
      periodKeyDate.setMonth(0, 1);
      periodKeyDate = await dateToSQL(periodKeyDate);
      return periodKeyDate;
    default:
      console.error("Invalid repeat type")
      return null;
  }
}


export const getPeriodData = (filledData) => {
  
  const periodData = filledData.reduce((acc, curr) => {
    if (!curr.periodKey) return acc; // skip if no periodKey
    if (!acc[curr.periodKey]) {
      acc[curr.periodKey] = {
        date: curr.periodKey,
        completionCount: 0,
        goal: curr.goal || 0,
        streak: curr.streak
      };
    }
    acc[curr.periodKey].completionCount += curr.completionCount || 0;
    // If goal is missing, update it if found
    if (!acc[curr.periodKey].goal && curr.goal) {
      acc[curr.periodKey].goal = curr.goal;
    }
    return acc;
  }, {});



  // Convert object to array
  const periodDataArray = Object.values(periodData);

  return periodDataArray
}