import React, { KeyboardEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GoSignIn } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { callUpApi } from '../Api/callAPi';
import { useSetRecoilState } from 'recoil';
import { AxiosError } from 'axios';
import { accessTokenState } from '../recoil/store';

export const WhiteBoard = styled.div`
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
    justify-content: center;
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
export const AppName = styled.h2`
    font-weight: 1000;
    margin: 30px auto;
`;
const SignInput = styled.input`
    width: 90%;
    height: 45px;
    border: 2px solid #857f7f7f;
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
`;
const SignInText = styled.p`
    margin: 0 0 0 5.8%;
    font-size: 12px;
    font-weight: 900;
`;
const LoginButton = styled.button`
    width: 90%;
    height: 45px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    color: white;
    margin: 10px auto;
    background-color: #272626;
    cursor: pointer;
    &:hover {
        background-color: #444343;
    }
    &:active {
        background-color: #272626;
    }
`;
const Hr = styled.hr`
    width: 60%;
`;

const SignUpBox = styled.div`
    display: flex;
    gap: 30px;
    margin: 10px auto;
`;
const SignUpEx = styled.p`
    font-size: 15px;
    font-weight: 700;
`;
const SignUpLink = styled.p`
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    &:hover {
        color: #888585;
    }
    &:active {
        color: #000000;
    }
`;
interface login {
    email: string;
    password: string;
}

export const Login = () => {
    const nav = useNavigate();
    const [emailtext, setEmailText] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const loginData = {
        email: emailtext,
        password: password,
    };
    const loginFunc = () => {
        login.mutate(loginData);
    };
    const login = useMutation((data: login) => callUpApi.loginApi(data), {
        onSuccess: () => {
            nav('/');
        },
        onError: (err: AxiosError) => {
            alert('아이디/비밀번호를 확인해 주세요!');
        },
    });
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailText(e.target.value);
    };
    const onChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const keyUpEvent = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loginFunc();
        }
    };
    const localToken = localStorage.getItem('recoil-persist');
    useEffect(() => {
        if (localToken) {
            alert('이미 로그인 돼있습니다.');
            nav('/');
        }
    }, [localToken]);
    return (
        <WhiteBoard>
            <AppName>JUST DO IT!</AppName>
            <SignInText>Email</SignInText>
            <SignInput
                placeholder="Email"
                value={emailtext}
                onChange={onChange}
            />
            <SignInText>Password</SignInText>
            <SignInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={onChange2}
                onKeyUp={keyUpEvent}
            />
            <LoginButton onClick={() => loginFunc()}>Login</LoginButton>
            <Hr />
            <SignUpBox>
                <SignUpEx>첫 방문이신가요?😊</SignUpEx>
                <SignUpLink onClick={() => nav('/signup')}>
                    회원가입 <GoSignIn />
                </SignUpLink>
            </SignUpBox>
        </WhiteBoard>
    );
};
