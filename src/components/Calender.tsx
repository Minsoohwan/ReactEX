import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/modal.css';
import styled from 'styled-components';
import ko from 'date-fns/locale/ko';
import { useRecoilState } from 'recoil';
import { calenderState, dateState } from '../recoil/store';
import moment from 'moment';

registerLocale('ko', ko);

const CalenderBack = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    bottom: -170px;
    left: 50%;
    transform: translate(-50%, -50%);
`;
const SelectButton = styled.button`
    display: flex;
    font-weight: 600;
    margin: 5px 0;
    border: none;
    border-radius: 10px;
    outline: none;
    background-color: #f0f0f0;
    &:hover {
        background-color: rgb(66, 66, 66);
        color: white;
    }
    &:active {
        color: black;
        background-color: #f0f0f0;
    }
`;
const DateInfo = styled.div`
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    border-radius: 20px;
    background-color: white;
`;
const DateSelect = styled.div`
    display: flex;
    font-weight: 700;
    border-radius: 10px;
    border: none;
    margin: 2px 0;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 13px;
    width: 180px;
`;
const Calender = () => {
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const [startDate, endDate] = dateRange;
    const [, setShowReq] = useRecoilState<boolean>(calenderState);
    const [, setDate] = useRecoilState<string[]>(dateState);
    function change_date(published_at: Date | null) {
        if (published_at === null) {
            return '';
        } else {
            var moment = require('moment');

            const publish_date = moment(published_at).format('YYYY-MM-DD');
            return publish_date;
        }
    }
    function getDatesStartToLast(startDate: string, endDate: string) {
        var result = [];
        var curDate = new Date(startDate);
        while (curDate <= new Date(endDate)) {
            result.push(curDate.toISOString().split('T')[0]);
            curDate.setDate(curDate.getDate() + 1);
        }
        return result;
    }
    const closeModal = () => {
        setDate(
            getDatesStartToLast(change_date(startDate), change_date(endDate)),
        );
        setShowReq(false);
    };
    return (
        <CalenderBack
            onClick={(e: any) => {
                e.stopPropagation();
            }}
        >
            <DatePicker
                locale="ko"
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                onChange={(update) => {
                    setDateRange(update);
                }}
                inline
            />
            <DateInfo>
                <DateSelect>시작일: {change_date(startDate)}</DateSelect>
                <DateSelect>종료일: {change_date(endDate)}</DateSelect>
                <SelectButton
                    onClick={() => {
                        startDate && endDate
                            ? closeModal()
                            : alert('기간을 입력해 주세요');
                    }}
                >
                    기간 선택
                </SelectButton>
            </DateInfo>
        </CalenderBack>
    );
};
export default Calender;
