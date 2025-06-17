import { getRequest, postRequest } from '../modules/Request.js';
import { Articles } from '../modules/Components.js';

// Newsletter subscription
const newsletterSignupBtn = document.getElementById('newsletter-signup');
if (newsletterSignupBtn) {
	newsletterSignupBtn.addEventListener('click', async (e) => {
		e.preventDefault();

		const form = e.target.closest('.form-group');
		const email = form.querySelector('input[name="email"]').value;

		if (!email) {
			form.querySelector('#newsletter-error p').innerHTML = 'Gebruik een geldig e-mailadres.';
			form.querySelector('#newsletter-error').classList.add('show');
			form.querySelector('#newsletter-success').classList.remove('show');
			return;
		}

		try {
			const response = await postRequest('/api/form/newsletter/subscribe', { email });
			console.log('Response from newsletter subscription:', response);

			form.querySelector('#newsletter-success p').innerHTML = 'Bedankt voor uw inschrijving!';
			form.querySelector('#newsletter-success').classList.add('show');
			form.querySelector('#newsletter-error').classList.remove('show');
			form.querySelector('input').value = ''; // Clear the input field
			form.querySelector('input').blur(); // Remove focus from the input field
		} catch (error) {
			if (error.status === 400) {
				form.querySelector('#newsletter-error p').innerHTML = 'Gebruik een geldig e-mailadres.';
			} else if (error.status === 401) {
				form.querySelector('#newsletter-error p').innerHTML = 'Dit e-mailadres is al ingeschreven.';
			}

			form.querySelector('#newsletter-success').classList.remove('show');
			form.querySelector('#newsletter-error').classList.add('show');
		}
	});
}

// Get recent 5 blog posts
async function getBlogPosts() {
	const posts = await getRequest('/api/blog/articles/all?page=0&count=5');

	return posts.data['Articles'];
}

// Get upcoming event
async function getUpcomingEvents() {
	const events = await getRequest('/api/blog/events/all?hidePast=true');

	return events.data;
}

// Main function
async function main() {
	const events = await getUpcomingEvents();

	if (events['Total'] > 0) {
		const firstEvent = Object.values(events['Events'])[0];

		const navblock = document.querySelector('.nav-block#activities');
		navblock.querySelector('.nav-block-top').style.setProperty('--nav-block-image', `url(${firstEvent.Image})`);

		navblock.querySelector('.nav-block-bottom p').innerHTML = `<span>${new Date(firstEvent.Date).getDate()} ${new Date(firstEvent.Date).toLocaleString('nl-be', {
			month: 'short',
		})}</span> ${firstEvent.Title}`;
	}

	// Recent blog posts
	const posts = await getBlogPosts();
	new Articles(Object.values(posts), document.querySelector('.articles-grid'));

	// Hide loader
	document.getElementById('articles-loader').classList.add('hidden');
}

main();
