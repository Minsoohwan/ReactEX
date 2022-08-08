import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import '../css/modal.css';
import Calender from './Calender';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { calenderState, dateState, shareData } from '../recoil/store';
import { useMutation, useQueryClient } from 'react-query';
import { callUpApi, editPlan, plan } from '../Api/callAPi';
import { AxiosError } from 'axios';
interface props {
    open: boolean;
    close: () => void;
    title: string;
    type: string;
    propsContent?: string;
    todoId?: number;
    listDate?: string;
}
const Slide = keyframes`
    0% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(0);
    }
`;
const ModalLayout = styled.div`
    position: absolute;
    left: 0;
    bottom: 0px;
    min-width: 375px;
    width: 100%;
    height: 380px;
    padding-left: 20px;
    padding-right: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: #ffffff;
    animation: ${Slide} 0.6s ease;
`;
const AreaTitle = styled.h5`
    font-size: 12px;
    margin-bottom: 8px;
`;
const PlanInput = styled.input`
    width: 100%;
    height: 30px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid #857f7f7f;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
`;
const DatePosition = styled.div`
    display: flex;
    flex-direction: row;
`;
const DateTextPosition = styled.div`
    display: flex;
    font-weight: 500;
    border-radius: 10px;
    border: none;
    margin: 4px 0 4px 10px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 15px;
`;
const CalenderPosition = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0px;
    left: 0;
`;
const CatagoriBox = styled.div`
    width: 100%;
    padding: 7.5px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;
type img = {
    back: string;
};
const CatagoriButton = styled.button`
    width: 100px;
    height: 40px;
    font-size: 18px;
    font-weight: 550;
    border-radius: 10px;
    border: 1px solid;
    background-image: linear-gradient(
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.2)
        ),
        url(${(props: img) => props.back});
    background-size: cover;
    cursor: pointer;
    &:hover {
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.8),
                rgba(255, 255, 255, 0.8)
            ),
            url(${(props: img) => props.back});
    }
    &:active {
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.2),
                rgba(255, 255, 255, 0.2)
            ),
            url(${(props: img) => props.back});
    }
`;

const SelectButton = styled.button`
    width: 100%;
    height: 40px;
    font-size: 15px;
    font-weight: 700;
    margin-top: 20px;
    border: none;
    border-radius: 15px;
    background-color: #d4edf07d;
    cursor: pointer;
    &:hover {
        background-color: #f3e8d9;
        border: 2px solid #0338ca46;
    }
    &:active {
        background-color: #d4edf07d;
    }
`;

const AddListModal = (props: props) => {
    const { open, close, title, type, propsContent, todoId, listDate } = props;
    const [showReq, setShowReq] = useRecoilState<boolean>(calenderState);
    const [content, setContent] = useState<any>('');
    const [categori, setCategori] = useState<string>('');
    const [date, setDate] = useRecoilState<string[]>(dateState);
    const setShareDataSet = useSetRecoilState(shareData);
    function closeReq() {
        setShowReq(!showReq);
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };
    const queryClient = useQueryClient();

    const planData = {
        category: categori,
        content: content,
        todoDateList: date,
    };
    const addPlanList = () => {
        addPlan.mutate(planData);
    };
    const addPlan = useMutation((data: plan) => callUpApi.addPlanApi(data), {
        onSuccess: (res) => {
            setContent('');
            queryClient.invalidateQueries('planData');
            close();
            alert(res.data);
        },
        onError: (res: AxiosError) => {
            if (res.message === 'Request failed with status code 401') {
                setTimeout(() => {
                    addPlanList();
                }, 100);
            }
        },
    });
    const editData = {
        data: {
            category: categori,
            content: content,
            todoDate: listDate,
        },
        id: todoId,
    };
    const editPlanList = () => {
        editPlan.mutate(editData);
    };
    const editPlan = useMutation(
        (data: editPlan) => callUpApi.editPlanApi(data),
        {
            onSuccess: (res) => {
                setContent('');
                queryClient.invalidateQueries('planData');
                close();
                alert(res.data);
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    setTimeout(() => {
                        editPlanList();
                    }, 100);
                }
            },
        },
    );
    useEffect(() => {
        if (type === 'Edit') {
            setContent(propsContent);
        }
    }, [propsContent]);
    return (
        <div
            onClick={() => {
                close();
                setShowReq(false);
                setDate([]);
            }}
            style={{
                height: 'calc(100% - 60px)',
                position: 'absolute',
                top: '0',
                zIndex: '100',
            }}
            className={open ? 'bg' : ''}
        >
            {open && (
                <ModalLayout
                    onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                    ) => {
                        e.stopPropagation();
                    }}
                >
                    <h3>{title}</h3>
                    <AreaTitle>내용</AreaTitle>
                    <AiOutlineCloseCircle
                        className="modalIcon"
                        size={25}
                        onClick={close}
                    />
                    <PlanInput
                        placeholder="일정 내용을 입력해 주세요."
                        value={content}
                        onChange={onChange}
                    />

                    <AreaTitle>
                        {type === 'Edit' ? '날짜' : '기간 선택'}
                    </AreaTitle>
                    <DatePosition>
                        <BsCalendarDate
                            className="calendar"
                            size={25}
                            onClick={
                                type !== 'Edit'
                                    ? () => {
                                          closeReq();
                                      }
                                    : () => {}
                            }
                        />
                        {showReq && (
                            <CalenderPosition
                                onClick={() => {
                                    setShowReq(false);
                                }}
                            >
                                <Calender />
                            </CalenderPosition>
                        )}
                        <DateTextPosition>
                            {type === 'Edit'
                                ? listDate
                                : date[0] !== undefined &&
                                  date[0] + ' ~ ' + date[date.length - 1]}
                        </DateTextPosition>
                    </DatePosition>
                    <AreaTitle>카테고리 {categori}</AreaTitle>
                    <CatagoriBox>
                        <CatagoriButton
                            back={'/img/운동.jpg'}
                            onClick={() => setCategori('EXERCISE')}
                        >
                            운동
                        </CatagoriButton>
                        <CatagoriButton
                            back={'/img/공부.jpg'}
                            onClick={() => setCategori('STUDY')}
                        >
                            공부
                        </CatagoriButton>

                        <CatagoriButton
                            back={'/img/일상.jpg'}
                            onClick={() => setCategori('PROMISE')}
                        >
                            일상
                        </CatagoriButton>
                        <CatagoriButton
                            back={'/img/쇼핑.jpg'}
                            onClick={() => setCategori('SHOPPING')}
                        >
                            쇼핑
                        </CatagoriButton>
                    </CatagoriBox>
                    <SelectButton
                        onClick={
                            type === 'add'
                                ? () => {
                                      addPlanList();
                                  }
                                : type === 'Edit'
                                ? () => {
                                      editPlanList();
                                  }
                                : () => {
                                      setShareDataSet(planData);
                                      close();
                                  }
                        }
                    >
                        선택하기
                    </SelectButton>
                </ModalLayout>
            )}
        </div>
    );
};

export default AddListModal;
