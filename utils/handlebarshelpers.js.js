module.exports = {
    format_time: (date) => {
      return date.toLocaleTimeString();
    },
    format_date: (date) => {
      return date.toLocaleDateString();
    },
    format_datetime: (date) => {
        return date.toLocaleTimeString()+" on "+ date.toLocaleDateString();
      }
  };
  