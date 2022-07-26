import React, { useState, KeyboardEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AppName, WhiteBoard } from './Login';
import { TbEyeOff, TbEyeCheck } from 'react-icons/tb';
import '../css/icon.css';
import { callUpApi } from '../Api/callAPi';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';

type props = {
    color: string;
};
interface data {
    email: string;
    nick: string;
    password: string;
}

interface emaildata {
    email: string;
    code: string;
}

const SignUpInput = styled.input`
    width: 90%;
    height: 45px;
    border: 2px solid #857f7f7f;
    border-radius: 10px;
    padding: 10px;
    margin: 0 auto;
    &:focus {
        border: 2px solid #0338ca46;
        outline: 1px solid #0338ca46;
    }
`;
const SignUpButton = styled.button`
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
const SignUpText = styled.p`
    margin: 10px 0 10px 5.8%;
    font-size: 12px;
    font-weight: 900;
`;
const CheckText = styled.p`
    margin: 10px 0 0 5.8%;
    font-size: 10px;
    color: ${(props: props) => props.color};
`;
const SignInEx = styled.a`
    font-size: 15px;
    font-weight: 700;
    margin: 0 auto;
    color: black;
    cursor: pointer;
    &:hover {
        color: #857f7f;
    }
    &:active {
        color: black;
    }
`;
type position = {
    bottom: string;
};
const EyeDiv = styled.div`
    position: absolute;
    bottom: ${(props: position) => props.bottom}px;
    right: 50px;
    width: 18px;
    display: flex;
