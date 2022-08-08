import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import '../css/modal.css';

interface props {
    open: boolean;
    close: () => void;
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
    height: 400px;
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
    margin-top: 10px;
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

const ChatJoin = (props: props) => {
    const { open, close } = props;
    return (
        <div
            onClick={() => {
                close();
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
                    <h3>일정 추가하기</h3>

                    <SelectButton
                        onClick={() => {
                            close();
                            alert('작성 완료!');
                        }}
                    >
                        선택하기
                    </SelectButton>
                </ModalLayout>
            )}
        </div>
    );
};

export default ChatJoin;
