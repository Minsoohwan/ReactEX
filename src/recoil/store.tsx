import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

interface list {
    characterInfo: {
        characterName: string;
        characterUrl: string;
        exercise: number;
        expDone: number;
        expNeed: number;
        expPercent: number;
        level: number;
        levelUp: boolean;
        promise: number;
        shopping: number;
        step: string;
        stepUp: boolean;
        study: number;
        type: string;
    };
    todayTodoList: [];
    publicScope: string;
    createdDate: Date;
    email: string;
    id: number;
    modifiedDate: Date;
    nick: string;
    profileImageUrl: string;
    providerType: string;
    roleType: string;
    userId: string;
}
export const userModal = atom({
    key: 'userModal',
    default: false as boolean,
});
export const userInfo = atom({
    key: 'userInfo',
    default: {} as list,
});

export const dateState = atom({
    key: 'dateInfo',
    default: [] as string[],
});

export const calenderState = atom({
    key: 'calenderState',
    default: false as boolean,
});
export const myFriendsList = atom({
    key: 'myFriendsList',
    default: [] as [],
});
export const requestsFriendsList = atom({
    key: 'requestsFriendsList',
    default: [] as [],
});

export const chatStore = atom({
    key: 'chatStore',
    default: [] as [],
});
export const chattingStore = atom({
    key: 'chattingStore',
    default: [] as any[],
});
export const planStore = atom({
    key: 'planStore',
    default: [] as any[],
});
export const searchingStore = atom({
    key: 'searchingStore',
    default: 'title' as string,
});
export const accessTokenState = atom({
    key: 'access',
    default: '',
    effects_UNSTABLE: [persistAtom],
});
