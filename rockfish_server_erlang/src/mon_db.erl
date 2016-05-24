%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) <COMPANY>
%%% @doc
%%%
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_db).
-author("이국현").

-include("mon_record.hrl").

%% API
-export([install/0, uninstall/0]).

install() ->
    ok = mnesia:create_schema([node()]),
    application:start(mnesia),
    mnesia:create_table(users, [{attributes, record_info(fields, users)},
                                {disc_copies, [node()]}]),
    application:stop(mnesia).

uninstall() ->
    application:stop(mnesia),
    mnesia:delete_schema([node()]).
