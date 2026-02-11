const getDayOfWeek = (dateStr) => {
  return ["SUN","MON","TUE","WED","THU","FRI","SAT"][
    new Date(dateStr).getDay()
  ];
};

module.exports = {
  getDayOfWeek
};