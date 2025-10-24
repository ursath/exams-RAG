import { fetchAuthSession } from "aws-amplify/auth";
import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { createParser } from "eventsource-parser";
import { API_CONFIG } from "../constants/api";

const attachAuthToken = async (
	config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
	try {
		const session = await fetchAuthSession();
		const token = session.tokens?.idToken?.toString();
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	} catch {}
	return config;
};

const handleRequestError = (error: AxiosError): Promise<AxiosError> =>
	Promise.reject(error);

const handleSuccessResponse = (response: AxiosResponse): AxiosResponse =>
	response;

const handleResponseError = (error: AxiosError): Promise<AxiosError> => {
	if (error.response?.status === 401) {
		window.location.href = "/login";
	}
	return Promise.reject(error);
};

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_CONFIG.LAMBDA_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		this.client.interceptors.request.use(attachAuthToken, handleRequestError);
		this.client.interceptors.response.use(
			handleSuccessResponse,
			handleResponseError,
		);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.client.post<T>(url, data, config);
		return response.data;
	}

	async stream(
		url: string,
		data?: unknown,
		handlers?: {
			onToken: (token: string) => void;
			onError?: (error: string) => void;
			onRetry?: (retryInSeconds: number) => void;
			onPause?: (shouldContinue: boolean) => void;
		},
		signal?: AbortSignal,
	): Promise<void> {
		const { onToken, onError, onRetry, onPause } = handlers || {};

		if (!onToken) {
			throw new Error("onToken handler is required");
		}

		try {
			const session = await fetchAuthSession();
			const token = session.tokens?.idToken?.toString();

			const response = await fetch(`${API_CONFIG.LAMBDA_URL}${url}`, {
				body: JSON.stringify(data),
				headers: {
					Accept: "text/event-stream",
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				method: "POST",
				mode: "cors",
				...(signal && { signal }),
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(`HTTP ${response.status}: ${text}`);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error("No response body");
			}

			const decoder = new TextDecoder("utf-8");
			let currentIndex = -1;

			const parser = createParser({
				onError(error) {
					console.error("SSE Parser Error:", error.message);
					onError?.(error.message);
				},
				onEvent(event) {
					if (event.event === "done") {
						return;
					}

					try {
						switch (event.event) {
							case "message_delta": {
								if (!event.data || event.data.trim() === "") {
									return;
								}
								const obj = JSON.parse(event.data);
								const { data, index } = obj;
								if (data) {
									currentIndex = index;
									onToken(data);
								}
								break;
							}
							case "message_pause": {
								onPause?.(true);
								break;
							}
							case "message_delta_stop": {
								const obj = JSON.parse(event.data);
								const { data } = obj;
								if (currentIndex === data) {
									onToken("\n\n");
								}
								break;
							}
							case "message_retry": {
								const obj = JSON.parse(event.data);
								const { data } = obj;
								onRetry?.(Math.floor(data / 1000));
								break;
							}
							case "message_failed":
							case "error": {
								const obj = JSON.parse(event.data);
								const { data } = obj;
								onError?.(data);
								break;
							}
						}
					} catch (err) {
						console.error("Event parsing error:", err);
					}
				},
			});

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				parser.feed(decoder.decode(value, { stream: true }));
			}
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was aborted");
				return;
			}
			console.log(err.name);
			console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
			const errorMessage =
				err.message ||
				`Unknown error: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
			console.error(errorMessage);
			onError?.(errorMessage);
		}
	}
}

export const apiClient = new ApiClient();
