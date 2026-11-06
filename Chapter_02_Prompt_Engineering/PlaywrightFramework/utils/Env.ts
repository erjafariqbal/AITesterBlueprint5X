export class Env {
    static get baseUrl(): string {
        const value = process.env.BASE_URL;
        if (!value) {
            throw new Error('BASE_URL is not defined in testdata/qa.env');
        }
        return value;
    }

    static get userName(): string {
        return process.env.USER_USERNAME ?? '';
    }

    static get userPassword(): string {
        return process.env.USER_PASSWORD ?? '';
    }

    static get hasCredentials(): boolean {
        return Env.userName.length > 0 && Env.userPassword.length > 0;
    }
}
