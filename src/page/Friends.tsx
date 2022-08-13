import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ContentProfile, ContentProfileName } from './Community';
import {
    BsCaretDownFill,
    BsCaretUpFill,
    BsFillPersonPlusFill,
} from 'react-icons/bs';
import '../css/icon.css';
import AddFriends from '../components/AddFriends';
import { useRecoilState } from 'recoil';
import { myFriendsList, requestsFriendsList } from '../recoil/store';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { callUpApi } from '../Api/callAPi';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../Layout/CommonLayout';
import { GiCycle } from 'react-icons/gi';

type props = {
    color?: string;
    hoverColor?: string;
    backColor?: string;
    hoverBackColor?: string;
    display?: string;
    url?: string;
};
interface list {
    nick: string;
    profileImageUrl: string;
    id: number;
    characterLevel: number;
}
const FriendsOutLine = styled.div`
    position: absolute;
    top: 130px;
    width: calc(100% - 20px);
    height: calc(100% - 190px);
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar {
        display: none;
    }
`;
const ListType = styled.div`
    width: 100%;
    font-weight: bold;
    color: #838383;
`;
const ContentProfileImg = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-image: url(${(props: props) => props.url});
    background-position: center;
    background-size: cover;
`;
const FriendsDiv = styled.div`
    width: 100%;
    display: ${(props: props) => props.display};
    flex-direction: column;
`;
const ShowLevel = styled.div`
    display: flex;
    border: 1px solid;
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    font-weight: bold;
`;
const ResponseDiv = styled.div`
    position: absolute;
    height: 30px;
    right: 10px;
    gap: 10px;
    display: flex;
`;
const Button = styled.button`
    height: 100%;
    border: 2px solid ${(props: props) => props.backColor};
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    color: ${(props: props) => props.color};
    background-color: ${(props: props) => props.backColor};
    &:hover {
        color: ${(props: props) => props.hoverColor};
        background-color: ${(props: props) => props.hoverBackColor};
    }
    &:active {
        color: ${(props: props) => props.color};
        background-color: ${(props: props) => props.backColor};
    }
`;
export const Friends = () => {
    const [addFriends, setAddFriends] = useState<boolean>(false);
    const [requestFriends, setRequestFriends] = useState<boolean>(true);
    const [listFriends, setListFriends] = useState<boolean>(true);
    const [friends, setFriends] = useRecoilState(myFriendsList);
    const [requestFriendsList, setrequestFriendsList] =
        useRecoilState(requestsFriendsList);

    const nav = useNavigate();

    function closeAdd() {
        setAddFriends(!addFriends);
    }
    const queryClient = useQueryClient();

    const friendQuery = useQuery('friendList', callUpApi.friendsListApi, {
        onSuccess: (res) => {
            setFriends(res.data);
        },
    });

    const requestFriendQuery = useQuery(
        'requestFriendList',
        callUpApi.requestFriendListsApi,
        {
            onSuccess: (res) => setrequestFriendsList(res.data),
        },
    );

    const deleteFriendsList = (data: { nick: string }) => {
        deleteFriends.mutate(data);
    };
    const deleteFriends = useMutation(
        (nick: { nick: string }) => callUpApi.deleteFriendsApi(nick),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('friendList');
                queryClient.invalidateQueries('requestFriendList');
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    alert('로그인이 갱신되었습니다. 다시 시도해주세요.');
                }
            },
        },
    );
    const rejectFriendsList = (data: { nick: string }) => {
        rejectFriends.mutate(data);
    };
    const rejectFriends = useMutation(
        (nick: { nick: string }) => callUpApi.deleteRejectApi(nick),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('friendList');
                queryClient.invalidateQueries('requestFriendList');
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    alert('로그인이 갱신되었습니다. 다시 시도해주세요.');
                }
            },
        },
    );
    const acceptFriendsRequest = (data: { nick: string }) => {
        acceptFriends.mutate(data);
    };
    const acceptFriends = useMutation(
        (nick: { nick: string }) => callUpApi.acceptFriendsApi(nick),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('friendList');
                queryClient.invalidateQueries('requestFriendList');
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
        <CommonLayout title="Friends">
            <BsFillPersonPlusFill
                className="addFriends"
                size="30"
                onClick={() => setAddFriends(!addFriends)}
            />
            <GiCycle
                className="refreshFriends"
                size="25"
                onClick={() => {
                    friendQuery.refetch();
                    requestFriendQuery.refetch();
                }}
            />
            <AddFriends open={addFriends} close={closeAdd} />
            <FriendsOutLine>
                <ListType>
                    친구 요청
                    {requestFriends ? (
                        <BsCaretUpFill
                            onClick={() => {
                                setRequestFriends(false);
                            }}
                        />
                    ) : (
                        <BsCaretDownFill
                            onClick={() => {
                                setRequestFriends(true);
                            }}
                        />
                    )}
                    <hr />
                </ListType>
                <FriendsDiv display={requestFriends ? 'flex' : 'none'}>
                    {requestFriendsList.map((requestList: list) => {
                        return (
                            <ContentProfile key={requestList.id}>
                                <ContentProfileImg
                                    url={requestList.profileImageUrl}
                                />
                                <ContentProfileName>
                                    {requestList.nick}
                                </ContentProfileName>
                                <ShowLevel>
                                    Lv:{requestList.characterLevel}
                                </ShowLevel>
                                <ResponseDiv>
                                    <Button
                                        color="white"
                                        hoverColor="black"
                                        backColor="#4d4ae4"
                                        hoverBackColor="white"
                                        onClick={() =>
                                            acceptFriendsRequest({
                                                nick: requestList.nick,
                                            })
                                        }
                                    >
                                        수락
                                    </Button>
                                    <Button
                                        color="white"
                                        hoverColor="black"
                                        backColor="#e44a4a"
                                        hoverBackColor="white"
                                        onClick={() => {
                                            rejectFriendsList({
                                                nick: requestList.nick,
                                            });
                                        }}
                                    >
                                        거절
                                    </Button>
                                </ResponseDiv>
                            </ContentProfile>
                        );
                    })}
                </FriendsDiv>
                <ListType>
                    친구 목록
                    {listFriends ? (
                        <BsCaretUpFill
                            onClick={() => {
                                setListFriends(false);
                            }}
                        />
                    ) : (
                        <BsCaretDownFill
                            onClick={() => {
                                setListFriends(true);
                            }}
                        />
                    )}
                    <hr />
                </ListType>
                <FriendsDiv display={listFriends ? 'flex' : 'none'}>
                    {friends.map((list: list) => {
                        return (
                            <ContentProfile
                                key={list.id}
                                onClick={() => {
                                    nav(`/friends/${list.nick}`);
                                }}
                            >
                                <ContentProfileImg url={list.profileImageUrl} />
                                <ContentProfileName>
                                    {list.nick}
                                </ContentProfileName>
                                <ShowLevel>Lv:{list.characterLevel}</ShowLevel>
                                <ResponseDiv>
                                    <Button
                                        color="white"
                                        hoverColor="black"
                                        backColor="#e44a4a"
                                        hoverBackColor="white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFriendsList({
                                                nick: list.nick,
                                            });
                                        }}
                                    >
                                        삭제
                                    </Button>
                                </ResponseDiv>
                            </ContentProfile>
                        );
                    })}
                </FriendsDiv>
            </FriendsOutLine>
        </CommonLayout>
    );
};
