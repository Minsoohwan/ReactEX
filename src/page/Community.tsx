import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddListModal from '../components/AddListModal';
import AppBar from '../components/AppBar';
import SearchingDropDown from '../components/SearchingDropDown';
import Title from '../components/Title';
import TopBar from '../components/TopBar';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdEmojiPeople } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import TopBack from '../components/TopBack';
import AppBack from '../components/AppBack';
import { BsPlusSquare } from 'react-icons/bs';
import UserModal from '../components/UserMenu';
import setupInterceptorsTo from '../Api/Interceptors';
import axios from 'axios';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';

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

const SearchingDiv = styled.div`
    position: relative;
    height: 100px;
    margin: 90px 0 0 0;
    display: flex;
    padding: 10px;
`;
const SearchingInputPosition = styled.div`
    position: absolute;
    left: 100px;
    width: calc(100% - 170px);
    display: flex;
`;
const SearchingInput = styled.input`
    width: 100%;
    height: 30px;
    padding: 5px;
    background-color: #9eb1e746;
    border-radius: 5px;
    border: none;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
        background-color: white;
    }
`;
const SearchingButton = styled.button`
    position: absolute;
    right: 10px;
    width: 50px;
    height: 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #d4d4d4;
    }
    &:active {
        background-color: #ffffff;
    }
`;
const AddPostButton = styled.button`
    position: absolute;
    top: 56px;
    right: 10px;
    border: 1px solid;
    border-radius: 50%;
    padding: 10px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #444343;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #ffffff;
        color: black;
    }
    &:active {
        background-color: #444343;
        color: white;
    }
    z-index: 999;
`;
type props = {
    color: string;
};
const TextDiv = styled.div`
    position: absolute;
    display: flex;
    top: 50px;
    flex-direction: row;
`;
const PlanText = styled.p`
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    color: ${(props: props) => props.color};
`;
const Partition = styled.p`
    font-size: 15px;
    margin: auto 5px;
`;
export const ContentOutLine = styled.div`
    position: absolute;
    top: 190px;
    width: calc(100% - 20px);
    height: calc(100% - 250px);
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar {
        display: none;
    }
    /* background-color: green; */
`;
const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    background-color: #bbbbbb56;
    cursor: pointer;
    padding: 10px;
    &:hover {
        background-color: #bbbbbb;
    }
    &:active {
        background-color: #bbbbbb56;
    }
`;
export const ContentProfile = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    margin-bottom: 10px;
    flex-direction: row;
    cursor: pointer;
`;
type img = {
    backImg?: string;
};
export const ContentProfileImg = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-image: url(${(props: img) => props.backImg});
    background-position: center;
    background-size: cover;
`;

export const ContentProfileName = styled.div`
    display: flex;
    margin: auto 5px;
    font-size: 15px;
    font-weight: bold;
`;
export const DateDiv = styled.div`
    font-weight: 800;
    font-size: 10px;
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
    width: 70%;
    height: 30px;
    font-size: 23px;
    overflow: hidden;
    display: -webkit-box;
    font-weight: 900 !important;
    margin: 5px;
    text-align: left;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
`;
const Content = styled.div`
    width: 100%;
    overflow: hidden;
    font-size: 15px;
    color: gray;
    display: -webkit-box;
    margin: 5px;
    text-align: left;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
`;
const Count = styled.div`
    margin-left: 5px;
    font-size: 20px;
    font-weight: bold;
