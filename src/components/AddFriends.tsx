import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { callUpApi } from '../Api/callAPi';

interface props {
    open: boolean;
    close: () => void;
}

const ModalOutLine = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 20px;
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    gap: 10px;
`;

const NickInput = styled.input`
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 10px;
    background-color: #bbbbbb;
    height: 50px;
    text-align: center;
    &:focus {
        background-color: #0338ca46;
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
    &::placeholder {
        color: white;
    }
`;
const AddSend = styled.button`
    width: 100%;
    height: 50px;
    border-radius: 10px;
    border: none;
    padding: 10px;
    font-size: 15px;
    font-weight: bold;
    background-color: #272626;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #999999;
    }
    &:active {
        background-color: #272626;
    }
`;

const AddFriends = (props: props) => {
    const { open, close } = props;
    const [nick, setNick] = useState<string>('');
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNick(e.target.value);
    };
    const friendsRequest = (data: { nick: string }) => {
        request.mutate(data);
    };
    const request = useMutation(
        (data: { nick: string }) => callUpApi.requestFriendsApi(data),
        {
            onSuccess: () => {
                close();
            },
            onError: (res: AxiosError) => {
                if (res.message === 'Request failed with status code 401') {
                    alert('로그인이 갱신되었습니다. 다시 시도해 주세요.');
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
                <ModalOutLine
                    onClick={(e: any) => {
                        e.stopPropagation();
                    }}
                >
                    <h3 style={{ margin: '10px' }}>친구 추가 하기</h3>
                    <NickInput
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        onChange={onChange}
                    />
                    <AddSend onClick={() => friendsRequest({ nick: nick })}>
                        친구 요청
                    </AddSend>
                </ModalOutLine>
            )}
        </div>
    );
};

export default AddFriends;
