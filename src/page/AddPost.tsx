import React, { ChangeEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import AddListModal from '../components/AddListModal';
import AppBack from '../components/AppBack';
import AppBar from '../components/AppBar';
import Title from '../components/Title';
import TopBack from '../components/TopBack';
import TopBar from '../components/TopBar';
import {
    ContentProfile,
    ContentProfileImg,
    ContentProfileName,
} from './Community';
import { WhiteBoard } from './Login';
import { AiFillCamera } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import UserModal from '../components/UserMenu';
import { useRecoilState, useRecoilValue } from 'recoil';
import { shareData, userInfo } from '../recoil/store';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { board, callUpApi } from '../Api/callAPi';
import { TodoInform } from './CoummunityDetail';
import { useNavigate } from 'react-router-dom';
type props = {
    img?: string;
    border?: string;
    flex?: string;
    display?: string;
    color?: string;
};
const PostOutLine = styled.div`
    position: absolute;
    top: 120px;
    width: calc(100% - 20px);
    height: calc(100% - 200px);
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    gap: 10px;
    overflow: auto;
    ::-webkit-scrollbar {
        display: none;
    }
`;
const TextDiv = styled.div`
    position: absolute;
    display: flex;
    top: 7px;
    right: 0px;
    flex-direction: row;
    z-index: 30;
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
const PostTitleInput = styled.input`
    width: 100%;
    margin: 0 auto;
    height: 40px;
    border-radius: 10px;
    padding: 10px;
    font-size: 15px;
    border: none;
    background-color: #dbdbdb;
    &:focus {
        outline: 2px solid #0338ca46;
        background-color: white;
    }
`;
const SelectImg = styled.div`
    width: 100%;
    display: flex;
    border: ${(props: props) => props.border};
    border-radius: 10px;
    padding: 10px;
    flex-direction: ${(props: props) => props.flex};
    justify-content: center;
    align-items: center;
`;

const ImgDiv = styled.div`
    display: ${(props: props) => props.display};
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Img = styled.img`
    max-width: 100%;
    max-height: 100%;
`;
const ButtonDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;
const DisplayButton = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    font-size: 15px;
    color: #ffffff;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #4d4ae4;
    border: 1px solid #4d4ae4;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
        background-color: #ffffff;
        color: #000000;
    }
    &:active {
        background-color: #4d4ae4;
        color: #ffffff;
    }
`;
const DeleteButton = styled.button`
    display: ${(props: props) => props.display};
    width: 100%;
    height: 40px;
    font-size: 15px;
    color: #ffffff;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #e44a4a;
    border: 1px solid red;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
        background-color: #ffffff;
        color: #000000;
    }
    &:active {
        background-color: #e44a4a;
        color: #ffffff;
    }
`;
const Content = styled.textarea`
    max-width: 100%;
    min-width: 100%;
    min-height: 120px;
    margin: 0 auto;
    border-radius: 10px;
    padding: 10px;
    border: none;
    background-color: #dbdbdb;
    &:focus {
        outline: 2px solid #0338ca46;
        background-color: white;
    }
`;
const ScheduleButton = styled.button`
    width: 100%;
    min-height: 40px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    color: white;
    margin: 10px auto;
    background-color: #272626;
    cursor: pointer;
    &:hover {
        background-color: #444343;
    }
    &:active {
        background-color: #272626;
    }
`;
const PostButton = styled.button`
    width: 100%;
    min-height: 40px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    color: white;
    margin: 10px auto;
    background-color: #272626;
    cursor: pointer;
    &:hover {
        background-color: #444343;
    }
    &:active {
        background-color: #272626;
    }
