%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) <COMPANY>
%%% @doc
%%% Google Cloud Messaging
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_gcm).
-author("이국현").

-include("mon_record.hrl").

%% API
-export([push/2, send/2]).

push(Id, Message) ->
    case mnesia:dirty_read(users, Id) of
        [U] ->
            send(U#users.token, Message);
        _ ->
            fail
    end.

send(Token, Message) ->
    Data = [
        {<<"registration_ids">>, [Token]},
        {<<"data">>, [
            {<<"title">>, Message},
            {<<"message">>, Message}
        ]}
    ],
    GoogleKey = "key=AIzaSyAd4o_-bjAXptpiabjZrq3ZJxEnjAidRYM",
    URL = "https://android.googleapis.com/gcm/send",
    Header = [{"Authorization", GoogleKey}],
    ContentType = "application/json",
    Contents = jsx:encode(Data),
    io:format("~ts~n",[Contents]),
    httpc:request(post, {URL, Header, ContentType, Contents},
        [{ssl, [{verify,0}]}, {timeout, 10000}], []).

