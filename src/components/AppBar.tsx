import React from 'react';
import styled from 'styled-components';
import { AiOutlineHome } from 'react-icons/ai';
import { AiOutlineSchedule } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { calenderState, dateState, userModal } from '../recoil/store';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChat } from 'react-icons/hi';

const Bottom = styled.div`
    position: fixed;
    bottom: 0px;
    max-width: 748px;
    min-width: 355px;
    border-bottom: 1px solid;
    width: 94.7%;
    height: 60px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
`;

const Div = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
`;
interface props {
    close: () => void;
}
const AppBar = (props: props) => {
    const { close } = props;
    const setShowUserModal = useSetRecoilState(userModal);
    const [, setDate] = useRecoilState<string[]>(dateState);
    const [, setShowReq] = useRecoilState<boolean>(calenderState);
    const nav = useNavigate();
    return (
        <Bottom onClick={() => setShowUserModal(false)}>
            <Div onClick={() => nav('/')}>
                <AiOutlineHome size="30" cursor={'pointer'} />홈
            </Div>
            <Div onClick={() => nav('/community')}>
                <BsPeople size="30" cursor={'pointer'} />
                게시판
            </Div>
            <Div
                onClick={() => {
                    close();
                    setDate([]);
                    setShowReq(false);
                }}
            >
                <AiOutlinePlusCircle size="30" cursor={'pointer'} />
                추가
            </Div>
            <Div onClick={() => nav('/todo')}>
                <AiOutlineSchedule size="30" cursor={'pointer'} />
                계획
            </Div>
            <Div onClick={() => nav('/chat')}>
                <HiOutlineChat size="30" cursor={'pointer'} />
                채팅
            </Div>
        </Bottom>
    );
};

export default AppBar;
