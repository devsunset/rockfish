%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) <COMPANY>
%%% @doc
%%% 유저 관리
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_users).
-author("이국현").

-include("mon_record.hrl").

%% API
-export([join/2, login/2, point/2, token/2, loop/2, make_session_key/2]).

join(Id, Password) ->
    F = fun() ->
            case mnesia:read(users, Id) of
                [] ->
                    %% 해당 Id로 가입된 데이터가 없으면 저장한다
                    Users = #users{id=Id, password=Password},
                    ok = mnesia:write(Users); %% 가입완료
                _ ->
                    fail %% 가입 실패
            end
        end,
    mnesia:activity(transaction, F).

login(Id, Password) ->
    F = fun() ->
            case mnesia:read(users, Id) of
                [U = #users{password=Password}] ->
                    %% Id, Password 일치, 로그인 성공
                    SessionKey = new_session(Id),
                    {ok, SessionKey};
                _ ->
                    %% 일치하는 데이터 없음, 로그인 실패
                    fail
            end
        end,
    mnesia:activity(transaction, F).

point(SessionKey, Point) ->
    case ets:lookup(session_list, SessionKey) of
        [{SessionKey, Pid}] ->
            Ref = make_ref(),
            Pid ! {self(), Ref, save_point, Point},
            receive
                {Ref, saved} ->
                    ok;
                _ ->
                    fail
            after 3000 ->
                fail
            end;
        _ ->
            fail
    end.

token(SessionKey, Token) ->
    case ets:lookup(session_list, SessionKey) of
        [{SessionKey, Pid}] ->
            Ref = make_ref(),
            Pid ! {self(), Ref, save_token, Token},
            receive
                {Ref, saved} ->
                    ok;
                _ ->
                    fail
            after 3000 ->
                fail
            end;
        _ ->
            fail
    end.

%% 유저 세션 프로세스 생성
new_session(Id) ->
    Time = now(),
    Pid = spawn(mon_users, loop, [Id, Time]),
    SessionKey = make_session_key(Id, Pid),
    erlang:send_after(1000, Pid, {check}),
    SessionKey.

%% session loop
loop(Id, Time) ->
    Time1 =
        receive
            {Pid, Ref, save_point, Point} ->
                save_point(Id, Point),
                Pid ! {Ref, saved},
                now();
            {Pid, Ref, save_token, Token} ->
                save_token(Id, Token),
                Pid ! {Ref, saved},
                now();
            {check} ->
                Diff = timer:now_diff(now(), Time),
                %% Diff는 마이크로 세컨드 단위이다.
                %% 10초가 지났으면 세션 종료
                if (Diff > 10000000) -> delete_session_key(self());
                    true -> erlang:send_after(1000, self(), {check})
                end,
                Time;
            _ ->
                Time
        end,
    loop(Id, Time1).

%% 세션 키 생성 및 저장
make_session_key(Id, Pid) ->
    %% 시드 초기화
    {A1, A2, A3} = now(),
    random:seed(A1, A2, A3),

    %% 1~10000까지 숫자중 하나를 랜덤 선택
    Num = random:uniform(10000),

    %% Id를 이용한 Hash 생성
    Hash = erlang:phash2(Id),

    %% 두개의 값을 16진수로 조합하여 session key 생성
    List = io_lib:format("~.16B~.16B", [Hash, Num]),
    SessionKey = list_to_binary(lists:append(List)),

    %% 세션 키 저장 및 리턴
    ets:insert(session_list, {SessionKey, Pid}),
    SessionKey.

%% 세션 키 제거 및 프로세스 종료
delete_session_key(Pid) ->
    [Obj] = ets:match_object(session_list, {'_', Pid}),
    ets:delete_object(session_list, Obj),
    exit(normal).

%% 유저 점수 저장
save_point(Id, Point) ->
    F = fun() ->
        case mnesia:read(users, Id) of
            [U] ->
                %% 유저 점수 저장
                Users = U#users{point=Point},
                ok = mnesia:write(Users);
            _ ->
                fail %% 저장 실패
        end
    end,
    mnesia:activity(transaction, F).

%% 유저 토큰 저장
save_token(Id, Token) ->
    F = fun() ->
        case mnesia:read(users, Id) of
            [U] ->
                %% 유저 토큰 저장
                Users = U#users{token=Token},
                ok = mnesia:write(Users);
            _ ->
                fail %% 저장 실패
        end
    end,
    mnesia:activity(transaction, F).