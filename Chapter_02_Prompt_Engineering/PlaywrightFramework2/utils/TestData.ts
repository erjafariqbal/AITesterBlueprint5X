import fs from 'fs';
import path from 'path';

export interface TestDataShape {
    routes: Record<'login' | 'forgotPassword' | 'register' | 'dashboard' | 'cart' | 'orders', string>;
    api: { products: string };
    invalidUser: Record<'malformedEmail' | 'unknownEmail' | 'wrongPassword' | 'shortPhone' | 'shortFirstName' | 'mismatchPassword', string>;
    registration: Record<'firstName' | 'lastName' | 'phone' | 'occupation' | 'gender', string>;
    messages: Record<string, string>;
    filters: {
        categories: string[];
        subCategories: string[];
        searchFor: string[];
        noMatchSearch: string;
        belowLowestPrice: string;
    };
    payment: {
        methods: string[];
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        nameOnCard: string;
        validCoupon: string;
        invalidCoupon: string;
        countryQuery: string;
        country: string;
    };
    orders: { columns: string[] };
    maxProductsPerPage: number;
}

const dataPath = path.resolve(__dirname, '../testdata/testData.json');

export const testData: TestDataShape = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
