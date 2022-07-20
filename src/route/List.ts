import { ReactElement } from 'react';

import {
    Login,
    Main,
    SignUP,
    Todo,
    Social,
    Community,
    CommunityDetail,
    Chat,
    Chatting,
    AddPost,
    Friends,
    ChangePassWord,
    EditPost,
} from './../page';
interface Route {
    id: string;
    path: string;
    page: () => ReactElement;
}

export const List: Route[] = [
    {
        id: 'main',
        path: '/',
        page: Main,
    },
    {
        id: 'login',
        path: '/login',
        page: Login,
    },
    {
        id: 'signup',
        path: '/signup',
        page: SignUP,
    },
    {
        id: 'todo',
        path: '/todo',
        page: Todo,
    },
    {
        id: 'social',
        path: '/social',
        page: Social,
    },
    {
        id: 'Community',
        path: '/community',
        page: Community,
    },
    {
        id: 'Community',
        path: '/community/:id',
        page: CommunityDetail,
    },
    {
        id: 'Chat',
        path: '/chat',
        page: Chat,
    },
    {
        id: 'Chatting',
        path: '/chat/:id',
        page: Chatting,
    },
    {
        id: 'AddPost',
        path: '/post',
        page: AddPost,
    },
    {
        id: 'EditPost',
        path: '/edit/:id',
        page: EditPost,
    },
    {
        id: 'Friends',
        path: '/friends',
        page: Friends,
    },
    {
        id: 'ChangePassWord',
        path: '/changepassword',
        page: ChangePassWord,
    },
];
