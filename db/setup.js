import sqlite3 from "sqlite3";
import constants from "../constants.js";

let db = new sqlite3.Database(constants.DB_PATH, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Connected to ${constants.DB_PATH}.`);
});

db.serialize(() => {
  //draft board
  db.run(`
    CREATE TABLE IF NOT EXISTS draft_board (
    draft_position INTEGER PRIMARY KEY,
    round INTEGER,
    pick INTEGER,
    player_id INTEGER,
    team_id INTEGER
    );
  `);

  //teams
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      season INTEGER,
      name text,
      points_for INTEGER,
      points_against INTEGER
    );
  `);

  //games
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      season INTEGER,
      week INTEGER,
      away_team INTEGER,
      home_team INTEGER,
      away_score REAL,
      home_score REAL
    );
  `);

  //players
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT,
      position TEXT,
      pro_team TEXT,
      sportradar_id
    );
  `);

  //player_performances
  db.run(`
    CREATE TABLE IF NOT EXISTS player_performances (
      game_id INTEGER,
      player_id INTEGER,
      team_id INTEGER,
      starter BOOLEAN,
      player_name TEXT,
      position TEXT,
      pro_team TEXT,
      points REAL,
      stats TEXT,
      PRIMARY KEY (game_id, player_id),
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
    );
  `);
});

