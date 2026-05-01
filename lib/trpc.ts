

import superjson from "superjson";
import type { AppRouter } from "@/server/routers";
import * as Auth from "@/lib/auth";

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
    return trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getApiBaseUrl()}/api/trpc`,
                transformer: superjson,
                async headers() {
                    return token ? { Authorization: `Bearer ${token}` } : {};
                },
                fetch(url, options) {
                    return fetch(url, {
                        ...options,
                        credentials: "include",
                    });
                },
            }),
        ],
    });
}