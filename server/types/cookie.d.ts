declare module "cookie" {
    export interface CookieParseOptions {
        decode?: (val: string) => string;
    }

    export function parse(
        str: string,
        options?: CookieParseOptions
    ): Record<string, string>;
}