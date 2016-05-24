%%%-------------------------------------------------------------------
%%% @author 이국현
%%% @copyright (C) <COMPANY>
%%% @doc
%%%
%%% @end
%%%
%%%-------------------------------------------------------------------
-module(mon_apns).
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
    {Address, Cert, Key} =
        {"gateway.push.apple.com",
        "./key/apns-cert.pem",
        "./key/apns-key.pem"},
    Port = 2195,
    Options = [{certfile, Cert}, {keyfile, Key}, {mode, binary},
        {password, "MYPASSWORD"},
        {verify, verify_none}],
    Timeout = 10000,
    case ssl:connect(Address, Port, Options, Timeout) of
        {ok, Socket} ->
            PayloadBin = create_payload(Message),
            PayloadLength = size(PayloadBin),

%%          Lagacy 버전0
%%          Packet = <<0:8, 32:16/big, DeviceToken:256/big,
%%                     PayloadLength:16/big, PayloadBin/binary>>,
%%          MsgId = <<"AAAA">>,
%%          Expiry = 86400,

%%          Lagacy 버전1
%%          Packet = <<1:8, MsgId/binary, Expiry:4/big-unsigned-integer-unit:8,
%%                     32:16/big, DeviceToken:256/big,
%%                     PayloadLength:16/big, PayloadBin/binary>>,

%%          최신 버전2
            Frame = <<1:8, 32:16/big, Token:256/big,
                      2:8, PayloadLength:16/big, PayloadBin/binary>>,
            FrameLength = size(Frame),
            Packet = <<2:8, FrameLength:32/big, Frame/binary>>,
            SendRet = ssl:send(Socket, Packet),
            io:format("push_apns send ~p result(~p)~n",[PayloadBin, SendRet]),
            Recv = ssl:recv(Socket, 0, 1000),
            io:format("push_apns recv ~p~n",[Recv]),
            ssl:close(Socket);
        {error, Reason} ->
            {error, Reason}
    end.

create_payload(Message) ->
    Data =
        [{<<"aps">>, [
            {<<"alert">>, Message},
            {<<"badge">>, 0}]
        }],
    jsx:encode(Data).
