import { AxiosError } from 'axios';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled, { keyframes } from 'styled-components';
import { callUpApi } from '../Api/callAPi';

interface props {
    open: boolean;
    close: () => void;
    id: number;
}

const show = keyframes`
    0%{
        height: 0%;
        width: 0%;
    }
    100%{
        width: 300px;
        height: 150px;
    }
`;
const ModalLayout = styled.div`
    width: 300px;
    height: 150px;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    gap: 20px;
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    animation: ${show} 0.3s ease;
`;
const AskTitle = styled.h3`
    width: 220px;
    margin: 0;
`;
const ButtonDiv = styled.div`
    display: flex;
    width: 200px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
type propsStyle = {
    color?: string;
    hoverColor?: string;
    backColor?: string;
    hoverBackColor?: string;
    display?: string;
    url?: string;
};
const Button = styled.button`
    width: 65px;
    height: 35px;
    font-size: 15px;
    border: 2px solid ${(props: propsStyle) => props.backColor};
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    color: ${(props: propsStyle) => props.color};
    background-color: ${(props: propsStyle) => props.backColor};
    &:hover {
        color: ${(props: propsStyle) => props.hoverColor};
        background-color: ${(props: propsStyle) => props.hoverBackColor};
    }
    &:active {
        color: ${(props: propsStyle) => props.color};
        background-color: ${(props: propsStyle) => props.backColor};
    }
`;
const AskModal = (props: props) => {
    const { open, close, id } = props;
    const queryClient = useQueryClient();
    const completePlan = () => {
        complete.mutate(id);
    };
    const complete = useMutation(
        (id: number) => callUpApi.completePlanApi(id),
        {
            onSuccess: (res) => {
                queryClient.invalidateQueries('planData');
                console.log(res);
            },
            onError: (err: AxiosError) => {
                if (err.message === 'Request failed with status code 401') {
                    setTimeout(() => {
                        completePlan();
                    }, 100);
                }
            },
        },
    );
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
                <ModalLayout onClick={(e) => e.stopPropagation()}>
                    <AskTitle>일정을 완료하시겠습니까?</AskTitle>
                    <ButtonDiv>
                        <Button
                            color="white"
                            hoverColor="black"
                            backColor="#4d4ae4"
                            hoverBackColor="white"
                            onClick={() => {
                                completePlan();

                                close();
                            }}
                        >
                            완료
                        </Button>
                        <Button
                            color="white"
                            hoverColor="black"
                            backColor="#e44a4a"
                            hoverBackColor="white"
                            onClick={close}
                        >
                            취소
                        </Button>
                    </ButtonDiv>
                </ModalLayout>
            )}
        </div>
    );
};

export default AskModal;
