import React, { PropsWithChildren, useState } from 'react';
import styled from 'styled-components';
import AddListModal from '../components/AddListModal';
import AppBack from '../components/AppBack';
import AppBar from '../components/AppBar';
import Title from '../components/Title';
import TopBack from '../components/TopBack';
import TopBar from '../components/TopBar';
import UserModal from '../components/UserMenu';

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
const CommonLayout = ({
    children,
    title,
}: {
    children: any;
    title: string;
}) => {
    const [showReq, setShowReq] = useState<boolean>(false);

    function closeReq() {
        setShowReq(!showReq);
    }
    return (
        <WhiteBoard>
            <TopBar />
            <Title title={title} />
            <TopBack />
            <UserModal />
            {children}
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

export default CommonLayout;
