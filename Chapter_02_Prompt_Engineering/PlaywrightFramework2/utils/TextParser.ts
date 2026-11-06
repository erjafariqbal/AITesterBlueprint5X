export class TextParser {
    static price(text: string | null): number {
        const match = text?.match(/\d+(\.\d+)?/);
        if (!match) {
            throw new Error(`No price found in text: "${text}"`);
        }
        return Number(match[0]);
    }

    static resultCount(text: string | null): number {
        const match = text?.match(/Showing\s+(\d+)\s+results/);
        if (!match) {
            throw new Error(`No result count found in text: "${text}"`);
        }
        return Number(match[1]);
    }

    static orderId(text: string | null): string {
        const match = text?.match(/[a-f0-9]{24}/);
        if (!match) {
            throw new Error(`No order id found in text: "${text}"`);
        }
        return match[0];
    }
}
