export class HttpError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(statusCode: number, message: string, details?: unknown) {
        super(message);
        this.name = "HttpError";
        this.statusCode = statusCode;
        this.details = details;
    }
}

export const BadRequestError = (message: string, details?: unknown) =>
    new HttpError(400, message, details);

export const UnauthorizedError = (message: string, details?: unknown) =>
    new HttpError(401, message, details);

export const ForbiddenError = (message: string, details?: unknown) =>
    new HttpError(403, message, details);

export const NotFoundError = (message: string, details?: unknown) =>
    new HttpError(404, message, details);