import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
    BsFillCalendar2CheckFill,
    BsFillCalendarXFill,
    BsFillPeopleFill,
} from 'react-icons/bs';
import AddListModal from '../components/AddListModal';
import AppBar from '../components/AppBar';
import Donut from '../components/Donut';
import TopBar from '../components/TopBar';
import { List, ListTitle } from './Todo';
import { useQuery } from 'react-query';
import axios from 'axios';
import '../css/icon.css';
import AppBack from '../components/AppBack';
import UserModal from '../components/UserMenu';
import AskModal from '../components/AskModal';
import setupInterceptorsTo from '../Api/Interceptors';
import { useNavigate, useParams } from 'react-router-dom';

const WhiteBoard = styled.div`
    position: relative;
    max-width: 768px;
    width: 100%;
    min-width: 375px;
    min-height: 667px;
    height: 100vh;
    margin: auto;
    display: flex;
    padding: 10px;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: center; */
    border: 1px solid;
    gap: 10px;
    background-image: linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.8)
        ),
        url('/background.png');
    background-size: auto;
    background-position: -60px 15px;
`;

const ExpBack = styled.div`
    position: absolute;
    width: 70px;
    height: 70px;
    display: flex;
    border-radius: 50%;
    margin-top: 80px;
    background-color: #b9b9b96e;
`;
type back = {
    image: string | null;
    color: string;
};
const Profileimg = styled.div`
    position: absolute;
    top: 7.5px;
    left: 7.5px;
    width: 55px;
    height: 55px;
    display: flex;
    border-radius: 50%;
    background-color: ${(props: back) => props.color};
    background-image: url(${(props: back) => props.image});
    background-size: cover;
    background-position: center;
`;
const ExpState = styled.div`
    position: absolute;
    bottom: 0;
    left: -5px;
    width: 80px;
    height: 80px;
`;
const ExpPercent = styled.div`
    position: absolute;
    font-size: 12px;
    font-weight: 800;
    top: 18px;
    left: 9px;
`;
const ProfileNameArea = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 100px;
    left: 90px;
    z-index: 999;
    /* background-color: green; */
`;
const ProfileName = styled.h3`
    margin: 0;
`;
const ProfileNameEdit = styled.input`
    height: 25px;
    width: 150px;
    font-size: 20px;
    border-radius: 10px;
    padding: 10px;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
`;
const ProfileEmail = styled.p`
    margin: 0;
    font-weight: 600;
    font-size: 10px;
    font-style: italic;
`;

type ani = {
    ani: boolean;
};
const rotate = keyframes`
    0%{
        transform: rotate(0deg);
    }
    33%{
        transform: rotate(15deg);
    }
    66%{
        transform: rotate(-15deg)
    }
    100%{
        transform:rotate(0)
    }
`;

const vibration = keyframes`
        0%{
        transform: translateX(10%)
    }
    10%{
        transform: translateX(-10%);
    }
    20%{
        transform: translateX(10%)
    }
    30%{
        transform: translateX(-10%);
    }
    40%{
        transform: translateX(10%)
    }
    50%{
        transform: translateX(-10%);
    }
    60%{
        transform: translateX(10%)
    }
    70%{
        transform: translateX(-10%);
    }
    80%{
        transform: translateX(10%)
    }
    90%{
        transform: translateX(-10%);
    }
    100%{
        transform: translateX(10%)
    }
`;
const CharactorBox = styled.div`
    position: relative;
    top: 150px;
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Charactor = styled.img`
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    animation: ${(props: ani) => (props.ani ? rotate : vibration)} 1s linear;
    z-index: 0;
`;
const ListPosition = styled.div`
    position: relative;
    top: 150px;
    width: 100%;
    height: calc(100% - 510px);
    overflow: auto;
`;

