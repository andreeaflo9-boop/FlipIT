export async function createContext(
    opts: CreateExpressContextOptions
): Promise<TrpcContext> {
    const token = opts.req.headers.authorization;

    let user: Player | null = null;

    if (token) {
        user = {
            id: 1,
            openId: "local",
            name: "User",
            email: null,
            loginMethod: null,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSignedIn: new Date(),
        };
    }

    return {
        req: opts.req,
        res: opts.res,
        user,
    };
}