`;
export const Community = () => {
    const [showReq, setShowReq] = useState<boolean>(false);
    const [select, setSelect] = useState<string>('all');
    const [ref, isView] = useInView();
    const nav = useNavigate();

    function closeReq() {
        setShowReq(!showReq);
    }
    const baseApi = axios.create({
        baseURL: 'https://todowith.shop',
        timeout: 1000,
    });

    const callApi = setupInterceptorsTo(baseApi);
    const getBoard = async ({ pageParam = 0 }) => {
        const res = await callApi.get(
            `/board?size=10&page=${pageParam}&filter=${select}`,
        );

        return {
            // 실제 데이터
            boardListData: res.data.content,
            // 반환 값에 현재 페이지를 넘겨주자
            page: pageParam,
            // 페이지가 마지막인지 알려주는 서버에서 넘겨준 true/false 값
            isLast: res.data.totalPages,
        };
    };

    const { data, fetchNextPage, isSuccess, hasNextPage, refetch } =
        useInfiniteQuery(
            'boardData',

            getBoard,

            {
                getNextPageParam: (lastPage) => {
                    console.log(lastPage);
                    // lastPage와 pages는 콜백함수에서 리턴한 값을 의미한다!!
                    // lastPage: 직전에 반환된 리턴값, pages: 여태 받아온 전체 페이지
                    if (lastPage.page + 1 !== lastPage.isLast)
                        return lastPage.page + 1;
                    // 마지막 페이지면 undefined가 리턴되어서 hasNextPage는 false가 됨!
                    return undefined;
                },
                // refetchInterval: 1,
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
    }, [select]);
    return (
        <WhiteBoard>
            <TopBar />
            <Title title="Community" />
            <TopBack />
            <UserModal />

            <SearchingDiv>
                <SearchingDropDown />
                <SearchingInputPosition>
                    <SearchingInput placeholder="내용을 입력해 주세요." />
                </SearchingInputPosition>
                <SearchingButton>
                    <AiOutlineSearch size={18} />
                </SearchingButton>
                <TextDiv>
                    <PlanText
                        color={select === 'all' ? 'black' : '#949494'}
                        onClick={() => {
                            setSelect('all');
                        }}
                    >
                        전체보기
                    </PlanText>
                    <Partition>|</Partition>
                    <PlanText
                        color={select === 'challenge' ? 'black' : '#949494'}
                        onClick={() => {
                            setSelect('challenge');
                        }}
                    >
                        참여형
                    </PlanText>
                    <Partition>|</Partition>
                    <PlanText
                        color={select === 'daily' ? 'black' : '#949494'}
                        onClick={() => {
                            setSelect('daily');
                        }}
                    >
                        일상
                    </PlanText>
                    <Partition>|</Partition>
                    <PlanText
                        color={select === 'my' ? 'black' : '#949494'}
                        onClick={() => {
                            setSelect('my');
                        }}
                    >
                        내 게시글
                    </PlanText>
                </TextDiv>
                <AddPostButton
                    onClick={() => {
                        nav('/post');
                    }}
                >
                    <BsPlusSquare />
                </AddPostButton>
            </SearchingDiv>
            <ContentOutLine>
                {isSuccess && data.pages
                    ? data.pages.map((value, pages) => {
                          const listPage = value.boardListData;
                          return listPage.map((v: any, i: number) => {
                              if (
                                  data.pages.length - 1 === pages &&
                                  listPage.length - 1 === i
                              ) {
                                  return (
                                      <ContentDiv
                                          key={i}
                                          ref={ref}
                                          onClick={() =>
                                              nav(`/community/${v.boardId}`)
                                          }
                                      >
                                          <ContentProfile>
                                              <ContentProfileImg
                                                  backImg={
                                                      v.authorProfileImageUrl
                                                  }
                                              />
                                              <ContentProfileName>
                                                  {v.authorNick}
                                              </ContentProfileName>
                                              {v.category === 'CHALLENGE' ? (
                                                  <div
                                                      style={{
                                                          margin: 'auto 10px auto auto',
                                                          display: 'flex',
                                                          flexDirection:
                                                              'column',
                                                          alignItems: 'center',
                                                          justifyContent:
                                                              'center',
                                                      }}
                                                  >
                                                      <ContentType>
                                                          참여형
                                                      </ContentType>
                                                      <DateDiv>
                                                          2022.07.16
                                                      </DateDiv>
                                                  </div>
                                              ) : (
                                                  <div
                                                      style={{
                                                          margin: 'auto 10px auto auto',
                                                          display: 'flex',
                                                          flexDirection:
                                                              'column',
                                                          alignItems: 'center',
                                                          justifyContent:
                                                              'center',
                                                      }}
                                                  >
                                                      <DateDiv>
                                                          2022.07.16
                                                      </DateDiv>
                                                  </div>
                                              )}
                                          </ContentProfile>
                                          <ContentImg src={v.imageUrl} />
                                          <ContentTitle>{v.title}</ContentTitle>
                                          <Content>{v.boardContent}</Content>
                                          <Count>
                                              <MdEmojiPeople size={20} />
                                              {v.participatingCount}
                                          </Count>
                                      </ContentDiv>
                                  );
                              } else {
                                  return (
                                      <ContentDiv
                                          key={i}
                                          onClick={() =>
                                              nav(`/community/${v.boardId}`)
                                          }
                                      >
                                          <ContentProfile>
                                              <ContentProfileImg
                                                  backImg={
                                                      v.authorProfileImageUrl
                                                  }
                                              />

                                              <ContentProfileName>
                                                  {v.authorNick}
                                              </ContentProfileName>

                                              {v.category === 'CHALLENGE' ? (
                                                  <div
                                                      style={{
                                                          margin: 'auto 10px auto auto',
                                                          display: 'flex',
                                                          flexDirection:
                                                              'column',
                                                          alignItems: 'center',
                                                          justifyContent:
                                                              'center',
                                                      }}
                                                  >
                                                      <ContentType>
                                                          참여형
                                                      </ContentType>
                                                      <DateDiv>
                                                          2022.07.16
                                                      </DateDiv>
                                                  </div>
                                              ) : (
                                                  <div
                                                      style={{
                                                          margin: 'auto 10px auto auto',
                                                          display: 'flex',
                                                          flexDirection:
                                                              'column',
                                                          alignItems: 'center',
                                                          justifyContent:
                                                              'center',
                                                      }}
                                                  >
                                                      <DateDiv>
                                                          2022.07.16
                                                      </DateDiv>
                                                  </div>
                                              )}
                                          </ContentProfile>
                                          <ContentImg src={v.imageUrl} />
                                          <ContentTitle>{v.title}</ContentTitle>
                                          <Content>{v.boardContent}</Content>
                                          <Count>
                                              <MdEmojiPeople size={20} />
                                              {v.participatingCount}
                                          </Count>
                                      </ContentDiv>
                                  );
                              }
                          });
                      })
                    : ''}
            </ContentOutLine>
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
