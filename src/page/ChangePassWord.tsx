import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { callUpApi } from '../Api/callAPi';
import AddListModal from '../components/AddListModal';
import AppBack from '../components/AppBack';
import AppBar from '../components/AppBar';
import Title from '../components/Title';
import TopBack from '../components/TopBack';
import TopBar from '../components/TopBar';
import UserModal from '../components/UserMenu';
import { WhiteBoard } from './Login';

type props = {
    color: string;
};

const ChangDiv = styled.div`
    position: absolute;
    top: 105px;
    width: calc(100% - 20px);
    height: calc(100% - 170px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
    gap: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar {
        display: none;
    }
`;
const InputBox = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
`;
const SignUpInput = styled.input`
    width: 100%;
    height: 45px;
    border: 2px solid #857f7f7f;
    border-radius: 10px;
    padding: 10px;
    margin: auto;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
`;
const SignUpText = styled.p`
    margin: 10px 0 10px 5px;
    font-size: 12px;
    font-weight: 900;
`;
const CheckText = styled.p`
    margin: 10px 0 0 5px;
    font-size: 10px;
    color: ${(props: props) => props.color};
`;
const ChangeButton = styled.button`
    width: 100%;
    height: 45px;
    font-size: 20px;
    font-weight: 550;
    border: none;
    border-radius: 10px;
    background-color: #c4f1ffb5;
    cursor: pointer;
    &:hover {
        background-color: #c4f1ff;
    }
    &:active {
        background-color: #c4f1ffb5;
    }
`;
export const ChangePassWord = () => {
    const nav = useNavigate();
    const [showReq, setShowReq] = useState<boolean>(false);
    const [oriPassword, setOriPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [view, setView] = useState<boolean>(true);
    const [viewCheck, setViewCheck] = useState<boolean>(true);
    function closeReq() {
        setShowReq(!showReq);
    }
    const CheckPassword = (asValue: string) => {
        var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{5,10}$/;
        return regExp.test(asValue);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOriPassword(e.target.value);
    };
    const onChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const onChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(e.target.value);
    };
    const passwordData = {
        newPassword: password,
        oldPassword: oriPassword,
    };
    const passwordChangeApi = () => {
        passwordChange.mutate(passwordData);
    };
    const passwordChange = useMutation(
        (data: { newPassword: string; oldPassword: string }) =>
            callUpApi.changePasswordApi(data),
        {
            onSuccess: (res) => {
                alert(res.data);
                nav(-1);
            },
            onError: (res: AxiosError<{ msg: string }>) => {
                if (res.message === 'Request failed with status code 401') {
                    alert('로그인이 갱신되었습니다. 다시 시도해주세요.');
                } else {
                    alert('비밀번호를 확인해 주세요.');
                }
            },
        },
    );
    return (
        <WhiteBoard>
            <TopBar />
            <Title title="Change Password" />
            <TopBack />
            <UserModal />
            <ChangDiv>
                <InputBox>
                    <SignUpText>Original Password</SignUpText>
                    <SignUpInput
                        placeholder="Password"
                        type={view ? 'password' : 'text'}
                        value={oriPassword}
                        onChange={onChange}
                    />
                    <CheckText color="black">
                        기존 패스워드를 입력해 주세요.
                    </CheckText>
                </InputBox>
                <InputBox>
                    <SignUpText>New Password</SignUpText>
                    <SignUpInput
                        placeholder="Password"
                        type={view ? 'password' : 'text'}
                        value={password}
                        onChange={onChange2}
                    />
                    <CheckText
                        color={
                            CheckPassword(password) && password
                                ? 'blue'
                                : password
                                ? 'red'
                                : 'black'
                        }
                    >
                        {CheckPassword(password) && password
                            ? '올바른 패스워드입니다.'
                            : password
                            ? '올바른 패스워드를 입력해 주세요'
                            : '패스워드는 영문, 숫자, 특수문자를 포함해 5~10자로 작성해 주세요.'}
                    </CheckText>
                </InputBox>
                <InputBox>
                    <SignUpText>Password Check</SignUpText>
                    <SignUpInput
                        placeholder="Password check"
                        type={viewCheck ? 'password' : 'text'}
                        value={passwordCheck}
                        onChange={onChange3}
                    />
                    <CheckText
                        color={
                            passwordCheck === password &&
                            passwordCheck &&
                            CheckPassword(password)
                                ? 'blue'
                                : passwordCheck
                                ? 'red'
                                : 'black'
                        }
                    >
                        {passwordCheck === password &&
                        passwordCheck &&
                        CheckPassword(password)
                            ? '패스워드가 일치합니다. 회원가입을 진행해 주세요.'
                            : passwordCheck
                            ? '패스워드를 확인해 주세요.'
                            : '패스워드를 다시 입력해 주세요.'}
                    </CheckText>
                </InputBox>
                <InputBox>
                    <ChangeButton
                        onClick={() => {
                            passwordChangeApi();
                        }}
                    >
                        비밀번호 변경하기
                    </ChangeButton>
                </InputBox>
            </ChangDiv>
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
