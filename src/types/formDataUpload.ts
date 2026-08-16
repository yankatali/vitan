export type UploadProgressHandler = (progress: number) => void;

export interface SendFormDataRequestParams<TResponse> {
    body: FormData;
    fallbackErrorMessage: string;
    isResponse: (value: unknown) => value is TResponse;
    method: "POST" | "PUT";
    onUploadProgress?: UploadProgressHandler;
    unexpectedResponseMessage: string;
    url: string;
}
