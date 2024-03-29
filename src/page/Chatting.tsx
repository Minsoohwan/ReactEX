import React, { KeyboardEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { chattingStore, userInfo } from '../recoil/store';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ImExit } from 'react-icons/im';
import axios from 'axios';
import setupInterceptorsTo from '../Api/Interceptors';
import { callUpApi } from '../Api/callAPi';
import { createDateTime } from './Community';
import CommonLayout from '../Layout/CommonLayout';

interface chatList {
    roomId: string;
    sender: string;
    message: string;
    type: string;
    profileImageUrl: string;
    createdDate: string;
}

const Content = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column-reverse;
    top: 100px;
    width: calc(100% - 20px);
    max-height: calc(100% - 220px);
    overflow: auto;
    ::-webkit-scrollbar {
        display: none;
    }
`;
type props = {
    position?: string;
    display?: string;
    color?: string;
    fontColor?: string;
    imgUrl?: string;
    fontSize?: string;
    maxWidth?: string;
    flexDirection?: string;
};
const ChatDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${(props: props) => props.position};
    margin: 10px;
    gap: 10px;
`;
const Profile = styled.div`
    display: ${(props: props) => props.display};
    align-items: center;
    flex-direction: row;
`;
const ContentProfileImg = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-image: url(${(props: props) => props.imgUrl});
    background-position: center;
    background-size: cover;
`;

const ContentProfileName = styled.div`
    display: flex;
    margin: auto 5px;
    font-size: 12px;
    font-weight: bold;
`;
const ChatContentDiv = styled.div`
    display: flex;
    width: 100%;
    flex-direction: ${(props: props) => props.flexDirection};
`;
const TimeDiv = styled.div`
    display: flex;
    align-items: flex-end;
    font-size: 12px;
    font-weight: bold;
`;
const ChatConent = styled.div`
    max-width: ${(props: props) => (props.maxWidth ? props.maxWidth : '60%')};
    font-size: ${(props: props) => (props.fontSize ? props.fontSize : '')};
    display: flex;
    color: ${(props: props) => props.fontColor};
    background-color: ${(props: props) => props.color};
    word-break: break-all;
    border-radius: 10px;
    padding: 10px;
`;

const ChatBox = styled.div`
    position: fixed;
    bottom: 70px;
    max-width: 726px;
    min-width: 335px;
    justify-content: space-between;
    width: calc(100% - 40px);
    display: flex;
    margin-left: 10px;
`;
const ChatInput = styled.input`
    min-width: 85%;
    max-width: 85%;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    min-height: 40px;
    max-height: 40px;
