import { randomBytes } from 'crypto';

export class DataGenerator {
    static uniqueEmail(): string {
        return `qa.${Date.now()}.${randomBytes(3).toString('hex')}@example.com`;
    }

    static strongPassword(): string {
        return `Qa@${randomBytes(5).toString('hex')}9Z`;
    }
}
