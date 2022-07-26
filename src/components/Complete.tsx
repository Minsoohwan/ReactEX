import React from 'react';
import styled, { keyframes } from 'styled-components';
import '../css/modal.css';
interface props {
    open: boolean;
    close: () => void;
    exercise: number;
    study: number;
    plan: number;
    shopping: number;
}
const openAni = keyframes`
    0%{
        width: 0;
        height: 2px;
    }

    20%{
        width: calc(100% - 20px);
        height: 2px;

    }
    100%{
        width: calc(100% - 20px);
    height: 15%;
    }
`;
const openCompleteAni = keyframes`
    0%{
        width: 20%;
        height: 0
    }
    20%{
        width: 20%;
        height: 0

    }
    100%{
        width: 20%;
    height: 80%;
    }
`;
const CompleteOutLine = styled.div`
    width: calc(100% - 20px);
    height: 15%;
    overflow: hidden;
    column-gap: 25px;
    border-radius: 20px;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    animation: ${openAni} 1s ease;
`;
const CompleteContent = styled.div`
    width: 20%;
    height: 80%;
    overflow: hidden;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${openCompleteAni} 1s ease;
`;
const Img = styled.img`
    width: 60%;
`;
const Complete = (props: props) => {
    const { open, close, exercise, study, plan, shopping } = props;
    return (
        <div
            onClick={() => {
                close();
            }}
            style={open ? { height: '100%' } : {}}
            className={open ? 'bg' : ''}
        >
            {open && (
                <CompleteOutLine
                    onClick={(e: any) => {
                        e.stopPropagation();
                    }}
                >
                    <CompleteContent>
                        <Img src="/img/exercise.png" />
                        {exercise}
                    </CompleteContent>
                    <CompleteContent>
                        <Img src="/img/studying.png" />
                        {study}
                    </CompleteContent>
                    <CompleteContent>
                        <Img src="/img/planner.png" />
                        {plan}
                    </CompleteContent>
                    <CompleteContent>
                        <Img src="/img/trolley.png" />
                        {shopping}
                    </CompleteContent>
                </CompleteOutLine>
            )}
        </div>
    );
};
export default Complete;
