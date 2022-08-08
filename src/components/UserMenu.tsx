import React from 'react';
import { useRecoilState } from 'recoil';
import styled, { keyframes } from 'styled-components';
import { userModal } from '../recoil/store';
import { RiLogoutBoxRLine, RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const show = keyframes`
    0%{
        height: 0%;
    }
    100%{
        height: 90px;
    }
`;

const MenuOutLine = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    gap: 5px;
    overflow: hidden;
    animation: ${show} 0.3s ease;
`;
const Menu = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    cursor: pointer;
`;

const UserModal = () => {
    const [showUserModal, setShowUserModal] = useRecoilState(userModal);
    const nav = useNavigate();
    return (
        <div
            onClick={() => {
                setShowUserModal(false);
            }}
            style={{
                height: 'calc(100% - 60px)',
                position: 'absolute',
                top: '0',
                zIndex: '100',
            }}
            className={showUserModal ? 'sbg' : ''}
        >
            {showUserModal && (
                <MenuOutLine
                    onClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                    ) => {
                        e.stopPropagation();
                    }}
                >
                    <Menu
                        onClick={() => {
                            nav('/changepassword');
                            setShowUserModal(false);
                        }}
                    >
                        비밀번호 변경
                        <RiLockPasswordLine />
                    </Menu>
                    <hr style={{ width: '100%' }} />
                    <Menu
                        onClick={() => {
                            localStorage.clear();
                            setShowUserModal(false);
                            nav('/login');
                        }}
                    >
                        로그아웃
                        <RiLogoutBoxRLine />
                    </Menu>
                </MenuOutLine>
            )}
        </div>
    );
};

export default UserModal;
