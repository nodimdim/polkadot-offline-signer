import fetch from 'node-fetch';

/**
 * Send a JSONRPC request to the node at @param url.
 *
 * @param method - The JSONRPC request method.
 * @param params - The JSONRPC request params.
 */
export function rpcToNode(url: string, method: string, params: any[] = []): Promise<any> {
	return fetch(url, {
		body: JSON.stringify({
			id: 1,
			jsonrpc: '2.0',
			method,
			params,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	})
		.then((response) => response.json())
		.then(({ error, result }) => {
			if (error) {
				throw new Error(
					`${error.code} ${error.message}: ${JSON.stringify(error.data)}`
				);
			}

			return result;
		});
}