--POINTS BY RBs
select
	t.name as team,
	SUM(pp.points) as pointsByRbs
from
	player_performances pp
join teams t on
	t.id = pp.team_id
where
	 pp.starter = 1
	and pp.position = 'RB'
group by
	pp.team_id
order by
	pointsByRbs desc;

--POINTS BY WRs
select
	t.name as team,
	SUM(pp.points) as pointsByWrs
from
	player_performances pp
join teams t on
	t.id = pp.team_id
where
	 pp.starter = 1
	and pp.position = 'WR'
group by
	pp.team_id
order by
	pointsByWrs desc;

--POINTS ON BENCH
select
	t.name as team,
	SUM(pp.points) as pointsOnBench
from
	player_performances pp
join teams t on
	t.id = pp.team_id
where
	 pp.starter = 0
group by
	pp.team_id
order by
	pointsOnBench desc;

--WEEKLY RANKS
WITH draft_ranks AS (
SELECT
	db.draft_position,
	db.player_id,
	p.name,
	RANK() OVER (
ORDER BY
	db.draft_position ASC) AS rank
FROM
	draft_board db
JOIN players p ON
	db.player_id = p.id
WHERE
	p."position" = :position
),
weekly_ranks AS (
SELECT
	pp.player_id,
	pp.starter,
	t.name AS team_name,
	pp.points,
	RANK() OVER (
ORDER BY
	pp.points DESC) AS rank
FROM
	player_performances pp
JOIN players p ON
	p.id = pp.player_id
JOIN games g ON
	g.id = pp.game_id
JOIN teams t ON
	t.id = pp.team_id
WHERE
	p."position" = :position
	AND pp.points IS NOT NULL
	AND g.season = :season
	AND g.week = :week
)
SELECT
	p.name player_name,
	wr.points,
	wr.team_name,
	CASE wr.starter WHEN 1 THEN 'Yes' ELSE 'No' END AS started,
	COALESCE(dr.rank, 0) AS draft_rank,
	wr.rank AS weekly_rank,
	CASE
		dr.rank
WHEN NULL THEN 'N/A'
		ELSE COALESCE(dr.rank, wr.rank) - wr.rank
	END AS performance_rank_over_draft
FROM
	weekly_ranks wr
JOIN players p ON
	wr.player_id = p.id
LEFT JOIN draft_ranks dr ON
	dr.player_id = wr.player_id
ORDER BY
	weekly_rank;