export const FriendsMain = () => {
    const localToken = localStorage.getItem('recoil-persist');
    const [showReq, setShowReq] = useState<boolean>(false);
    const [profile, setprofile] = useState<boolean>(true);
    const [listId, setListId] = useState<number>(0);
    const [edit, setEdit] = useState<boolean>(true);
    const [content, setContent] = useState<string>('');
    const [listDate, setListDate] = useState<string>('');
    const [animation, setAnimation] = useState<boolean>(true);
    const [ask, setAsk] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const nav = useNavigate();
    const param = useParams();
    const nick = param.id;
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });
    const callApi = setupInterceptorsTo(baseApi);
    const goFriendsPage = async () => {
        const gfp = await callApi.get(`/friend/page/${nick}`);
        return gfp;
    };
    const friendsPage = useQuery('friendsPage', goFriendsPage, {
        onSuccess: (res) => {
            console.log(res);
        },
    });

    function closeEdit() {
        setShowEdit(!showEdit);
    }
    function closeAsk() {
        setAsk(!ask);
    }

    function closeReq() {
        setShowReq(!showReq);
    }
    useEffect(() => {
        if (!localToken) {
            alert('로그인 정보가 없습니다.');
            nav('/login?로그인+정보가+없습니다.');
        }
    }, [localToken]);
    return (
        <WhiteBoard
            onClick={
                edit
                    ? () => {}
                    : () => {
                          setEdit(true);
                      }
            }
        >
            <TopBar />
            <UserModal />
            {friendsPage.status === 'success' && (
                <>
                    <ExpBack>
                        <Profileimg
                            color="white"
                            image={
                                profile && friendsPage.data.data.profileImageUrl
                            }
                        >
                            {!profile && (
                                <ExpPercent>
                                    {'Lv : ' +
                                        friendsPage.data.data.characterInfo
                                            .level}
                                </ExpPercent>
                            )}
                        </Profileimg>
                        <ExpState onClick={() => setprofile(!profile)}>
                            <Donut
                                exp={
                                    friendsPage.data.data.characterInfo
                                        ?.expPercent
                                }
                            />
                        </ExpState>
                    </ExpBack>
                    <ProfileNameArea>
                        <ProfileName onClick={() => setEdit(false)}>
                            {friendsPage.data.data.nick}
                        </ProfileName>

                        <ProfileEmail>
                            {localToken && friendsPage.data.data.userId}
                        </ProfileEmail>
                    </ProfileNameArea>
                    <CharactorBox>
                        <Charactor
                            ani={animation}
                            src={
                                friendsPage.data.data.characterInfo.level < 5
                                    ? '/img/알.png'
                                    : friendsPage.data.data.characterInfo
                                          .level < 10
                                    ? '/img/금간알.png'
                                    : friendsPage.data.data.characterInfo
                                          .level < 15
                                    ? '/img/깨진알.png'
                                    : '/img/병아리.png'
                            }
                            onClick={() => setAnimation(!animation)}
                        />
                    </CharactorBox>
                    <ListPosition>
                        {friendsPage.data.data.todoList !== null ? (
                            friendsPage.data.data.todoList.map(
                                (
                                    v: {
                                        todoId: number;
                                        todoContent: string;
                                        todoDate: string;
                                        state: boolean;
                                        category: string;
                                        boardId: number;
                                    },
                                    i: number,
                                ) => {
                                    return (
                                        <List key={i}>
                                            {v.state ? (
                                                <BsFillCalendar2CheckFill
                                                    size={15}
                                                    color="green"
                                                    className="planIcon"
                                                />
                                            ) : (
                                                <BsFillCalendarXFill
                                                    size={15}
                                                    color="#d84949"
                                                    className="planIcon"
                                                />
                                            )}
                                            {v.boardId && (
                                                <BsFillPeopleFill
                                                    size={15}
                                                    className="planIcon"
                                                    color="#14943f"
                                                />
                                            )}
                                            <ListTitle>
                                                {v.todoContent} {v.todoDate}
                                            </ListTitle>
                                        </List>
                                    );
                                },
                            )
                        ) : (
                            <List>목록이 비공개이거나 없습니다.</List>
                        )}
                    </ListPosition>
                </>
            )}

            <AskModal open={ask} close={closeAsk} id={listId} />
            <AddListModal
                title="일정 변경하기"
                open={showEdit}
                close={closeEdit}
                propsContent={content}
                todoId={listId}
                listDate={listDate}
                type="Edit"
            />
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
