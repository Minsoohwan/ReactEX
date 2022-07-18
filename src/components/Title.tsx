import React from 'react';
import styled from 'styled-components';
import { IoIosArrowBack } from 'react-icons/io';
import '../css/icon.css';
import { useNavigate } from 'react-router-dom';

const TitleDiv = styled.div`
    position: fixed;
    top: 20px;
    max-width: 748px;
    min-width: 355px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    z-index: 100;
`;
const PageTitle = styled.h2`
    font-weight: 700;
    margin: 0 0 10px 0;
`;
type props = {
    title: string;
};
const Title = (props: props) => {
    const { title } = props;
    const nav = useNavigate();
    return (
        <TitleDiv>
            <PageTitle>{title}</PageTitle>
            <IoIosArrowBack
                className="icon"
                size={30}
                onClick={() => nav(-1)}
            />
            <hr style={{ width: '100%', margin: '0px' }} />
        </TitleDiv>
    );
};

export default Title;
