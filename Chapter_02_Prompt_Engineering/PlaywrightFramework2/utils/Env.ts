export class Env {
    private static required(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(`${name} is not set. Add it to testdata/qa.env.`);
        }
        return value;
    }

    static get baseUrl(): string {
        return Env.required('BASE_URL');
    }

    static get userEmail(): string {
        return Env.required('USER_EMAIL');
    }

    static get userPassword(): string {
        return Env.required('USER_PASSWORD');
    }

    static route(route: string): string {
        const [appRoot] = Env.baseUrl.split('#');
        return `${appRoot}#${route}`;
    }
}
