import axios from 'axios';
import setupInterceptorsTo from './Interceptors';

const baseApi = axios.create({
    baseURL: 'https://todowith.shop',
    timeout: 1000,
});

const callApi = setupInterceptorsTo(baseApi);

export interface board {
    board: {
        category: string;
        content: string;
        imageUrl: string;
        title: string;
    };
    todo?: {
        category?: string;
        content?: string;
        todoDateList?: string[];
    };
}
export interface editboard {
    data: {
        board: {
            category: string;
            content: string;
            imageUrl: string;
            title: string;
        };
        todo?: {
            category?: string;
            content?: string;
            todoDateList?: string[];
        };
    };
    id: string;
}

interface data {
    email?: string;
    nick?: string;
    password?: string;
    name?: string;
}

interface emaildata {
    code: string;
    email: string;
}
interface login {
    email: string;
    password: string;
}
export interface plan {
    boardId?: number;
    category: string;
    content: string;
    todoDate?: string;
    todoDateList?: string[];
}
export interface editPlan {
    data: plan;
    id: any;
}
const getInfoApi = async () => {
    const gia = await callApi.get('/user');
    return gia;
};
const getNewTokenApi = async () => {
    const gnta = await callApi.get('/refresh');
    return gnta;
};
const signUpApi = async (data: data) => {
    const sua = await callApi.post('/register', data);
    return sua;
};
const emailApi = async (email: {}) => {
    const ea = await callApi.post('/register/email', email);
    return ea;
};
const emailCheckApi = async (data: emaildata) => {
    const eca = await callApi.post('/register/email-check', data);
    return eca;
};
const nicknameCheckApi = async (nick: {}) => {
    const nca = await callApi.post('/register/nick-check', nick);
    return nca;
};
const loginApi = async (data: login) => {
    const la = await callApi.post('/login', data);
    return la;
};

const socialApi = async (data: {}) => {
    const sa = await callApi.put('/register/social', data, {
        headers: {
            'Content-Type': 'application/text',
        },
    });
};
const updataNickApi = async (data: { nick: string }) => {
    const una = await callApi.put('/user/nick', data);
    return una;
};
const updataImgApi = async (data: FormData) => {
    const uia = await callApi.put('/user/profile', data);
    return uia;
};
const acceptFriendsApi = async (data: { nick: string }) => {
    const rfa = await callApi.post(`/friend/accept`, data);
    return rfa;
};
const deleteFriendsApi = async (data: { nick: string }) => {
    const dfa = await callApi.delete('/friend/delete', { data: data });
    return dfa;
};
const friendsListApi = async () => {
    const fla = await callApi.get('/friend/list');
    return fla;
};
const deleteRejectApi = async (data: { nick: string }) => {
    const dra = await callApi.delete(`/friend/reject`, { data: data });
    return dra;
};
const requestFriendsApi = async (data: { nick: string }) => {
    const rfa = await callApi.post('/friend/request', data);
    return rfa;
};
const requestFriendListsApi = async () => {
    const rfa = await callApi.get('/friend/request/list');
    return rfa;
};
const getChatListApi = async () => {
    const gcla = await callApi.get('/chat/rooms');
    return gcla;
};
const makePrivateApi = async (data: data) => {
    const mpa = await callApi.post('/chat/room/private', data);
    return mpa;
};
const makePublicApi = async (data: { name: string }) => {
    const mpa = await callApi.post('/chat/room/public', data);
    return mpa;
};
const enterPublicApi = async (data: { roomId: string }) => {
    const epa = await callApi.post('/chat/room/enter/public', data);
    return epa;
};
const deleteChatApi = async (data: { roomId: string }) => {
    const dca = await callApi.delete('/chat/room', { data: data });
    return dca;
};
const changePasswordApi = async (data: {
    newPassword: string;
    oldPassword: string;
}) => {
    const cpa = await callApi.put('/user/password', data);
    return cpa;
};
const addPlanApi = async (data: plan) => {
    const apa = await callApi.post(`/todo`, data);
    return apa;
};
const deletePlanApi = async (id: number) => {
    const dpa = await callApi.delete(`/todo/${id}`);
    return dpa;
};
const editPlanApi = async (data: editPlan) => {
    const epa = await callApi.put(`/todo/${data.id}`, data.data);
    return epa;
};
const completePlanApi = async (id: number) => {
    const cpa = await callApi.post(`/todo/${id}`);
    return cpa;
};
const scopePlanApi = async (data: { publicScope: string }) => {
    const spa = await callApi.put(`/todo/scope`, data);
    return spa;
};
const joinTodoApi = async (id: string) => {
    const jta = await callApi.post(`board/${id}/challenge`);
    return jta;
};
const cancleTodoApi = async (id: string) => {
    const jta = await callApi.put(`board/${id}/challenge`);
    return jta;
};
const saveImageApi = async (data: FormData) => {
    const sip = await callApi.post('/board/image', data);
    return sip;
};
const addBoardApi = async (data: board) => {
    const abp = await callApi.post('/board', data);
    return abp;
};
const deleteBoardApi = async (id: string) => {
    const dba = await callApi.delete(`/board/${id}`);
    return dba;
};
const editBoardApi = async (data: editboard) => {
    const ebp = await callApi.put(`/board/${data.id}`, data.data);
    return ebp;
};
export const callUpApi = {
    getInfoApi: () => getInfoApi(),
    getNewTokenApi: () => getNewTokenApi(),
    signUpApi: (data: data) => signUpApi(data),
    emailApi: (email: {}) => emailApi(email),
    socialApi: (data: {}) => socialApi(data),
    emailCheckApi: (data: emaildata) => emailCheckApi(data),
    nicknameCheckApi: (nick: {}) => nicknameCheckApi(nick),
    loginApi: (data: login) => loginApi(data),
    updataNickApi: (data: { nick: string }) => updataNickApi(data),
    updataImgApi: (data: FormData) => updataImgApi(data),
    acceptFriendsApi: (data: { nick: string }) => acceptFriendsApi(data),
    deleteFriendsApi: (data: { nick: string }) => deleteFriendsApi(data),
    friendsListApi: () => friendsListApi(),
    deleteRejectApi: (data: { nick: string }) => deleteRejectApi(data),
    requestFriendsApi: (data: { nick: string }) => requestFriendsApi(data),
    requestFriendListsApi: () => requestFriendListsApi(),
    getChatListApi: () => getChatListApi(),
    makePrivateApi: (data: data) => makePrivateApi(data),
    makePublicApi: (data: { name: string }) => makePublicApi(data),
    changePasswordApi: (data: { newPassword: string; oldPassword: string }) =>
        changePasswordApi(data),
    addPlanApi: (data: plan) => addPlanApi(data),
    deletePlanApi: (id: number) => deletePlanApi(id),
    editPlanApi: (data: editPlan) => editPlanApi(data),
    completePlanApi: (id: number) => completePlanApi(id),
    scopePlanApi: (data: { publicScope: string }) => scopePlanApi(data),
    joinTodoApi: (id: string) => joinTodoApi(id),
    cancleTodoApi: (id: string) => cancleTodoApi(id),
    enterPublicApi: (data: { roomId: string }) => enterPublicApi(data),
    deleteChatApi: (data: { roomId: string }) => deleteChatApi(data),
    saveImageApi: (data: FormData) => saveImageApi(data),
    addBoardApi: (data: board) => addBoardApi(data),
    deleteBoardApi: (id: string) => deleteBoardApi(id),
    editBoardApi: (data: editboard) => editBoardApi(data),
};
