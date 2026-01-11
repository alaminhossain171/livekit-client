import axios from 'axios';

/* -------------------- Types -------------------- */

export type LiveKitRole = 'publisher' | 'subscriber' | 'camera-only' | 'admin';

export interface FetchTokenParams {
  roomName: string;
  participantName: string;
  role?: LiveKitRole;
}

export interface FetchTokenResponse {
  token: string;
  livekitUrl: string;
  role: LiveKitRole;
}

/* -------------------- Axios instance -------------------- */

const BASE_URL = 'http://192.168.12.242:3001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -------------------- API function -------------------- */

export async function fetchLiveKitToken(
  params: FetchTokenParams,
): Promise<FetchTokenResponse> {
  try {
    const response = await api.post<FetchTokenResponse>('/api/token', {
      roomName: params.roomName,
      participantName: params.participantName,
      role: params.role ?? 'publisher',
    });
    console.log(response?.data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.response?.data || error.message;

      throw new Error(`Token fetch failed: ${message}`);
    }

    throw new Error('Token fetch failed: Unknown error');
  }
}
