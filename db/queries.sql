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