import axios from 'axios';

import { SimklHistoryResponse } from '@/types';
import { getConfig } from './lib/config';
import { getLogger } from './lib/requestContext';
import { SimklMediaType } from './lib/mediaTypes';

const SIMKL_API = 'https://api.simkl.com';

const SIMKL_TIMEOUT = 15000;

const logSimklError = (url: string, error: any) =>
	getLogger('simkl').error(
		{
			err: error,
			url,
			status: error.response?.status,
			response: error.response?.data,
		},
		'SIMKL API ERROR',
	);

async function simklApiGetRequest(url: string, token?: string) {
	try {
		return await axios.get(`${SIMKL_API}/${url}`, {
			timeout: SIMKL_TIMEOUT,
			headers: {
				'simkl-api-key': getConfig().simkl.clientId,
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
	} catch (error: any) {
		logSimklError(url, error);
		return null;
	}
}

async function simklApiPostRequest(url: string, data: any, token?: string) {
	try {
		return await axios.post(`${SIMKL_API}/${url}`, data, {
			timeout: SIMKL_TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
				'simkl-api-key': getConfig().simkl.clientId,
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
	} catch (error: any) {
		logSimklError(url, error);
		return null;
	}
}

export async function getSimklAccessToken(
	code: string,
): Promise<string | null> {
	const result = await simklApiPostRequest('oauth/token', {
		grant_type: 'authorization_code',
		code,
		client_id: getConfig().simkl.clientId,
		client_secret: getConfig().simkl.clientSecret,
		redirect_uri: 'http://localhost:5173',
	});

	if (!result) return null;

	return result.data.access_token;
}

export async function getSimklUserWatchList(
	token: string,
	type: SimklMediaType,
	status: 'watching' | 'plantowatch' | 'hold' | 'completed' | 'dropped',
): Promise<SimklHistoryResponse | null> {
	const result = await simklApiGetRequest(
		`sync/all-items/${type}/${status}`,
		token,
	);

	if (!result) return null;

	return result.data ?? {};
}

export async function getSimklUsername(token: string) {
	const result = await simklApiGetRequest('users/settings', token);

	if (!result || !result.data.user) return null;

	return result.data.user.name;
}
