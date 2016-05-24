%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) <COMPANY>
%%% @doc
%%%
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_http).
-author("이국현").

%% API
-export([init/3, handle/2, terminate/3]).

init(_Type, Req, []) ->
    {ok, Req, no_state}.

handle(Req, State) ->
    {Api, Req1} = cowboy_req:binding(api, Req),
    {What, Req2} = cowboy_req:binding(what, Req1),
    {Opt, Req3} = cowboy_req:binding(opt, Req2),
    %% 데이터 로딩
    {ok, Data, Req4} = cowboy_req:body_qs(Req3),

    io:format("api=~p, what=~p, opt=~p ~n",[Api, What, Opt]),

    Reply = handle(Api, What, Opt, Data),

    {ok, Req5} = cowboy_req:reply(200, [
        {<<"content-type">>, <<"text/plain">>}
    ], Reply, Req4),
    {ok, Req5, State}.

handle(<<"login">>, _, _, Data) ->
    Id = proplists:get_value(<<"id">>, Data),
    Password = proplists:get_value(<<"password">>, Data),
    case mon_users:login(Id, Password) of
        {ok, SessionKey} ->
            jsx:encode([
                {<<"result">>, <<"ok">>},
                {<<"session_key">>, SessionKey}
            ]);
        _ ->
            jsx:encode([{<<"result">>, <<"fail">>}])
    end;
handle(<<"join">>, _, _, Data) ->
    Id = proplists:get_value(<<"id">>, Data),
    Password = proplists:get_value(<<"password">>, Data),
    case mon_users:join(Id, Password) of
        fail ->
            jsx:encode([{<<"result">>, <<"duplicated">>}]);
        ok ->
            jsx:encode([{<<"result">>, <<"join">>}])
    end;
handle(<<"users">>, <<"point">>, _, Data) ->
    SessionKey = proplists:get_value(<<"session_key">>, Data),
    Point1 = proplists:get_value(<<"point">>, Data),
    Point = binary_to_integer(Point1),
    case mon_users:point(SessionKey, Point) of
        ok ->
            jsx:encode([{<<"result">>, <<"ok">>}]);
        fail ->
            jsx:encode([{<<"result">>, <<"fail">>}])
    end;
handle(<<"users">>, <<"token">>, _, Data) ->
    SessionKey = proplists:get_value(<<"session_key">>, Data),
    Token = proplists:get_value(<<"token">>, Data),
    case mon_users:token(SessionKey, Token) of
        ok ->
            jsx:encode([{<<"result">>, <<"ok">>}]);
        fail ->
            jsx:encode([{<<"result">>, <<"fail">>}])
    end;
handle(<<"hello">>, <<"world">>, _, _) ->
    jsx:encode([{<<"result">>, <<"Hello world!">>}]);
handle(_,_,_,_) ->
    jsx:encode([{<<"result">>, <<"error">>}]).

terminate(_Reason, _Req, _State) ->
    ok.
