import nflData from '@camfleety/nfl-data-js';

// Import weekly player stats
// const weeklyData = await nflData.importWeeklyData([2023]);

// Import team information  
// const teams = await nflData.importTeamDesc();

// const test = await nflData.importWeeklyData([2026]);
const test = await nflData.importWeeklyData([2025]);

const arodStats = test.filter(item => {
    return item.player_id === "00-0023459"
})
.map(item => {
    return {
        ptd: item.passing_tds,
        pyds: item.passing_yards,
        ints: item.interceptions,
        tpts: item.passing_2pt_conversions
    }
});

console.log(JSON.stringify(arodStats));