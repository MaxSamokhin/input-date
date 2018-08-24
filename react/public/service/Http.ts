import {GET, POST} from '../constants/HttpMethod.constant';
import config from '../constants/Api.constant';

interface IMessage {
    type: string;
    mess: any;
}

export default class Http {

    public static get(path, data = null) {
        return Http._request(GET, path, data, true);
    }

    public static post(path, data?) {
        return Http._request(POST, path, data = null, false);
    }

    private static _request(method, path, data = null, isGET) {
        const url: any = new URL(`${config.apiPrefixLocalhost}/${path}`);
        const mode: RequestMode = 'cors';

        const fetchOptions = {
            method,
            mode,

            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            },

            body: null
        };

        if (data && isGET) {
            Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
        }

        if (data && !isGET) {
            fetchOptions.body = JSON.stringify(data);
        }

        return fetch(url, fetchOptions)
            .then((resp): IMessage => {
                return {
                    type: 'OK',
                    mess: resp.json()
                };
            })
            .catch((err): IMessage => {
                return {
                    type: 'ERROR',
                    mess: err
                };
            });
    }

}
