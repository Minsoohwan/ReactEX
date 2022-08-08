import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdEmojiPeople } from 'react-icons/md';
import { BsThreeDots, BsPencilFill, BsTrashFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import setupInterceptorsTo from '../Api/Interceptors';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from 'react-query';
import { ContentProfileImg, createDateTime, DateDiv } from './Community';
import { callUpApi } from '../Api/callAPi';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { boardStore, userInfo } from '../recoil/store';
import CommonLayout from '../Layout/CommonLayout';

const Menu = keyframes`
    0%{
        transform: translateY(-10%);
        opacity: 50%;
    }
    100%{
        transform: translateY(0);
        opacity: 100%;
    }
`;
const CommunityMenu = styled.div`
    position: absolute;
    right: 30px;
    top: 20px;
    width: 100px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background-color: #fffefe;
    animation: ${Menu} 0.3s linear;
`;
type props = {
    borderTop: string;
    borderBottom: string;
};
const MenuContent = styled.div`
    display: flex;
    color: #000000cf;
    justify-content: center;
    font-weight: bold;
    gap: 10px;
    border-top: ${(props: props) => props.borderTop};
    border-bottom: ${(props: props) => props.borderBottom};
    align-items: center;
    width: 100%;
    height: 40px;
    cursor: pointer;
`;

const ContentOutLine = styled.div`
    position: absolute;
    top: 100px;
    width: calc(100% - 20px);
    height: calc(100% - 155px);
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
const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const ContentProfile = styled.div`
    display: flex;
    margin-bottom: 10px;
    flex-direction: row;
    align-items: center;
`;

const ContentProfileName = styled.div`
    display: flex;
    margin: auto 5px;
    font-size: 15px;
    font-weight: bold;
`;
const ContentType = styled.div`
    width: 60px;
    height: 30px;
    font-size: 13px;

    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #3737b9;
    color: #3737b9;
    font-weight: bold;

    border-radius: 10px;
`;
const ContentImg = styled.img`
    max-width: 100%;
    max-height: 100%;
    border-radius: 20px;
    margin: auto;
`;
const ContentTitle = styled.h2`
    width: calc(100% - 10px);
    font-size: 23px;
    display: flex;
    font-weight: 900 !important;
    margin: 5px;
    text-align: left;
`;
const Content = styled.div`
    width: 100%;

    font-size: 15px;
    color: gray;
    display: flex;
    margin: 5px;
    text-align: left;
    text-overflow: ellipsis;
`;
const Count = styled.div`
    margin-left: 5px;
    font-size: 20px;
    font-weight: bold;
`;
type color = {
    color: string;
    join: boolean;
};
const JoinButton = styled.button`
    width: 100%;
    min-height: 45px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    color: white;
    margin: 10px auto;
    background-color: ${(props: color) => props.color};
    cursor: ${(props: color) => (props.join ? 'Default' : 'pointer')};
    &:hover {
        background-color: #999999;
    }
    &:active {
        background-color: ${(props: color) =>
            props.join ? '#999999' : '#272626'};
    }
`;

export const TodoInform = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 3px dashed;
    border-radius: 10px;

    margin: 10px auto;

    div:nth-child(1) {
        font-size: 20px;
        font-weight: bold;
    }
    div:nth-child(2) {
        font-size: 20px;
        font-weight: bold;
    }
    div:nth-child(3) {
        font-size: 15px;
        font-weight: bold;
    }
`;

export const CommunityDetail = () => {
    const [menu, setMenu] = useState<boolean>(false);
    const [join, setjoin] = useState<boolean>(false);
    const setBoardData = useSetRecoilState(boardStore);
    const userdata = useRecoilValue(userInfo);
    const param = useParams();
    const boardId = param.id;
    const queryClient = useQueryClient();
    const nav = useNavigate();

    const chatQuery = useQuery('chatList', callUpApi.getChatListApi, {});
    function checkChatRoom(data: string) {
        if (chatQuery.status === 'success') {
            const roomId = [];
            for (let i = 0; i < chatQuery.data.data.length; i++) {
                roomId.push(chatQuery.data.data[i].roomId);
            }
            if (roomId.includes(data)) {
                return false;
            } else {
                return true;
            }
        }
    }
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });

    const callApi = setupInterceptorsTo(baseApi);

    const getDetail = async () => {
        const detail = await callApi.get(`/board/${boardId}`);
        return detail;
    };
    const boardDetail = useQuery('boardDetail', getDetail, {
        onSuccess: (res) => setBoardData(res.data),
    });

    const joinTodo = () => {
        if (boardId) {
            letJoin.mutate(boardId);
        }
    };
    const letJoin = useMutation((id: string) => callUpApi.joinTodoApi(id), {
        onSuccess: (res) => {
            alert(res.data);
            queryClient.invalidateQueries('boardDetail');
        },
        onError: (err: AxiosError<{ msg: string }>) => {
            alert(err.response?.data.msg);
        },
    });
    const enterChat = (data: { roomId: string }) => {
        enter.mutate(data);
    };
    const enter = useMutation(
        (data: { roomId: string }) => callUpApi.enterPublicApi(data),
        {
            onSuccess: (res) => {
                setjoin(!join);
                queryClient.invalidateQueries('chatList');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
            },
        },
    );
    const cancleTodo = () => {
        if (boardId) {
            cancleJoin.mutate(boardId);
        }
    };
    const cancleJoin = useMutation(
        (id: string) => callUpApi.cancleTodoApi(id),
        {
            onSuccess: (res) => {
                alert(res.data);
                setjoin(!join);
                queryClient.invalidateQueries('boardDetail');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
            },
        },
    );
    const deleteChatRoom = (data: { roomId: string }) => {
        deleteChat.mutate(data);
    };

    const deleteChat = useMutation((data: { roomId: string }) =>
        callUpApi.deleteChatApi(data),
    );
    const deleteBoardPost = () => {
        if (boardId) {
            deleteBoard.mutate(boardId);
        }
    };

    const deleteBoard = useMutation(
        (id: string) => callUpApi.deleteBoardApi(id),
        {
            onSuccess: (res) => {
                alert(res.data);
                nav(-1);
                queryClient.invalidateQueries('boardData');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
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
        <CommonLayout title="Community">
            {boardDetail.status === 'success' && (
                <ContentOutLine
                    onClick={menu ? () => setMenu(false) : () => {}}
                >
                    <ContentDiv>
                        <ContentProfile>
                            <ContentProfileImg
                                backImg={
                                    boardDetail.data.data.authorProfileImageUrl
                                }
                            />
                            <ContentProfileName>
                                {boardDetail.data.data.authorNick}
                            </ContentProfileName>
                            {boardDetail.data.data.category === 'CHALLENGE' ? (
                                <div
                                    style={{
                                        margin: 'auto 10px auto auto',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DateDiv>
                                        {createDateTime(
                                            boardDetail.data.data
                                                .boardCreatedDate,
                                        )[0] +
                                            '\n' +
                                            createDateTime(
                                                boardDetail.data.data
                                                    .boardCreatedDate,
                                            )[1]}
                                    </DateDiv>
                                    <ContentType>참여형</ContentType>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        margin: 'auto 10px auto auto',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DateDiv>
                                        {createDateTime(
                                            boardDetail.data.data
                                                .boardCreatedDate,
                                        )}
                                    </DateDiv>
                                </div>
                            )}
                            {userdata.nick ===
                                boardDetail.data.data.authorNick && (
                                <BsThreeDots
                                    size="25"
                                    cursor={'pointer'}
                                    onClick={() => setMenu(!menu)}
                                />
                            )}
                            {menu &&
                            userdata.nick ===
                                boardDetail.data.data.authorNick ? (
                                <CommunityMenu>
                                    <MenuContent
                                        borderTop=""
                                        borderBottom="1px solid #58585857"
                                        onClick={
                                            boardDetail.data.data.category !==
                                            'CHALLENGE'
                                                ? () => {
                                                      nav(
                                                          `/edit/${boardDetail.data.data.boardId}`,
                                                      );
                                                  }
                                                : () => {
                                                      alert(
                                                          '첼린지는 수정할 수 없습니다.',
                                                      );
                                                  }
                                        }
                                    >
                                        수정
                                        <BsPencilFill />
                                    </MenuContent>
                                    <MenuContent
                                        borderTop=""
                                        borderBottom=""
                                        onClick={() => {
                                            deleteBoardPost();
                                        }}
                                    >
                                        삭제
                                        <BsTrashFill />
                                    </MenuContent>
                                </CommunityMenu>
                            ) : (
                                menu && <CommunityMenu></CommunityMenu>
                            )}
                        </ContentProfile>
                        <ContentImg src={boardDetail.data.data.imageUrl} />
                        <ContentTitle>
                            {boardDetail.data.data.title}
                        </ContentTitle>
                        <Content>{boardDetail.data.data.boardContent}</Content>
                        {boardDetail.data.data.category === 'CHALLENGE' && (
                            <TodoInform>
                                <div>
                                    catagory :{' '}
                                    {boardDetail.data.data.todo.category}
                                </div>
                                <div>
                                    {boardDetail.data.data.todo.todoContent}
                                </div>
                                <div>
                                    {boardDetail.data.data.todo.todoDateList
                                        .length > 1
                                        ? boardDetail.data.data.todo
                                              .todoDateList[
                                              boardDetail.data.data.todo
                                                  .todoDateList.length - 1
                                          ] +
                                          '~' +
                                          boardDetail.data.data.todo
                                              .todoDateList[0]
                                        : boardDetail.data.data.todo
                                              .todoDateList[0]}
                                </div>
                            </TodoInform>
                        )}
                        {boardDetail.data.data.category === 'CHALLENGE' && (
                            <Count>
                                <MdEmojiPeople size={20} />
                                {boardDetail.data.data.participatingCount}
                            </Count>
                        )}
                    </ContentDiv>
                    {boardDetail.data.data.category === 'CHALLENGE' && (
                        <JoinButton
                            join={boardDetail.data.data.participating}
                            color={
                                boardDetail.data.data.participating
                                    ? '#999999'
                                    : '#272626'
                            }
                            onClick={
                                boardDetail.data.data.participating
                                    ? () => {
                                          cancleTodo();
                                          deleteChatRoom({
                                              roomId: boardDetail.data.data
                                                  .chatRoomId,
                                          });
                                          queryClient.invalidateQueries(
                                              'boardDetail',
                                          );
                                      }
                                    : () => {
                                          joinTodo();
                                          queryClient.invalidateQueries(
                                              'boardDetail',
                                          );
                                      }
                            }
                        >
                            {boardDetail.data.data.participating
                                ? 'Now Doing...'
                                : "Let's Do it!"}
                        </JoinButton>
                    )}

                    {boardDetail.data.data.participating && (
                        <JoinButton
                            join={!boardDetail.data.data.participating}
                            color="#272626"
                            onClick={
                                chatQuery.status === 'success' &&
                                checkChatRoom(
                                    boardDetail.data.data.chatRoomId,
                                ) === true
                                    ? () => {
                                          enterChat({
                                              roomId: boardDetail.data.data
                                                  .chatRoomId,
                                          });
                                          nav(
                                              `/chat/${boardDetail.data.data.chatRoomId}`,
                                          );
                                      }
                                    : chatQuery.status === 'success' &&
                                      checkChatRoom(
                                          boardDetail.data.data.chatRoomId,
                                      ) === false
                                    ? () => {
                                          alert('이미 침여중인 채팅입니다.');
                                      }
                                    : () => {}
                            }
                        >
                            채팅 참여하기
                        </JoinButton>
                    )}
                </ContentOutLine>
            )}
        </CommonLayout>
    );
};
