import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
    position: fixed;
    top: 11px;
    width: 100%;
    margin: -10px 0px 0 -10px;
    max-width: 767px;
    min-width: 376px;
    border-right: 1px solid;

    height: 90px;
    z-index: 1;
    background-color: #ffffff;
`;

const TopBack = () => {
    return <Background />;
};

export default TopBack;
