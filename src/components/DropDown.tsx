import React, { PropsWithChildren } from 'react';
import '../css/dropDown.css';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { callUpApi } from '../Api/callAPi';
import axios from 'axios';
import setupInterceptorsTo from '../Api/Interceptors';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userInfo } from '../recoil/store';

const DropDownArticle = styled.article`
    position: absolute;
    width: 60px;
    top: 102px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const DropDownButton = styled.button`
    width: 60px;
    font-size: 12px;
    font-weight: bold;
    border: none;
    background-color: #c4c8ff;
    border-radius: 10px;
    cursor: pointer;
`;
const DropDownUl = styled.ul`
    padding: 0;
    gap: 5px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
`;
const DropDownLi = styled.li`
    margin: 0;
    text-align: center;
    width: 60px;
    border-radius: 5px;
    background-color: none;
    font-size: 12px;
    background-color: #eef8fd;
    cursor: pointer;
`;

const Dropdown = () => {
    const [dropdownVisibility, setDropdownVisibility] = React.useState(false);
    const [visibilityAnimation, setVisibilityAnimation] = React.useState(false);
    const [userdata, setUserData] = useRecoilState(userInfo);
    const scopePlanList = (data: { publicScope: string }) => {
        scopePlan.mutate(data);
    };

    const userData: any = useQuery('userData', callUpApi.getInfoApi, {
        onSuccess: (res: any) => {
            setUserData(res.data);
        },
    });
    const scopePlan = useMutation(
        (data: { publicScope: string }) => callUpApi.scopePlanApi(data),
        {
            onSuccess: (res) => {
                console.log(res);
            },
        },
    );
    const queryClient = useQueryClient();
    React.useEffect(() => {
        if (dropdownVisibility) {
            setVisibilityAnimation(true);
        } else {
            setTimeout(() => {
                setVisibilityAnimation(false);
            }, 400);
        }
    }, [dropdownVisibility]);

    return (
        <DropDownArticle>
            <DropDownButton
                onClick={() => setDropdownVisibility(!dropdownVisibility)}
            >
                {userdata.publicScope === 'ALL'
                    ? '전체공개'
                    : userdata.publicScope === 'FRIEND'
                    ? '친구공개'
                    : '비공개'}
            </DropDownButton>
            <div
                className={
                    dropdownVisibility
                        ? 'slide-fade-in-dropdown'
                        : 'slide-fade-out-dropdown'
                }
            >
                {dropdownVisibility && visibilityAnimation ? (
                    <DropDownUl>
                        <DropDownLi
                            onClick={() => {
                                scopePlanList({ publicScope: 'ALL' });
                                queryClient.invalidateQueries('userData');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>전체공개</b>
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                scopePlanList({ publicScope: 'FRIEND' });
                                queryClient.invalidateQueries('userData');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>친구공개</b>
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                scopePlanList({ publicScope: 'NONE' });
                                queryClient.invalidateQueries('userData');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>비공개</b>
                        </DropDownLi>
                    </DropDownUl>
                ) : dropdownVisibility === false && visibilityAnimation ? (
                    <DropDownUl>
                        <DropDownLi
                            onClick={() => {
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>전체공개</b>
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>친구공개</b>
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            <b>비공개</b>
                        </DropDownLi>
                    </DropDownUl>
                ) : null}
            </div>
        </DropDownArticle>
    );
};

export default Dropdown;
