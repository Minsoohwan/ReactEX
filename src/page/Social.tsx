import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { callUpApi } from '../Api/callAPi';

export const Social = () => {
    const [name, setName] = useState<string>('');
    const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        console.log(name);
    };
    const socialSignUp = () => {
        nickCheck.mutate({ nick: name });
    };
    const nickCheck = useMutation(
        (nick: { nick: string }) => callUpApi.socialApi(nick),
        {
            onSuccess: (res) => {
                console.log(res);
            },
            onError: (res: AxiosError) => {
                console.log(res);
            },
        },
    );
    return (
        <>
            <input value={name} onChange={onchange} />
            <button onClick={socialSignUp}>회원가입완료</button>
        </>
    );
};
