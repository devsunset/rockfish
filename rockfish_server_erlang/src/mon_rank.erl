%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) 2015, <COMPANY>
%%% @doc
%%%
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_rank).
-author("이국현").

%% API
-export([indexof/2]).
-export([init/0, update/2, get_rank/1]).

indexof(N, List) ->
    indexof(0, N, List).

indexof(_Idx, _N, []) ->
    0;
indexof(Idx, N, [N|_Tail]) ->
    Idx+1;
indexof(Idx, N, [_H|Tail]) ->
    indexof(Idx+1, N, Tail).

init() ->
    ets:new(rank_data, [named_table, ordered_set]),
    ets:new(rank_user, [named_table, set]),
    ok.

update(User, Point) ->
    update_1(ets:lookup(rank_user, User), User, Point).

update_1([], User, Point) ->
    ets:insert(rank_user, {User, Point}),
    update_2(ets:lookup(rank_data, Point), User, Point);
update_1([{_,OldPoint}], User, Point) ->
    ets:insert(rank_user, {User, Point}),
    [{_,OldUsers}] = ets:lookup(rank_data, OldPoint),
    OldUsers1 = OldUsers -- [User],
    case OldUsers1 of
        [] ->
            ets:delete(rank_data, OldPoint);
        _ ->
            ets:insert(rank_data, {OldPoint, OldUsers1})
    end,
    update_2(ets:lookup(rank_data, Point), User, Point).

update_2([], User, Point) ->
    ets:insert(rank_data, {Point, [User]});
update_2([{_,Users}], User, Point) ->
    NewUsers = Users ++ [User],
    ets:insert(rank_data, {Point, NewUsers}).

get_rank(User) ->
    get_rank_1(ets:lookup(rank_user, User)).

get_rank_1([]) ->
    0;
get_rank_1([{_,Point}]) ->
    get_rank_2(ets:last(rank_data), Point).

get_rank_2('$end_of_table', _) ->
    1;
get_rank_2(Key, Point) ->
    get_rank_3(1, Key, Point).

get_rank_3(Rank, Key, Key) ->
    Rank;
get_rank_3(Rank, '$end_of_table', _) ->
    Rank;
get_rank_3(Rank, Key, Point) ->
    [{_,Users}] = ets:lookup(rank_data, Key),
    Len = length(Users),
    NewRank = Rank+Len,
    get_rank_3(NewRank, ets:prev(rank_data, Key), Point).




