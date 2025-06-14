import { postRequest } from '../modules/Request.js';

document.querySelector('.help-form').addEventListener('submit', (e) => {
	e.preventDefault();

	const form = e.currentTarget;
	const formData = JSON.parse(JSON.stringify(Object.fromEntries(new FormData(form))));

	postRequest('/api/form/submit', formData, { 'Content-Type': 'application/json' }, true, form.querySelector('button')).then(() => {
		form.reset();
	});
});
