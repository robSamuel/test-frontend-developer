import axios from 'axios';

export const URL = 'https://api.github.com';

export class ClientRequests {
    getHeaders(url) {
        const finalURL = `${URL}${url}`;
        const headers = { 'Content-Type': 'application/json' };

        return {
            finalURL,
            headers
        };
    }

    GET(url) {
        const { finalURL, headers } = this.getHeaders(url);

        return new Promise((resolve, reject) => {
            axios.get(finalURL, headers)
                .then(response => {
                    resolve({
                        data: response.data,
                        statusCode: response.status,
                    });
                })
                .catch(ex => {
                    reject({ message: ex.message });
                });
        });
    }
}
