/**
 * Formats repeat value to human-readable format
 * @param {string} repeat - The repeat value ('day', 'week', 'month', 'year')
 * @returns {string} - Formatted repeat text
 */
export const formatRepeatText = (repeat) => {
  switch(repeat) {
    case 'day':
      return "Daily";
    case 'week':
      return "Weekly";
    case 'month':
      return "Monthly";
    case 'year':
      return "Yearly";
    default: 
      return "None";
  }
};