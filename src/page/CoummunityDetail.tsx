import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import AddListModal from '../components/AddListModal';
import AppBar from '../components/AppBar';
import Title from '../components/Title';
import TopBar from '../components/TopBar';
import { MdEmojiPeople } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { BsShareFill } from 'react-icons/bs';
import { BsPencilFill } from 'react-icons/bs';
import { BsTrashFill } from 'react-icons/bs';
import ChatJoin from '../components/ChatJoin';
import { useNavigate, useParams } from 'react-router-dom';
import TopBack from '../components/TopBack';
import AppBack from '../components/AppBack';
import UserModal from '../components/UserMenu';
import axios, { AxiosError } from 'axios';
import setupInterceptorsTo from '../Api/Interceptors';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ContentProfileImg, DateDiv } from './Community';
import { callUpApi } from '../Api/callAPi';

const WhiteBoard = styled.div`
    position: relative;
    max-width: 768px;
    width: 100%;
    min-height: 667px;
    height: 100vh;
    margin: auto;
    display: flex;
    padding: 10px;
    overflow: auto;
    flex-direction: column;
    border: 1px solid;
    background-image: linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.8)
        ),
        url('/background.png');
    background-size: auto;
    background-position: -60px 15px;
`;
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
    height: 40px; ;
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

const TodoInform = styled.div`
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
    const [showReq, setShowReq] = useState<boolean>(false);
    const [menu, setMenu] = useState<boolean>(false);
    const [join, setjoin] = useState<boolean>(false);
    const param = useParams();
    const boardId = param.id;
    const queryClient = useQueryClient();
    const nav = useNavigate();
    function closeReq() {
        setShowReq(!showReq);
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
        onSuccess: (res) => {
            console.log(res);
        },
    });

    const joinTodo = () => {
        if (boardId) {
            letJoin.mutate(boardId);
        }
    };
    const letJoin = useMutation((id: string) => callUpApi.joinTodoApi(id), {
        onSuccess: (res) => {
            console.log(res);
            queryClient.invalidateQueries('boardDetail');
        },
        onError: (err: AxiosError<{ msg: string }>) => {
            console.log(err);
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
                console.log(res);
                setjoin(!join);
                queryClient.invalidateQueries('chatList');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                console.log(err);
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
                console.log(res);
                setjoin(!join);
                queryClient.invalidateQueries('boardDetail');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
            },
        },
    );
    return (
        <WhiteBoard onClick={menu ? () => setMenu(false) : () => {}}>
            <TopBar />
            <Title title="Community" />
            <TopBack />
            <UserModal />
            {boardDetail.status === 'success' && (
                <ContentOutLine>
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
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ContentType>참여형</ContentType>
                                    <DateDiv>2022.07.16</DateDiv>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        margin: 'auto 10px auto auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <DateDiv>2022.07.16</DateDiv>
                                </div>
                            )}

                            <BsThreeDots
                                size="25"
                                cursor={'pointer'}
                                onClick={() => setMenu(!menu)}
                            />
                            {menu && (
                                <CommunityMenu>
                                    <MenuContent borderTop="" borderBottom="">
                                        링크
                                        <BsShareFill />
                                    </MenuContent>
                                    <MenuContent
                                        borderTop="1px solid #58585857"
                                        borderBottom="1px solid #58585857"
                                    >
                                        수정
                                        <BsPencilFill />
                                    </MenuContent>
                                    <MenuContent borderTop="" borderBottom="">
                                        삭제
                                        <BsTrashFill />
                                    </MenuContent>
                                </CommunityMenu>
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

                        <Count>
                            <MdEmojiPeople size={20} />
                            {boardDetail.data.data.participatingCount}
                        </Count>
                    </ContentDiv>
                    {boardDetail.data.data.category === 'CHALLENGE' && (
                        <JoinButton
                            join={join}
                            color={join ? '#999999' : '#272626'}
                            onClick={
                                join
                                    ? () => {
                                          cancleTodo();
                                      }
                                    : () => {
                                          joinTodo();
                                      }
                            }
                        >
                            {join ? 'Now Doing...' : "Let's Do it!"}
                        </JoinButton>
                    )}

                    {join && (
                        <JoinButton
                            join={!join}
                            color="#272626"
                            onClick={() => {
                                enterChat({
                                    roomId: boardDetail.data.data.chatRoomId,
                                });
                                nav(
                                    `/chat/${boardDetail.data.data.chatRoomId}`,
                                );
                            }}
                        >
                            채팅 참여하기
                        </JoinButton>
                    )}
                </ContentOutLine>
            )}

            <AddListModal
                title="일정 추가하기"
                open={showReq}
                close={closeReq}
                type="add"
            />
            <AppBack />
            <AppBar close={closeReq} />
        </WhiteBoard>
    );
};
