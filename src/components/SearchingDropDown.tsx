import React, { PropsWithChildren } from 'react';
import '../css/dropDown.css';
import { BsChevronDown } from 'react-icons/bs';
import styled from 'styled-components';

const DropDownArticle = styled.article`
    position: absolute;
    width: 80px;
    top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 50;
`;
const DropDownButton = styled.button`
    width: 80px;
    height: 30px;
    font-size: 15px;
    font-weight: bold;
    border: none;
    background-color: #e7e7e7;
    border-radius: 10px;
    cursor: pointer;
`;
const DropDownDiv = styled.div`
    margin: 0;
    display: flex;
`;
const DropDownUl = styled.ul`
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
`;
const DropDownLi = styled.li`
    margin: 0;
    padding: 6px 0;
    text-align: center;
    width: 80px;
    height: 30px;
    background-color: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: bold;
    background-color: #e7e7e7;
    cursor: pointer;
`;

const SearchingDropDown = () => {
    const [dropdownVisibility, setDropdownVisibility] = React.useState(false);
    const [visibilityAnimation, setVisibilityAnimation] = React.useState(false);
    const [scope, setScope] = React.useState<String>('제목');
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
                {scope}
                <BsChevronDown className="drop" size="12" />
            </DropDownButton>
            <DropDownDiv
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
                                setScope('제목');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            제목
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                setScope('번호');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            번호
                        </DropDownLi>
                    </DropDownUl>
                ) : dropdownVisibility === false && visibilityAnimation ? (
                    <DropDownUl>
                        <DropDownLi
                            onClick={() => {
                                setScope('제목');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            제목
                        </DropDownLi>

                        <DropDownLi
                            onClick={() => {
                                setScope('번호');
                                setDropdownVisibility(!dropdownVisibility);
                            }}
                        >
                            번호
                        </DropDownLi>
                    </DropDownUl>
                ) : null}
            </DropDownDiv>
        </DropDownArticle>
    );
};

export default SearchingDropDown;
