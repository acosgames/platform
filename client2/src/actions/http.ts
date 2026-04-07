import versions from 'shared/model/versions.json';
import { btHistory, btVersion } from './buckets';


type HttpResponse<T = any> = {
    data: T;
    headers: Record<string, string>;
    status: number;
    ok: boolean;
};

function normalizeHeaders(headers: Headers): Record<string, string> {
    const out: Record<string, string> = {};
    headers.forEach((value, key) => {
        out[key.toLowerCase()] = value;
    });
    return out;
}

async function parseResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

async function request(url: string, init: RequestInit): Promise<HttpResponse> {
    const response = await fetch(url, init);
    const data = await parseResponseBody(response);
    return {
        data,
        headers: normalizeHeaders(response.headers),
        status: response.status,
        ok: response.ok,
    };
}


export async function GET(url:string, extras?: any) {
    let response = await request(url, {
        method: 'GET',
        ...HEADERS(extras)
    });

    //Check for new client version from server
    if (response?.headers?.v) {
        let savedVersion = btVersion.get();
        let clientVersion = Number(versions.client.version);
        let serverVersion = Number(response.headers.v);
        if (clientVersion < serverVersion) {
            if (serverVersion != savedVersion)
                btVersion.set(serverVersion);
        }
    }

    //check for unauthorized error
    if (response.data && response.data.ecode) {
        let ecode = response.data.ecode;
        if (ecode == 'E_NOTAUTHORIZED' && url != '/api/v1/person' && url.indexOf('/api/v1/game/lbhs/') == -1) {
            let history = btHistory.get();
            history('/login');
        }
    }
    return response;
}

export async function POSTFORM(url: string, data: any, extras?: any) {
    const config = HEADERS(extras);
    const headers = { ...(config.headers || {}) };

    // Let the browser add multipart boundaries automatically for FormData.
    if (data instanceof FormData) {
        delete headers['Content-Type'];
        delete headers['content-type'];
    }

    let response = await request(url, {
        method: 'POST',
        ...config,
        headers,
        body: data,
    });
    if (response.data && response.data.ecode) {
        let ecode = response.data.ecode;
        if (ecode == 'E_NOTAUTHORIZED') {
            let history = btHistory.get();
            history('/login');
        }
    }
    return response;
}

export async function POST(url: string, data: any, extras?: any) {
    const config = HEADERS(extras);
    const headers = {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
    };

    let response = await request(url, {
        method: 'POST',
        ...config,
        headers,
        body: JSON.stringify(data),
    });

    //Check for new client version from server
    if (response?.headers?.v) {
        let savedVersion = btVersion.get();
        let clientVersion = Number(versions.client.version);
        let serverVersion = Number(response.headers.v);
        if (clientVersion < serverVersion) {
            if (serverVersion != savedVersion)
                btVersion.set(serverVersion);
        }
    }

    //check for unauthorized error
    if (response.data && response.data.ecode) {
        let ecode = response.data.ecode;
        if (ecode == 'E_NOTAUTHORIZED') {
            let history = btHistory.get();
            history('/login');
        }
    }
    return response;
}

export function HEADERS(extras?: any) {
    if (extras) {
        return {
            ...extras
        }
    }

    return {
    }
}