`;
export const AddPost = () => {
    const [showReq, setShowReq] = useState<boolean>(false);
    const [showShare, setShowShare] = useState<boolean>(false);
    const [viewImg, setViewImg] = useState<string>('');
    const [display, setDisplay] = useState<boolean>(true);
    const [type, setType] = useState<string>('CHALLENGE');
    const [text, setText] = useState<{ title: string; content: string }>({
        title: '',
        content: '',
    });
    const [userdata, setUserdata] = useRecoilState(userInfo);
    const [shareDataSet, setShareDataSet] = useRecoilState(shareData);
    const inputImg: any = useRef();
    const nav = useNavigate();
    const userData: any = useQuery('userData', callUpApi.getInfoApi, {
        onSuccess: (res: any) => {
            setUserdata(res.data);
        },
    });
    function closeReq() {
        setShowReq(!showReq);
    }
    function closeShare() {
        setShowShare(!showShare);
    }
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setText({ ...text, title: e.target.value });
    };
    const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText({ ...text, content: e.target.value });
    };
    const view = (e: any) => {
        saveImgFunc(e.target.files[0]);
        setViewImg(URL.createObjectURL(e.target.files[0]));
    };
    const deleteFileImage = () => {
        URL.revokeObjectURL(viewImg);
        setViewImg('');
    };

    const saveImgFunc = (data: File) => {
        let formData = new FormData();

        formData.append('file', data);

        saveImg.mutate(formData);
    };
    const saveImg = useMutation(
        (data: FormData) => callUpApi.saveImageApi(data),
        {
            onSuccess: (res) => {
                setViewImg(res.data);
            },
        },
    );
    const postData = {
        board: {
            category: type,
            content: text.content,
            imageUrl: viewImg,
            title: text.title,
        },
        todo: {
            category: shareDataSet?.category,
            content: shareDataSet?.content,
            todoDateList: shareDataSet?.todoDateList,
        },
    };
    const queryClient = useQueryClient();
    const addPostFunc = () => {
        addPost.mutate(postData);
    };
    const addPost = useMutation((data: board) => callUpApi.addBoardApi(data), {
        onSuccess: (res) => {
            alert(res.data);
            queryClient.invalidateQueries('boardData');
            nav('/community');
        },
    });
    return (
        <WhiteBoard>
            <TopBar />
            <Title title="Write" />
            <TopBack />
            <UserModal />
            <PostOutLine>
                <TextDiv>
                    <PlanText
                        color={type === 'CHALLENGE' ? 'black' : '#949494'}
                        onClick={() => {
                            setType('CHALLENGE');
                        }}
                    >
                        참여형
                    </PlanText>
                    <Partition>|</Partition>
                    <PlanText
                        color={type === 'DAILY' ? 'black' : '#949494'}
                        onClick={() => {
                            setType('DAILY');
                            setShareDataSet(null);
                        }}
                    >
                        일상
                    </PlanText>
                </TextDiv>
                <ContentProfile>
                    <ContentProfileImg backImg={userdata.profileImageUrl} />
                    <ContentProfileName>{userdata.nick}</ContentProfileName>
                </ContentProfile>
                <PostTitleInput
                    placeholder="제목을 입력해주세요."
                    onChange={onChangeTitle}
                    value={text.title}
                />
                {viewImg === '' ? (
                    <label htmlFor="img">
                        <SelectImg border="1px dashed" flex="row">
                            <AiFillCamera />
                            사진을 선택해 주세요.
                        </SelectImg>
                    </label>
                ) : (
                    <SelectImg border="none" flex="column">
                        <ImgDiv display={display ? 'flex' : 'none'}>
                            <label htmlFor="img">
                                <Img src={viewImg} />
                            </label>
                        </ImgDiv>
                        <ButtonDiv>
                            <DisplayButton onClick={() => setDisplay(!display)}>
                                {display ? '접어두기' : '보이기'}
                            </DisplayButton>
                            <DeleteButton
                                display={display ? 'flex' : 'none'}
                                onClick={() => {
                                    deleteFileImage();
                                    inputImg.current.value = '';
                                }}
                            >
                                <BsFillTrashFill size={15} />
                                이미지 지우기
                            </DeleteButton>
                        </ButtonDiv>
                    </SelectImg>
                )}

                <input
                    id="img"
                    type="file"
                    accept="image/*"
                    ref={inputImg}
                    onChange={view}
                    style={{ display: 'none' }}
                />
                <Content
                    placeholder="내용을 입력해주세요."
                    value={text.content}
                    onChange={onChangeContent}
                ></Content>
                {type === 'CHALLENGE' && (
                    <>
                        <ScheduleButton onClick={() => closeShare()}>
                            {shareDataSet ? '일정 변경하기' : '일정 추가하기'}
                        </ScheduleButton>
                        {shareDataSet && (
                            <TodoInform>
                                <div>catagory : {shareDataSet.category}</div>
                                <div>{shareDataSet.content}</div>
                                <div>
                                    {shareDataSet.todoDateList.length > 1
                                        ? shareDataSet.todoDateList[0] +
                                          '~' +
                                          shareDataSet.todoDateList[
                                              shareDataSet.todoDateList.length -
                                                  1
                                          ]
                                        : shareDataSet.todoDateList[0]}
                                </div>
                            </TodoInform>
                        )}
                    </>
                )}
                <PostButton
                    onClick={() => {
                        addPostFunc();
                    }}
                >
                    작성하기
                </PostButton>
            </PostOutLine>

            <AddListModal
                title="공유 일정 추가하기"
                open={showShare}
                close={closeShare}
                type="share"
            />

            <AppBack />
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
