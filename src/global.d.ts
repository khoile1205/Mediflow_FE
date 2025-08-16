export {};

declare global {
    interface String {
        toCase(type?: "camel" | "pascal" | "readable"): string;
    }
}
