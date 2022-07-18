import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    // console.info(`[request] [${JSON.stringify(config)}]`);

    const localToken = localStorage.getItem('recoil-persist');

    if (localToken) {
        const toto = JSON.parse(localToken);

        if (toto) {
            config.headers = {
                Authorization: toto.access || 0 || false,
                Refresh: toto.refresh || 0 || false,
                'Content-Type': 'application/json',
            };
        }
    }
    return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    if (error.message === 'Request failed with status code 401') {
        const localToken = localStorage.getItem('recoil-persist');

        if (localToken) {
            console.log('??');
            const toto = JSON.parse(localToken);
            const accessToken = toto.access;
            const refreshToken = toto.refresh;

            axios
                .get('https://todowith.shop/refresh', {
                    headers: {
                        Authorization: accessToken,
                        Refresh: refreshToken,
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {
                    localStorage.setItem(
                        'recoil-persist',
                        JSON.stringify({
                            access: res.headers.authorization,
                            refresh: res.headers.refresh,
                        }),
                    );
                });
            // .then(() => {
            //     const token = localStorage.getItem('recoil-persist');
            //     if (token) {
            //         const JSONToken = JSON.parse(token);
            //         const access = JSONToken.access;
            //         const refresh = JSONToken.refresh;
            //         originalRequest.headers = {
            //             Authorization: access,
            //             Refresh: refresh,
            //             'Content-Type': 'application/json',
            //         };
            //         console.log(originalRequest);
            //         axios(originalRequest);
            //     }
            // });
        }
        return Promise.reject(error);
    }
    return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    //console.info(`[response] [${JSON.stringify(response)}]`);
    return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[response error] [${JSON.stringify(error)}]`);
    if (error.message === 'Request failed with status code 401') {
        const localToken = localStorage.getItem('recoil-persist');
        if (localToken) {
            const toto = JSON.parse(localToken);
            const accessToken = toto.access;
            const refreshToken = toto.refresh;
            axios
                .get('https://todowith.shop/refresh', {
                    headers: {
                        Authorization: accessToken,
                        Refresh: refreshToken,
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {
                    console.log('??');
                    localStorage.setItem(
                        'recoil-persist',
                        JSON.stringify({
                            access: res.headers.authorization,
                            refresh: res.headers.refresh,
                        }),
                    );
                });
            //     .then(() => {
            //         const token = localStorage.getItem('recoil-persist');
            //         if (token) {
            //             const JSONToken = JSON.parse(token);
            //             const access = JSONToken.access;
            //             const refresh = JSONToken.refresh;
            //             originalRequest.headers = {
            //                 Authorization: access,
            //                 Refresh: refresh,
            //                 'Content-Type': 'application/json',
            //             };
            //             console.log(originalRequest);
            //             axios(originalRequest);
            //         }
            //     });
        }
        return Promise.reject(error);
    }
    return Promise.reject(error);
};

export default function setupInterceptorsTo(
    axiosInstance: AxiosInstance,
): AxiosInstance {
    axiosInstance.interceptors.request.use(onRequest, onRequestError);
    axiosInstance.interceptors.response.use(onResponse, onResponseError);
    return axiosInstance;
}
