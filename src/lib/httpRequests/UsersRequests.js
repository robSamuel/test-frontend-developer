import { ClientRequests } from './ClientRequests';
export const MainURL = 'https://api.github.com';

export const URL = {
    SEARCH_USERS: '/search/users?q=',
    USER_DETAILS: '/users/',
    USER_REPOS: '/users/~user~/repos',
    USER_FOLLOWERS: '/users/~user~/followers'
};

export class UsersRequests {
    constructor() {
        this.http = new ClientRequests();
    }

    async searchUsers(user) {
        const url = `${URL.SEARCH_USERS}${user}`;

        const response = await this.http.GET(url);

        return response;
    }

    async userDetails(user) {
        const url = `${URL.USER_DETAILS}${user}`;

        const response = await this.http.GET(url);

        return response;
    }

    async retrieveUserRepos(user) {
        let url = URL.USER_REPOS;

        url = url.replace('~user~', user);

        const response = await this.http.GET(url);

        return response;
    }

    async retrieveUserFollowers(user) {
        let url = URL.USER_FOLLOWERS;

        url = url.replace('~user~', user);

        const response = await this.http.GET(url);

        return response;
    }
}
