import React, { KeyboardEvent, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { BsFillCalendar2CheckFill, BsFillCalendarXFill } from 'react-icons/bs';
import { BsFillTrashFill } from 'react-icons/bs';
import { AiFillCamera } from 'react-icons/ai';
import { FaPencilAlt } from 'react-icons/fa';
import AddListModal from '../components/AddListModal';
import AppBar from '../components/AppBar';
import Donut from '../components/Donut';
import TopBar from '../components/TopBar';
import { IconDiv, List, ListTitle } from './Todo';
import {
    QueryClient,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from 'react-query';
import { callUpApi } from '../Api/callAPi';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { accessTokenState, refreshTokenState, userInfo } from '../recoil/store';
import { jwtUtils } from '../Api/JwtUtils';
import '../css/icon.css';
import AppBack from '../components/AppBack';
import UserModal from '../components/UserMenu';
import setupInterceptorsTo from '../Api/Interceptors';
import { useInView } from 'react-intersection-observer';
import AskModal from '../components/AskModal';

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
    font-size: 15px;
    font-weight: 800;
    top: 15px;
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

export const Main = () => {
    const localToken = localStorage.getItem('recoil-persist');
    const [filter, setFilter] = useState<string>('all');
    const [showReq, setShowReq] = useState<boolean>(false);
    const [profile, setprofile] = useState<boolean>(true);
    const [profileName, setProfileName] = useState<string>('');
    const [listId, setListId] = useState<number>(0);
    const [file, setFile] = useState<File>();
    const [edit, setEdit] = useState<boolean>(true);
    const [content, setContent] = useState<string>('');
    const [listDate, setListDate] = useState<string>('');
    const [animation, setAnimation] = useState<boolean>(true);
    const [userdata, setUserdata] = useRecoilState(userInfo);
    const [ask, setAsk] = useState<boolean>(false);
    const [ref, isView] = useInView();

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const loginToken = useSetRecoilState(accessTokenState);
    const reToken = useSetRecoilState(refreshTokenState);

    const queryClient = useQueryClient();
    function closeEdit() {
        setShowEdit(!showEdit);
    }
    function closeAsk() {
        setAsk(!ask);
    }
    const CheckNickname = (asValue: string) => {
        var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,15}$/;
        return regExp.test(asValue);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileName(e.target.value);
    };
    function closeReq() {
        setShowReq(!showReq);
    }
    const nickdata = {
        nick: profileName,
    };

    const userData: any = useQuery('userData', callUpApi.getInfoApi, {
        onSuccess: (res: any) => {
            console.log(res);
            setUserdata(res.data);
            setProfileName(res.data.nick);
        },
    });
    const nickUpdateApiFunc = () => {
        nickCheck.mutate(nickdata);
    };
    const nickCheck = useMutation(
        (nick: { nick: string }) => callUpApi.updataNickApi(nick),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('userData');
                alert('닉네임 변경이 완료되었습니다.');
                setEdit(true);
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    setTimeout(() => {
                        nickUpdateApiFunc();
                    }, 100);
                }
            },
        },
    );
    const onKeyPressNickname = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && CheckNickname(profileName)) {
            nickUpdateApiFunc();
        } else if (e.key === 'Enter' && CheckNickname(profileName) === false) {
            alert('올바른 닉네임을 입력해 주세요!');
        }
    };
    const all = window.location.href;

    const nav = useNavigate();
    const updateImg = (file: File | undefined) => {
        let formData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        updateImgData.mutate(formData);
    };
    const updateImgData = useMutation(
        (data: FormData) => callUpApi.updataImgApi(data),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('userData');
            },
            onError: (err: AxiosError) => {
                if (err.message === 'Request failed with status code 401') {
                    setTimeout(() => {
                        updateImg(file);
                    }, 100);
                }
            },
        },
    );
    const saveFileImage = (e: any) => {
        updateImg(e.target.files[0]);
        setFile(e.target.files[0]);
    };
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });

    const callApi = setupInterceptorsTo(baseApi);

    const getPlan = async ({ pageParam = 0 }) => {
        const res = await callApi.get(
            `/todo?filter=${filter}&page=${pageParam}&size=10&sort=desc`,
        );
        return {
            // 실제 데이터
            planListData: res.data.content,
            // 반환 값에 현재 페이지를 넘겨주자
            page: pageParam,
            // 페이지가 마지막인지 알려주는 서버에서 넘겨준 true/false 값
            isLast: res.data.totalPages,
        };
    };

    const { data, fetchNextPage, isSuccess, hasNextPage } = useInfiniteQuery(
        'planData',
        getPlan,
        {
            getNextPageParam: (lastPage) => {
                // lastPage와 pages는 콜백함수에서 리턴한 값을 의미한다!!
                // lastPage: 직전에 반환된 리턴값, pages: 여태 받아온 전체 페이지
                if (lastPage.page + 1 !== lastPage.isLast)
                    return lastPage.page + 1;
                // 마지막 페이지면 undefined가 리턴되어서 hasNextPage는 false가 됨!
                return undefined;
            },
        },
    );

    const deletePlanList = (id: number) => {
        deletePlan.mutate(id);
    };

    const deletePlan = useMutation(
        (id: number) => callUpApi.deletePlanApi(id),
        {
            onSuccess: (res: any) => {
                queryClient.invalidateQueries('planData');
            },
        },
    );
    useEffect(() => {
        const first = all.split('&');
        const accessToken = first[0].split('=')[1];

        if (accessToken) {
            loginToken(accessToken);
            const refreshToken = first[1].split('=')[1];
            reToken(refreshToken);
            const isNickname = first[2].split('=')[1];

            if (isNickname === 'N') {
                nav('/social');
            } else {
                window.location.replace('http://localhost:3000');
            }
        }
    }, []);
    useEffect(() => {
        // 맨 마지막 요소를 보고있고 더이상 페이지가 존재하면
        // 다음 페이지 데이터를 가져옴
        if (isView && hasNextPage) {
            fetchNextPage();
        }
    }, [isView, data]);

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
            <ExpBack>
                <label htmlFor="img">
                    <AiFillCamera size={25} className="camera" />
                </label>
                <input
                    id="img"
                    type="file"
                    accept="image/*"
                    onChange={saveFileImage}
                    style={{ display: 'none' }}
                />
                <Profileimg
                    color="white"
                    image={profile ? userdata.profileImageUrl : null}
                >
                    {!profile && (
                        <ExpPercent>
                            {'Lv : ' + userdata.characterInfo.level}
                        </ExpPercent>
                    )}
                </Profileimg>
                <ExpState onClick={() => setprofile(!profile)}>
                    <Donut exp={userdata.characterInfo?.expPercent} />
                </ExpState>
            </ExpBack>
            <ProfileNameArea>
                {edit ? (
                    <ProfileName onClick={() => setEdit(false)}>
                        {userdata.nick}
                    </ProfileName>
                ) : (
                    <ProfileNameEdit
                        type="text"
                        value={profileName}
                        onChange={onChange}
                        onKeyUp={onKeyPressNickname}
                        onClick={(e: any) => {
                            e.stopPropagation();
                        }}
                    />
                )}
                <ProfileEmail>{localToken && userdata.userId}</ProfileEmail>
            </ProfileNameArea>
            <CharactorBox>
                <Charactor
                    ani={animation}
                    src="/img/알.png"
                    onClick={() => setAnimation(!animation)}
                />
            </CharactorBox>
            <ListPosition>
                {isSuccess && data.pages
                    ? data.pages.map((value, pages) => {
                          const listPage = value.planListData;
                          return listPage.map((v: any, i: number) => {
                              if (
                                  data.pages.length - 1 === pages &&
                                  listPage.length - 1 === i
                              ) {
                                  return (
                                      <List
                                          key={i}
                                          ref={ref}
                                          onClick={
                                              !v.state
                                                  ? () => {
                                                        closeAsk();
                                                        setListId(v.todoId);
                                                    }
                                                  : () => {}
                                          }
                                      >
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

                                          <ListTitle>
                                              {v.todoContent} {v.todoDate}
                                          </ListTitle>
                                          <IconDiv>
                                              {!v.state && (
                                                  <FaPencilAlt
                                                      className="todoIcon"
                                                      size={15}
                                                      onClick={(e) => {
                                                          setListId(v.todoId);
                                                          setContent(
                                                              v.todoContent,
                                                          );
                                                          setListDate(
                                                              v.todoDate,
                                                          );
                                                          e.stopPropagation();
                                                          closeEdit();
                                                      }}
                                                  />
                                              )}

                                              <BsFillTrashFill
                                                  className="todoIcon"
                                                  size={15}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      deletePlanList(v.todoId);
                                                  }}
                                              />
                                          </IconDiv>
                                      </List>
                                  );
                              } else {
                                  return (
                                      <List
                                          key={i}
                                          onClick={
                                              !v.state
                                                  ? () => {
                                                        closeAsk();
                                                        setListId(v.todoId);
                                                    }
                                                  : () => {}
                                          }
                                      >
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

                                          <ListTitle>
                                              {v.todoContent} {v.todoDate}
                                          </ListTitle>
                                          <IconDiv>
                                              {!v.state && (
                                                  <FaPencilAlt
                                                      className="todoIcon"
                                                      size={15}
                                                      onClick={(e) => {
                                                          setListId(v.todoId);
                                                          setContent(
                                                              v.todoContent,
                                                          );
                                                          setListDate(
                                                              v.todoDate,
                                                          );
                                                          e.stopPropagation();
                                                          closeEdit();
                                                      }}
                                                  />
                                              )}
                                              <BsFillTrashFill
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      deletePlanList(v.todoId);
                                                  }}
                                                  className="todoIcon"
                                                  size={15}
                                              />
                                          </IconDiv>
                                      </List>
                                  );
                              }
                          });
                      })
                    : ''}
            </ListPosition>
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
