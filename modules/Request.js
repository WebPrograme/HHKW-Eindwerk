const baseUrl = 'https://hhkw-eindwerk-api.onrender.com';

async function postRequest(path, data, headers = { 'Content-Type': 'application/json' }, retry = false, trigger = null) {
	if (trigger) trigger.classList.add('disabled');

	return new Promise((resolve, reject) => {
		fetch(baseUrl + path, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: headers,
		})
			.then(async (response) => {
				if (200 <= response.status && response.status < 300) {
					let data;

					if (response.headers.get('Content-Type').includes('application/json')) {
						data = await response.json();
					} else {
						data = response.text();
					}

					resolve({ status: response.status, data: data });
				} else if (retry) {
					postRequest(path, data, headers, false);
				} else {
					reject({ status: response.status, data: response });
				}
			})
			.catch((error) => {
				reject(error);
			})
			.finally(() => {
				if (trigger) trigger.classList.remove('disabled');
			});
	});
}

async function getRequest(path, headers = { 'Content-Type': 'application/json' }, retry = true, trigger = null) {
	if (trigger) trigger.classList.add('disabled');

	return new Promise((resolve, reject) => {
		fetch(baseUrl + path, {
			method: 'GET',
			headers: headers,
		})
			.then(async (response) => {
				if (200 <= response.status && response.status < 300) {
					let data;

					if (response.headers.get('Content-Type').includes('application/json')) {
						data = await response.json();
					} else {
						data = await response.text();
					}

					resolve({ status: response.status, data: data });
				} else if (retry) {
					const retry = await getRequest(path, headers, false);

					if (200 <= retry.status && retry.status < 300) {
						resolve(retry);
					} else {
						reject({ status: retry.status, data: retry });
					}
				} else {
					reject({ status: response.status, data: response });
				}
			})
			.catch((error) => {
				reject(error);
			})
			.finally(() => {
				if (trigger) trigger.classList.remove('disabled');
			});
	});
}

export { postRequest, getRequest };
