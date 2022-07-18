import React from 'react';
import styled from 'styled-components';
import { AiOutlineNotification } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';

import { GiThreeFriends } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userModal } from '../recoil/store';

const Top = styled.div`
    position: fixed;
    top: 10px;
    max-width: 748px;
    min-width: 355px;
    width: 94.7%;
    display: flex;
    justify-content: space-between;
    z-index: 50;
`;

const Div = styled.div`
    display: flex;
    gap: 20px;
`;

const AppName = styled.h3`
    font-weight: 1000;
    margin: auto 0 auto 10px;
`;

const TopBar = () => {
    const nav = useNavigate();
    const [showUserModal, setShowUserModal] = useRecoilState(userModal);
    return (
        <Top>
            <AppName>JUST DO IT!</AppName>
            <Div>
                <div>
                    <GiThreeFriends
                        size={25}
                        cursor="pointer"
                        onClick={() => nav('/friends')}
                    />
                </div>
                <div>
                    <AiOutlineNotification size={25} cursor="pointer" />
                </div>
                <div>
                    <CgProfile
                        size={25}
                        cursor="pointer"
                        onClick={() => setShowUserModal(!showUserModal)}
                    />
                </div>
            </Div>
        </Top>
    );
};

export default TopBar;