`;
const SendButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 15px;
    height: 40px;
    width: calc(15% - 10px);
    border-radius: 10px;
    border: none;
    color: white;
    background-color: #080cf8;
    cursor: pointer;
    &:hover {
        background-color: #cfcfcf;
        color: black;
    }
    &:active {
        background-color: #080cf8;
        color: white;
    }
`;
export const Chatting = () => {
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });

    const [chattinglist, setChattingList] = useRecoilState(chattingStore);
    const [userdata, setUserdata] = useRecoilState(userInfo);
    const [msg, setmsg] = useState<string>('');
    const nav = useNavigate();
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setmsg(e.target.value);
    };

    const userData = useQuery('userData', callUpApi.getInfoApi, {
        onSuccess: (res) => {
            setUserdata(res.data);
        },
    });
    const params = useParams();
    const roomId = params.id;
    const sock = new SockJS('https://todowith.shop/ws');
    const ws = Stomp.over(sock);
    const callApi = setupInterceptorsTo(baseApi);
    const getChatApi = async () => {
        const gcda = await callApi.get(`/chat/message/before?roomId=${roomId}`);
        return gcda;
    };
    const userChatList = useQuery('chattingList', getChatApi, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('chattingList');
            setChattingList(res.data.content);
        },
    });
    const queryClient = useQueryClient();
    const localToken = localStorage.getItem('recoil-persist');
    function wsConnectSubscribe() {
        try {
            if (localToken) {
                const toto = JSON.parse(localToken);
                const access = toto.access;

                if (toto) {
                    ws.connect(
                        {
                            Authorization: access,
                        },
                        () => {
                            ws.subscribe(
                                `/sub/chat/room/${roomId}`,
                                () => {
                                    queryClient.invalidateQueries(
                                        'chattingList',
                                    );
                                },
                                {
                                    Authorization: access,
                                    id: roomId,
                                },
                            );
                        },
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const deleteChatRoom = (data: { roomId: string }) => {
        deleteChat.mutate(data);
    };

    const deleteChat = useMutation((data: { roomId: string }) =>
        callUpApi.deleteChatApi(data),
    );
    function wsDisConnectUnsubscribe() {
        if (roomId) {
            deleteChatRoom({ roomId: roomId });
        }

        try {
            if (localToken) {
                const toto = JSON.parse(localToken);
                const access = toto.access;
                if (toto) {
                    const data = {
                        type: 'QUIT',
                        roomId: roomId,
                        sender: userdata.nick,
                        message: msg,
                    };
                    ws.send(
                        `/pub/chat/message`,
                        { Authorization: access },
                        JSON.stringify(data),
                    );
                    ws.disconnect(
                        () => {
                            if (roomId) {
                                ws.unsubscribe(roomId);
                            }
                        },
                        { Authorization: access },
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    function waitForConnection(ws: any, callback: any) {
        setTimeout(
            function () {
                // 연결되었을 때 콜백함수 실행
                if (ws.ws.readyState === 1) {
                    callback();
                    // 연결이 안 되었으면 재호출
                } else {
                    waitForConnection(ws, callback);
                }
            },
            100, // 밀리초 간격으로 실행
        );
    }
    const onKeyPressEmailCert = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
            queryClient.invalidateQueries('chattingList');
            setmsg('');
        }
    };
    useEffect(() => {
        wsConnectSubscribe();
    }, [localToken]);
    function sendMessage() {
        try {
            // token이 없으면 로그인 페이지로 이동
            if (!localToken) {
                alert('토큰이 없습니다. 다시 로그인 해주세요.');
                nav('/');
            }
            // send할 데이터
            const data = {
                type: 'TALK',
                roomId: roomId,
                sender: userdata.nick,
                message: msg,
            };
            // 빈문자열이면 리턴
            if (msg === '') {
                return;
            }
            if (localToken) {
                const toto = JSON.parse(localToken);

                if (toto) {
                    const access = toto.access;
                    waitForConnection(ws, function () {
                        ws.send(
                            `/pub/chat/message`,
                            { Authorization: access },
                            JSON.stringify(data),
                        );
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!localToken) {
            alert('로그인 정보가 없습니다.');
            nav('/login?로그인+정보가+없습니다.');
        }
    }, [localToken]);

    return (
        <CommonLayout title="Chatting">
            <ImExit
                className="exit"
                size="25"
                onClick={() => {
                    wsDisConnectUnsubscribe();

                    nav(-1);
                }}
            />
            <Content>
                {chattinglist.map((chat: chatList, i: number) => {
                    if (chat.type === 'QUIT') {
                        return (
                            <ChatDiv key={i} position="center">
                                <ChatConent
                                    fontSize="12px"
                                    color="#cfcfcfd1"
                                    fontColor="#f5f5f5"
                                    maxWidth="90%"
                                >
                                    {chat.message}
                                </ChatConent>
                            </ChatDiv>
                        );
                    } else if (
                        i === chattinglist.length - 1 ||
                        (i > 0 &&
                            createDateTime(
                                chattinglist[i - 1].createdDate,
                            )[0] !==
                                createDateTime(chattinglist[i].createdDate)[0])
                    ) {
                        return (
                            <>
                                <ChatDiv
                                    key={i}
                                    position={
                                        userdata.nick === chat.sender
                                            ? 'flex-end'
                                            : 'flex-start'
                                    }
                                >
                                    <Profile
                                        display={
                                            userdata.nick === chat.sender
                                                ? 'none'
                                                : 'flex'
                                        }
                                    >
                                        <ContentProfileImg
                                            imgUrl={chat.profileImageUrl}
                                        />
                                        <ContentProfileName>
                                            {chat.sender}
                                        </ContentProfileName>
                                    </Profile>
                                    <ChatContentDiv
                                        flexDirection={
                                            userdata.nick === chat.sender
                                                ? 'row-reverse'
                                                : 'row'
                                        }
                                    >
                                        <ChatConent
                                            color={
                                                userdata.nick === chat.sender
                                                    ? 'blue'
                                                    : '#cfcfcf'
                                            }
                                            fontColor={
                                                userdata.nick === chat.sender
                                                    ? 'white'
                                                    : 'black'
                                            }
                                        >
                                            {chat.message}
                                        </ChatConent>
                                        <TimeDiv>
                                            {
                                                createDateTime(
                                                    chat.createdDate,
                                                )[1]
                                            }
                                        </TimeDiv>
                                    </ChatContentDiv>
                                </ChatDiv>
                                <ChatDiv key={i + 500} position="center">
                                    <ChatConent
                                        fontSize="12px"
                                        color="#acacacb0"
                                        fontColor="#ffffff"
                                        maxWidth="90%"
                                    >
                                        {createDateTime(chat.createdDate)[0]}
                                    </ChatConent>
                                </ChatDiv>
                            </>
                        );
                    } else {
                        return (
                            <ChatDiv
                                key={i}
                                position={
                                    userdata.nick === chat.sender
                                        ? 'flex-end'
                                        : 'flex-start'
                                }
                            >
                                <Profile
                                    display={
                                        userdata.nick === chat.sender
                                            ? 'none'
                                            : 'flex'
                                    }
                                >
                                    <ContentProfileImg
                                        imgUrl={chat.profileImageUrl}
                                    />
                                    <ContentProfileName>
                                        {chat.sender}
                                    </ContentProfileName>
                                </Profile>
                                <ChatContentDiv
                                    flexDirection={
                                        userdata.nick === chat.sender
                                            ? 'row-reverse'
                                            : 'row'
                                    }
                                >
                                    <ChatConent
                                        color={
                                            userdata.nick === chat.sender
                                                ? 'blue'
                                                : '#cfcfcf'
                                        }
                                        fontColor={
                                            userdata.nick === chat.sender
                                                ? 'white'
                                                : 'black'
                                        }
                                    >
                                        {chat.message}
                                    </ChatConent>
                                    <TimeDiv>
                                        {createDateTime(chat.createdDate)[1]}
                                    </TimeDiv>
                                </ChatContentDiv>
                            </ChatDiv>
                        );
                    }
                })}
            </Content>
            <ChatBox>
                <ChatInput
                    onChange={onChange}
                    value={msg}
                    onKeyUp={onKeyPressEmailCert}
                />
                <SendButton
                    onClick={() => {
                        sendMessage();

                        setmsg('');
                    }}
                >
                    Send
                    <FiSend size={15} />
                </SendButton>
            </ChatBox>
        </CommonLayout>
    );
};
