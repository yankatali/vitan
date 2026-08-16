import {ADMIN_REQUEST_HEADER_NAME, ADMIN_REQUEST_HEADER_VALUE} from "@/constants/admin";

export type UploadProgressHandler = (progress: number) => void;

interface SendFormDataRequestParams<TResponse> {
    body: FormData;
    fallbackErrorMessage: string;
    isResponse: (value: unknown) => value is TResponse;
    method: "POST" | "PUT";
    onUploadProgress?: UploadProgressHandler;
    unexpectedResponseMessage: string;
    url: string;
}

const parsePayload = (responseText: string): unknown => {
    if (!responseText) return null;

    try {
        return JSON.parse(responseText);
    } catch {
        return null;
    }
};

const getErrorMessage = (payload: unknown, fallbackErrorMessage: string) => {
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
        return payload.message;
    }

    return fallbackErrorMessage;
};

export const sendFormDataRequest = <TResponse>({
    body,
    fallbackErrorMessage,
    isResponse,
    method,
    onUploadProgress,
    unexpectedResponseMessage,
    url,
}: SendFormDataRequestParams<TResponse>) => {
    return new Promise<TResponse>((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open(method, url);
        request.setRequestHeader(ADMIN_REQUEST_HEADER_NAME, ADMIN_REQUEST_HEADER_VALUE);

        request.upload.addEventListener("loadstart", () => {
            onUploadProgress?.(0);
        });
        request.upload.addEventListener("progress", event => {
            if (!event.lengthComputable) return;

            onUploadProgress?.(Math.round((event.loaded / event.total) * 100));
        });
        request.upload.addEventListener("load", () => {
            onUploadProgress?.(100);
        });

        request.addEventListener("load", () => {
            const payload = parsePayload(request.responseText);

            if (request.status < 200 || request.status >= 300) {
                reject(new Error(getErrorMessage(payload, fallbackErrorMessage)));
                return;
            }

            if (!isResponse(payload)) {
                reject(new Error(unexpectedResponseMessage));
                return;
            }

            resolve(payload);
        });
        request.addEventListener("error", () => reject(new Error(fallbackErrorMessage)));
        request.addEventListener("abort", () => reject(new Error(fallbackErrorMessage)));

        request.send(body);
    });
};
