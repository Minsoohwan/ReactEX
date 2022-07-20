import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    BsFillCalendarXFill,
    BsFillCalendar2CheckFill,
    BsFillTrashFill,
    BsFillPeopleFill,
} from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import TopBar from '../components/TopBar';
import Title from '../components/Title';
import Dropdown from '../components/DropDown';
import '../css/icon.css';
import AppBar from '../components/AppBar';
import AddListModal from '../components/AddListModal';
import TopBack from '../components/TopBack';
import AppBack from '../components/AppBack';
import UserModal from '../components/UserMenu';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import axios, { Axios, AxiosError } from 'axios';
import setupInterceptorsTo from '../Api/Interceptors';
import { useInView } from 'react-intersection-observer';
import { callUpApi } from '../Api/callAPi';
import AskModal from '../components/AskModal';

type props = {
    color: string;
};

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
    overflow: auto;
    flex-direction: column;
    /* align-items: center; */
    border: 1px solid;
    background-image: linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.8)
        ),
        url('/background.png');
    background-size: auto;
    background-position: -60px 15px;
`;
export const List = styled.div`
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    border: 1px solid #44434332;
    margin: 5px 0;
    background-color: #44434332;
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: 10px;
    &:hover {
        background-color: #ffffff37;
    }
    &:active {
        background-color: #0338ca46;
    }
`;
export const ListTitle = styled.div`
    width: 90%;
    height: 20px;
    font-size: 15px;
    display: -webkit-box;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    font-weight: bolder !important;
    margin: 5px;
    text-align: left;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
`;
const TextDiv = styled.div`
    display: flex;
    margin: 85px 0 0 0;
    flex-direction: row;
`;
const Partition = styled.p`
    font-size: 10px;
    margin: auto 5px;
`;
const PlanText = styled.p`
    font-size: 10px;
    font-weight: 800;
    cursor: pointer;
    color: ${(props: props) => props.color};
`;
export const IconDiv = styled.div`
    display: flex;
    gap: 20px;
`;

const ListDiv = styled.div`
    display: flex;
    height: calc(100% - 170px);
    flex-direction: column;
    overflow: auto;
    ::-webkit-scrollbar {
        display: none;
    }
`;

export const Todo = () => {
    const [filter, setFilter] = useState<string>('all');
    const [showReq, setShowReq] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [listId, setListId] = useState<number>(0);
    const [content, setContent] = useState<string>('');
    const [listDate, setListDate] = useState<string>('');
    const [ask, setAsk] = useState<boolean>(false);
    const [ref, isView] = useInView();

    function closeReq() {
        setShowReq(!showReq);
    }
    function closeEdit() {
        setShowEdit(!showEdit);
    }
    function closeAsk() {
        setAsk(!ask);
    }
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });

    const callApi = setupInterceptorsTo(baseApi);

    const getPlan = async ({ pageParam = 0 }) => {
        const res = await callApi.get(
            `/todo?filter=${filter}&page=${pageParam}&size=15&sort=desc`,
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

    const { data, fetchNextPage, isSuccess, hasNextPage, refetch } =
        useInfiniteQuery('planData', getPlan, {
            getNextPageParam: (lastPage) => {
                // lastPage와 pages는 콜백함수에서 리턴한 값을 의미한다!!
                // lastPage: 직전에 반환된 리턴값, pages: 여태 받아온 전체 페이지
                if (lastPage.page + 1 !== lastPage.isLast)
                    return lastPage.page + 1;
                // 마지막 페이지면 undefined가 리턴되어서 hasNextPage는 false가 됨!
                return undefined;
            },
        });

    const queryClient = useQueryClient();

    const deletePlanList = (id: number) => {
        deletePlan.mutate(id);
    };

    const deletePlan = useMutation(
        (id: number) => callUpApi.deletePlanApi(id),
        {
            onSuccess: (res: any) => {
                queryClient.invalidateQueries('planData');
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
            },
        },
    );

    useEffect(() => {
        // 맨 마지막 요소를 보고있고 더이상 페이지가 존재하면
        // 다음 페이지 데이터를 가져옴
        if (isView && hasNextPage) {
            fetchNextPage();
        }
    }, [isView, data]);
    useEffect(() => {
        refetch();
    }, [filter]);

    return (
        <WhiteBoard>
            <TopBar />
            <Title title="Planner" />
            <TopBack />
            <UserModal />
            <TextDiv>
                <PlanText
                    color={filter === 'all' ? 'black' : '#949494'}
                    onClick={() => {
                        setFilter('all');
                    }}
                >
                    전체보기
                </PlanText>
                <Partition>|</Partition>
                <PlanText
                    color={filter === 'doingList' ? 'black' : '#949494'}
                    onClick={() => {
                        setFilter('doingList');
                    }}
                >
                    미완료
                </PlanText>
                <Partition>|</Partition>
                <PlanText
                    color={filter === 'doneList' ? 'black' : '#949494'}
                    onClick={() => {
                        setFilter('doneList');
                    }}
                >
                    완료
                </PlanText>
            </TextDiv>
            <Dropdown />
            <ListDiv>
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
                                          {v.boardId ? null : (
                                              <IconDiv>
                                                  {!v.state && (
                                                      <FaPencilAlt
                                                          className="todoIcon"
                                                          size={15}
                                                          onClick={(e) => {
                                                              setListId(
                                                                  v.todoId,
                                                              );
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
                                                          deletePlanList(
                                                              v.todoId,
                                                          );
                                                      }}
                                                      className="todoIcon"
                                                      size={15}
                                                  />
                                              </IconDiv>
                                          )}
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
                                          {v.boardId ? null : (
                                              <IconDiv>
                                                  {!v.state && (
                                                      <FaPencilAlt
                                                          className="todoIcon"
                                                          size={15}
                                                          onClick={(e) => {
                                                              setListId(
                                                                  v.todoId,
                                                              );
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
                                                          deletePlanList(
                                                              v.todoId,
                                                          );
                                                      }}
                                                      className="todoIcon"
                                                      size={15}
                                                  />
                                              </IconDiv>
                                          )}
                                      </List>
                                  );
                              }
                          });
                      })
                    : ''}
            </ListDiv>
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
