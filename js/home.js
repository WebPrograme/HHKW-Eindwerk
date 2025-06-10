import { getRequest, postRequest } from '../modules/Request.js';
import { Articles } from '../modules/Components.js';

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