//Manual Inserts
db.serialize(() => {
  db.run(`DELETE FROM draft_board`);
  db.run(`INSERT INTO draft_board VALUES(1,1,1,16250,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(2,1,2,17603,746602)`);
  db.run(`INSERT INTO draft_board VALUES(3,1,3,15523,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(4,1,4,15540,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(5,1,5,13778,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(6,1,6,12042,643439)`);
  db.run(`INSERT INTO draft_board VALUES(7,1,7,17612,643429)`);
  db.run(`INSERT INTO draft_board VALUES(8,1,8,16373,746639)`);
  db.run(`INSERT INTO draft_board VALUES(9,1,9,19247,643135)`);
  db.run(`INSERT INTO draft_board VALUES(10,1,10,12892,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(11,1,11,15604,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(12,1,12,14694,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(13,2,1,16834,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(14,2,2,18364,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(15,2,3,14673,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(16,2,4,18369,643135)`);
  db.run(`INSERT INTO draft_board VALUES(17,2,5,17779,746639)`);
  db.run(`INSERT INTO draft_board VALUES(18,2,6,16823,643429)`);
  db.run(`INSERT INTO draft_board VALUES(19,2,7,18361,643439)`);
  db.run(`INSERT INTO draft_board VALUES(20,2,8,16839,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(21,2,9,16281,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(22,2,10,17756,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(23,2,11,15585,746602)`);
  db.run(`INSERT INTO draft_board VALUES(24,2,12,17617,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(25,3,1,15532,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(26,3,2,13775,746602)`);
  db.run(`INSERT INTO draft_board VALUES(27,3,3,18479,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(28,3,4,16895,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(29,3,5,12197,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(30,3,6,18363,643439)`);
  db.run(`INSERT INTO draft_board VALUES(31,3,7,17004,643429)`);
  db.run(`INSERT INTO draft_board VALUES(32,3,8,18407,746639)`);
  db.run(`INSERT INTO draft_board VALUES(33,3,9,16890,643135)`);
  db.run(`INSERT INTO draft_board VALUES(34,3,10,10252,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(35,3,11,10295,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(36,3,12,16824,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(37,4,1,16882,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(38,4,2,13761,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(39,4,3,15581,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(40,4,4,18381,643135)`);
  db.run(`INSERT INTO draft_board VALUES(41,4,5,12965,746639)`);
  db.run(`INSERT INTO draft_board VALUES(42,4,6,12894,643429)`);
  db.run(`INSERT INTO draft_board VALUES(43,4,7,14759,643439)`);
  db.run(`INSERT INTO draft_board VALUES(44,4,8,18372,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(45,4,9,19248,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(46,4,10,17606,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(47,4,11,14706,746602)`);
  db.run(`INSERT INTO draft_board VALUES(48,4,12,14716,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(49,5,1,9360,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(50,5,2,13023,746602)`);
  db.run(`INSERT INTO draft_board VALUES(51,5,3,16798,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(52,5,4,16361,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(53,5,5,16859,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(54,5,6,14746,643439)`);
  db.run(`INSERT INTO draft_board VALUES(55,5,7,17681,643429)`);
  db.run(`INSERT INTO draft_board VALUES(56,5,8,17029,746639)`);
  db.run(`INSERT INTO draft_board VALUES(57,5,9,14677,643135)`);
  db.run(`INSERT INTO draft_board VALUES(58,5,10,12951,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(59,5,11,19290,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(60,5,12,13758,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(61,6,1,17595,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(62,6,2,13776,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(63,6,3,16830,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(64,6,4,18362,643135)`);
  db.run(`INSERT INTO draft_board VALUES(65,6,5,19272,746639)`);
  db.run(`INSERT INTO draft_board VALUES(66,6,6,13795,643429)`);
  db.run(`INSERT INTO draft_board VALUES(67,6,7,19242,643439)`);
  db.run(`INSERT INTO draft_board VALUES(68,6,8,19244,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(69,6,9,15601,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(70,6,10,12159,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(71,6,11,16253,746602)`);
  db.run(`INSERT INTO draft_board VALUES(72,6,12,13764,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(73,7,1,16236,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(74,7,2,13325,746602)`);
  db.run(`INSERT INTO draft_board VALUES(75,7,3,13111,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(76,7,4,17137,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(77,7,5,13829,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(78,7,6,19258,643439)`);
  db.run(`INSERT INTO draft_board VALUES(79,7,7,18534,643429)`);
  db.run(`INSERT INTO draft_board VALUES(80,7,8,12906,746639)`);
  db.run(`INSERT INTO draft_board VALUES(81,7,9,19300,643135)`);
  db.run(`INSERT INTO draft_board VALUES(82,7,10,17613,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(83,7,11,12975,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(84,7,12,16875,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(85,8,1,17633,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(86,8,2,14949,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(87,8,3,17167,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(88,8,4,14702,643135)`);
  db.run(`INSERT INTO draft_board VALUES(89,8,5,15516,746639)`);
  db.run(`INSERT INTO draft_board VALUES(90,8,6,15544,643429)`);
  db.run(`INSERT INTO draft_board VALUES(91,8,7,16241,643439)`);
  db.run(`INSERT INTO draft_board VALUES(92,8,8,12970,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(93,8,9,18384,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(94,8,10,12904,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(95,8,11,19261,746602)`);
  db.run(`INSERT INTO draft_board VALUES(96,8,12,16282,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(97,9,1,15751,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(98,9,2,16947,746602)`);
  db.run(`INSERT INTO draft_board VALUES(99,9,3,18377,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(100,9,4,17667,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(101,9,5,19361,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(102,9,6,2337,643439)`);
  db.run(`INSERT INTO draft_board VALUES(103,9,7,17674,643429)`);
  db.run(`INSERT INTO draft_board VALUES(104,9,8,11329,746639)`);
  db.run(`INSERT INTO draft_board VALUES(105,9,9,19266,643135)`);
  db.run(`INSERT INTO draft_board VALUES(106,9,10,17675,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(107,9,11,15555,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(108,9,12,16339,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(109,10,1,16933,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(110,10,2,18456,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(111,10,3,12926,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(112,10,4,19303,643135)`);
  db.run(`INSERT INTO draft_board VALUES(113,10,5,19509,746639)`);
  db.run(`INSERT INTO draft_board VALUES(114,10,6,17625,643429)`);
  db.run(`INSERT INTO draft_board VALUES(115,10,7,13802,643439)`);
  db.run(`INSERT INTO draft_board VALUES(116,10,8,18330,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(117,10,9,14664,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(118,10,10,18460,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(119,10,11,16974,746602)`);
  db.run(`INSERT INTO draft_board VALUES(120,10,12,17624,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(121,11,1,16927,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(122,11,2,15603,746602)`);
  db.run(`INSERT INTO draft_board VALUES(123,11,3,15658,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(124,11,4,17622,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(125,11,5,2351,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(126,11,6,16256,643439)`);
  db.run(`INSERT INTO draft_board VALUES(127,11,7,16248,643429)`);
  db.run(`INSERT INTO draft_board VALUES(128,11,8,15531,746639)`);
  db.run(`INSERT INTO draft_board VALUES(129,11,9,19267,643135)`);
  db.run(`INSERT INTO draft_board VALUES(130,11,10,18392,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(131,11,11,2352,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(132,11,12,17243,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(133,12,1,18442,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(134,12,2,18337,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(135,12,3,13813,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(136,12,4,19287,643135)`);
  db.run(`INSERT INTO draft_board VALUES(137,12,5,17585,746639)`);
  db.run(`INSERT INTO draft_board VALUES(138,12,6,2330,643429)`);
  db.run(`INSERT INTO draft_board VALUES(139,12,7,19243,643439)`);
  db.run(`INSERT INTO draft_board VALUES(140,12,8,12934,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(141,12,9,16246,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(142,12,10,17315,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(143,12,11,16993,746602)`);
  db.run(`INSERT INTO draft_board VALUES(144,12,12,9380,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(145,13,1,14767,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(146,13,2,13845,746602)`);
  db.run(`INSERT INTO draft_board VALUES(147,13,3,17626,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(148,13,4,13806,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(149,13,5,12102,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(150,13,6,6038,643439)`);
  db.run(`INSERT INTO draft_board VALUES(151,13,7,9376,643429)`);
  db.run(`INSERT INTO draft_board VALUES(152,13,8,19298,746639)`);
  db.run(`INSERT INTO draft_board VALUES(153,13,9,19421,643135)`);
  db.run(`INSERT INTO draft_board VALUES(154,13,10,2331,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(155,13,11,19335,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(156,13,12,12088,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(157,14,1,2345,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(158,14,2,13011,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(159,14,3,14661,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(160,14,4,2340,643135)`);
  db.run(`INSERT INTO draft_board VALUES(161,14,5,2338,746639)`);
  db.run(`INSERT INTO draft_board VALUES(162,14,6,19253,643429)`);
  db.run(`INSERT INTO draft_board VALUES(163,14,7,19347,643439)`);
  db.run(`INSERT INTO draft_board VALUES(164,14,8,11261,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(165,14,9,2343,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(166,14,10,2354,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(167,14,11,19359,746602)`);
  db.run(`INSERT INTO draft_board VALUES(168,14,12,2355,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(169,15,1,17762,1203346)`);
  db.run(`INSERT INTO draft_board VALUES(170,15,2,2339,746602)`);
  db.run(`INSERT INTO draft_board VALUES(171,15,3,16262,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(172,15,4,19349,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(173,15,5,2336,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(174,15,6,2358,643439)`);
  db.run(`INSERT INTO draft_board VALUES(175,15,7,13124,643429)`);
  db.run(`INSERT INTO draft_board VALUES(176,15,8,13324,746639)`);
  db.run(`INSERT INTO draft_board VALUES(177,15,9,17631,643135)`);
  db.run(`INSERT INTO draft_board VALUES(178,15,10,16941,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(179,15,11,18482,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(180,15,12,12611,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(181,16,1,17643,1353802)`);
  db.run(`INSERT INTO draft_board VALUES(182,16,2,3452,1353804)`);
  db.run(`INSERT INTO draft_board VALUES(183,16,3,16457,1353754)`);
  db.run(`INSERT INTO draft_board VALUES(184,16,4,18383,643135)`);
  db.run(`INSERT INTO draft_board VALUES(185,16,5,17602,746639)`);
  db.run(`INSERT INTO draft_board VALUES(186,16,6,17716,643429)`);
  db.run(`INSERT INTO draft_board VALUES(187,16,7,18510,643439)`);
  db.run(`INSERT INTO draft_board VALUES(188,16,8,19380,1243644)`);
  db.run(`INSERT INTO draft_board VALUES(189,16,9,10779,1203332)`);
  db.run(`INSERT INTO draft_board VALUES(190,16,10,18459,1536338)`);
  db.run(`INSERT INTO draft_board VALUES(191,16,11,15412,746602)`);
  db.run(`INSERT INTO draft_board VALUES(192,16,12,12347,1203346)`);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Database setup complete.");
});
