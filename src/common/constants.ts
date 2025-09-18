export default {
  LEAGUE_ID: 92863,
  DB_PATH: "./fantasy.sqlite",
  WEEKS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  SEASON: 2025,
  WEEK: 2,
  PROG_ARGS: {
    load: {
      func: {
        index: 2,
        vals: {
          loadWeekly: "WEEK",
        },
      },
      season: {
        index: 3,
      },
      week: {
        index: 4,
      },
    },
    show: {
      week: {
        index: 2,
      },
    },
  },
};