`;

export const SignUP = () => {
    const nav = useNavigate();
    const CheckEmail = (asValue: string) => {
        var regExp =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        return regExp.test(asValue);
    };
    const CheckNickname = (asValue: string) => {
        var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,15}$/;
        return regExp.test(asValue);
    };
    const CheckPassword = (asValue: string) => {
        var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{5,10}$/;
        return regExp.test(asValue);
    };
    const [emailtext, setEmailText] = useState<string>('');
    const [emailtextCheck, setEmailTextCheck] = useState<string>('');
    const [sendEmail, setSendEmail] = useState<boolean>(false);
    const [sendEmailCheck, setSendEmailCheck] = useState<boolean>(false);
    const [sendEmail2, setSendEmail2] = useState<boolean | null>(null);
    const [sendEmailCheck2, setSendEmailCheck2] = useState<boolean | null>(
        null,
    );
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [nickNametext, setnickNametext] = useState<string>('');
    const [sendNick, setSendNick] = useState<boolean>(false);
    const [sendNick2, setSendNick2] = useState<boolean | null>(null);

    const signUpData = {
        email: emailtext,
        nick: nickNametext,
        password: password,
    };
    const signUpApiFunc = () => {
        signUp.mutate(signUpData);
    };
    const signUp = useMutation((data: data) => callUpApi.signUpApi(data), {
        onSuccess: () => {
            alert('회원가입을 축하드립니다!');
            nav('/login');
        },
        onError: (err: AxiosError<{ msg: string }>) => {
            alert(err.response?.data.msg);
        },
    });
    const emailCertData = {
        email: emailtext,
    };
    const emailApiFunc = () => {
        email.mutate(emailCertData);
    };
    const email = useMutation(
        (email: { email: string }) => callUpApi.emailApi(email),
        {
            onSuccess: (res) => {
                setSendEmail2(true);
                setCheckEmail(true);
                alert(res.data);
            },
            onError: (err: AxiosError<{ msg: string }>) => {
                alert(err.response?.data.msg);
                setSendEmail2(false);
            },
        },
    );
    const emailCheckData = {
        code: emailtextCheck,
        email: emailtext,
    };

    const emailCheckApiFunc = () => {
        emailCheck.mutate(emailCheckData);
    };
    const emailCheck = useMutation(
        (data: emaildata) => callUpApi.emailCheckApi(data),
        {
            onSuccess: (res) => {
                alert(res.data);
                setSendEmailCheck2(true);
            },
            onError: (res: AxiosError<{ msg: string }>) => {
                alert(res.response?.data.msg);
                setSendEmailCheck2(false);
            },
        },
    );
    const nickdata = {
        nick: nickNametext,
    };
    const nickCheckApiFunc = () => {
        nickCheck.mutate(nickdata);
    };
    const nickCheck = useMutation(
        (nick: { nick: string }) => callUpApi.nicknameCheckApi(nick),
        {
            onSuccess: (res) => {
                alert(res.data);
                setSendNick2(true);
            },
            onError: (res: AxiosError<{ msg: string }>) => {
                alert(res.response?.data.msg);
                setSendNick2(false);
            },
        },
    );
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailText(e.target.value);
    };

    const onChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailTextCheck(e.target.value);
    };
    const onChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const onChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordCheck(e.target.value);
    };
    const onChange4 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnickNametext(e.target.value);
    };

    const [checkEmail, setCheckEmail] = React.useState<boolean>(false);
    const onKeyPressEmail = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && CheckEmail(emailtext)) {
            emailApiFunc();

            setSendEmail(true);
        } else if (e.key === 'Enter' && CheckEmail(emailtext) === false) {
            alert('올바른 이메일을 입력해 주세요!');
        }
    };
    const onKeyPressEmailCert = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            emailCheckApiFunc();
            setSendEmailCheck(true);
        }
    };

    const onKeyPressNickname = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && CheckNickname(nickNametext)) {
            nickCheckApiFunc();
            setSendNick(true);
        } else if (e.key === 'Enter' && CheckNickname(nickNametext) === false) {
            alert('올바른 닉네임을 입력해 주세요!');
        }
    };
    const [view, setView] = useState<boolean>(true);
    const [viewCheck, setViewCheck] = useState<boolean>(true);
    const passwordView = () => {
        setView(false);
    };
    const passwordUnview = () => {
        setView(true);
    };
    const passwordViewCheck = () => {
        setViewCheck(false);
    };
    const passwordUnviewCheck = () => {
        setViewCheck(true);
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
            <SignUpText>Email</SignUpText>
            <SignUpInput
                placeholder="OOO@naver.com"
                onKeyUp={onKeyPressEmail}
                value={emailtext}
                onChange={onChange}
            />

            <CheckText
                color={
                    sendEmail && sendEmail2
                        ? 'blue'
                        : sendEmail && sendEmail2 === false
                        ? 'red'
                        : CheckEmail(emailtext) && emailtext
                        ? 'blue'
                        : emailtext
                        ? 'red'
                        : 'black'
                }
            >
                {sendEmail && sendEmail2
                    ? '인증번호가 발송되었습니다.'
                    : sendEmail && sendEmail2 === false
                    ? '중복된 이메일입니다. 이메일을 다시 입력해 주세요.'
                    : CheckEmail(emailtext) && emailtext
                    ? 'Enter를 눌러 인증메일을 전송해 주세요.'
                    : emailtext
                    ? '올바른 이메일을 입력해 주세요'
                    : '이메일을 입력해 주세요'}
            </CheckText>
            {checkEmail && (
                <>
                    <SignUpText>Email check</SignUpText>
                    <SignUpInput
                        placeholder="인증번호를 입력하세요."
                        value={emailtextCheck}
                        onChange={onChange1}
                        onKeyUp={onKeyPressEmailCert}
                    />
                    <CheckText
                        color={
                            sendEmailCheck && sendEmailCheck2
                                ? 'blue'
                                : sendEmailCheck && sendEmailCheck2 === false
                                ? 'red'
                                : 'black'
                        }
                    >
                        {sendEmailCheck && sendEmailCheck2
                            ? '인증을 성공하였습니다.'
                            : sendEmailCheck && sendEmailCheck2 === false
                            ? '인증번호를 확인해 주세요.'
                            : '인증번호 입력 후 Enter를 눌러 인증을 진행해주세요.'}
                    </CheckText>
                </>
            )}

            <SignUpText>Nickname</SignUpText>
            <SignUpInput
                placeholder="홍길동"
                value={nickNametext}
                onChange={onChange4}
                onKeyUp={onKeyPressNickname}
            />
            <CheckText
                color={
                    sendNick && sendNick2
                        ? 'blue'
                        : sendNick && sendNick2 === false
                        ? 'red'
                        : CheckNickname(nickNametext) && nickNametext
                        ? 'blue'
                        : nickNametext
                        ? 'red'
                        : 'black'
                }
            >
                {sendNick && sendNick2
                    ? '사용 가능한 닉네임입니다.'
                    : sendNick && sendNick2 === false
                    ? '중복된 닉네임입니다. 닉네임을 다시 입력해주세요.'
                    : CheckNickname(nickNametext) && nickNametext
                    ? 'Enter를 눌러 중복확인을 해 주세요.'
                    : nickNametext
                    ? '올바른 닉네임을 입력해 주세요'
                    : '닉네임은 영어, 한글, 숫자만으로 이루어진 2~15자로 작성해주세요.'}
            </CheckText>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    gap: '10px',
                }}
            >
                <SignUpText>Password</SignUpText>
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
                <EyeDiv bottom="185">
                    {view ? (
                        <TbEyeOff
                            className="eye"
                            onTouchStart={passwordView}
                            onTouchEnd={passwordUnview}
                            onMouseDown={passwordView}
                            onMouseUp={passwordUnview}
                        />
                    ) : (
                        <TbEyeCheck
                            className="eye"
                            onTouchStart={passwordView}
                            onTouchEnd={passwordUnview}
                            onMouseDown={passwordView}
                            onMouseUp={passwordUnview}
                        />
                    )}
                </EyeDiv>
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
                <EyeDiv bottom="50">
                    {viewCheck ? (
                        <TbEyeOff
                            className="eye"
                            onTouchStart={passwordViewCheck}
                            onTouchEnd={passwordUnviewCheck}
                            onMouseDown={passwordViewCheck}
                            onMouseUp={passwordUnviewCheck}
                        />
                    ) : (
                        <TbEyeCheck
                            className="eye"
                            onTouchStart={passwordViewCheck}
                            onTouchEnd={passwordUnviewCheck}
                            onMouseDown={passwordViewCheck}
                            onMouseUp={passwordUnviewCheck}
                        />
                    )}
                </EyeDiv>
            </div>
            <SignUpButton onClick={() => signUpApiFunc()}>Sign Up</SignUpButton>
            <SignInEx onClick={() => nav('/login')}>
                Login 페이지로 돌아가기
            </SignInEx>
        </WhiteBoard>
    );
};
