import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { callUpApi } from '../Api/callAPi';
import CommonLayout from '../Layout/CommonLayout';
import { chatStore, myFriendsList, userInfo } from '../recoil/store';
import { ContentProfile } from './Community';

const ListOutLine = styled.div`
    position: absolute;
    top: 100px;
    width: calc(100% - 20px);
    height: calc(100% - 170px);
    padding: 10px;
`;
const ButtonPosition = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 20px;
`;
type props = {
    backColor?: string;
    borderTop?: string;
    borderLeft?: string;
    borderRight?: string;
    borderBottom?: string;
    color?: string;
    hoverColor?: string;
    hoverBackColor?: string;
    display?: string;
    url?: string;
};
const ListButton = styled.button`
    width: 50%;
    height: 50px;
    border-top: ${(props: props) => props.borderTop};
    border-left: ${(props: props) => props.borderLeft};
    border-right: ${(props: props) => props.borderRight};
    border-bottom: ${(props: props) => props.borderBottom};
    background-color: ${(props: props) => props.backColor};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    cursor: pointer;
`;
const ListDiv = styled.div`
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    border: 1px solid;
    border-top: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
`;

const ChatList = styled.div`
    position: relative;
    display: flex;
    top: 10px;
    width: 95%;
    margin: 0 auto 10px auto;
    flex-direction: row;
    /* border: 1px solid;s */
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #44434332;
    &:hover {
        background-color: #ffffff37;
    }
    &:active {
        background-color: #0338ca46;
    }
`;
const ContentProfileImg = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-image: url(${(props: props) => props.url});
    background-position: center;
    background-size: cover;
`;

const ContentProfileName = styled.div`
    display: flex;
    margin: auto 5px;
    font-size: 15px;
    font-weight: bold;
`;
const ContentTitle = styled.h3`
    display: flex;
    margin: auto 5px;
    /* font-size: 15px; */
    font-weight: bold;
`;
const FriendsDiv = styled.div`
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    margin: 10px auto auto auto;
`;
const ShowLevel = styled.div`
    display: flex;
    border: 1px solid;
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    font-weight: bold;
`;

interface list {
    roomId?: string;
    name?: string;
    nick: string;
    profileImageUrl?: string;
    id?: number;
    participantList: [
        {
            user: {
                id: number;
                userId: string;
                nick: string;
                email: string;
                profileImageUrl: string;
            };
        },
    ];
}
interface friends {
    id: string;
    nick: string;
    profileImageUrl: string;
}
interface data {
    name: string;
    nick: string;
}
export const Chat = () => {
    const [listName, setListName] = useState<string>('Chat List');
    const [userdata, setUserdata] = useRecoilState(userInfo);
    const [chatList, setChatList] = useRecoilState(chatStore);
    const [friends, setFriends] = useRecoilState(myFriendsList);
    const queryClient = useQueryClient();

    const nav = useNavigate();
    const userData = useQuery('userData', callUpApi.getInfoApi, {
        onSuccess: (res) => {
            queryClient.invalidateQueries('chatList');
            setUserdata(res.data);
        },
    });
    const chatQuery = useQuery('chatList', callUpApi.getChatListApi, {
        onSuccess: (res) => {
            setChatList(res.data);
        },
    });
    const friendQuery = useQuery('friendList', callUpApi.friendsListApi, {
        onSuccess: (res) => {
            setFriends(res.data);
        },
    });
    const makePrivateRoom = (data: data) => {
        makePrivate.mutate(data);
    };
    const makePrivate = useMutation(
        (data: data) => callUpApi.makePrivateApi(data),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('chatList');
                nav(`/chat/${res.data.roomId}`);
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    alert('로그인이 갱신되었습니다. 다시 시도해주세요.');
                }
            },
        },
    );
    const localToken = localStorage.getItem('recoil-persist');
    useEffect(() => {
        if (!localToken) {
            alert('로그인 정보가 없습니다.');
            nav('/login?로그인+정보가+없습니다.');
        }
    }, [localToken]);
    return (
        <CommonLayout title="Chatting">
            <ListOutLine>
                <ButtonPosition>
                    <ListButton
                        backColor={
                            listName === 'Chat List' ? '#ffffff76' : '#88858576'
                        }
                        borderTop={
                            listName === 'Chat List' ? '1px solid' : 'none'
                        }
                        borderRight={
                            listName === 'Chat List' ? '1px solid' : 'none'
                        }
                        borderLeft={
                            listName === 'Chat List' ? '1px solid' : 'none'
                        }
                        borderBottom={
                            listName === 'Chat List' ? 'none' : '1px solid'
                        }
                        onClick={() => setListName('Chat List')}
                    >
                        Chat List
                    </ListButton>
                    <ListButton
                        backColor={
                            listName === 'Chat with friends'
                                ? '#ffffff76'
                                : '#88858576'
                        }
                        borderTop={
                            listName === 'Chat with friends'
                                ? '1px solid'
                                : 'none'
                        }
                        borderRight={
                            listName === 'Chat with friends'
                                ? '1px solid'
                                : 'none'
                        }
                        borderLeft={
                            listName === 'Chat with friends'
                                ? '1px solid'
                                : 'none'
                        }
                        borderBottom={
                            listName === 'Chat with friends'
                                ? 'none'
                                : '1px solid'
                        }
                        onClick={() => setListName('Chat with friends')}
                    >
                        Chat with friends
                    </ListButton>
                </ButtonPosition>
                <ListDiv>
                    {listName === 'Chat List' ? (
                        <>
                            {chatList.map((list: list, i: number) => (
                                <ChatList
                                    key={i}
                                    onClick={() => nav(`/chat/${list.roomId}`)}
                                >
                                    {list.participantList[0] ? (
                                        <ContentProfileImg
                                            url={
                                                list.participantList[0].user
                                                    .profileImageUrl
                                            }
                                        />
                                    ) : (
                                        <ContentProfileImg url="/img/기본이미지.png" />
                                    )}
                                    <ContentTitle>{list.name}</ContentTitle>
                                </ChatList>
                            ))}
                        </>
                    ) : (
                        <FriendsDiv>
                            {friends.map((list: friends) => {
                                return (
                                    <ContentProfile
                                        key={list.id}
                                        onClick={() => {
                                            const data = {
                                                name: `${list.nick}님과 ${userdata.nick}님의 대화`,
                                                nick: list.nick,
                                            };
                                            makePrivateRoom(data);
                                        }}
                                    >
                                        <ContentProfileImg
                                            url={list.profileImageUrl}
                                        />
                                        <ContentProfileName>
                                            {list.nick}
                                        </ContentProfileName>
                                        <ShowLevel>Lv:10</ShowLevel>
                                    </ContentProfile>
                                );
                            })}
                        </FriendsDiv>
                    )}
                </ListDiv>
            </ListOutLine>
        </CommonLayout>
    );
};
