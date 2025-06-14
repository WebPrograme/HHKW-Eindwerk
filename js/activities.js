import { getRequest } from '../modules/Request.js';
import { Articles } from '../modules/Components.js';

// Upcoming carousel arrows
document.querySelector('.activities-upcoming-arrow-left').addEventListener('click', () => {
	const carousel = document.querySelector('.activities-upcoming-inner');
	carousel.classList.add('scrolling');
	carousel.scrollLeft -= 400;

	carousel.addEventListener('scrollend', () => {
		carousel.classList.remove('scrolling');
	});
});

document.querySelector('.activities-upcoming-arrow-right').addEventListener('click', () => {
	const carousel = document.querySelector('.activities-upcoming-inner');
	carousel.classList.add('scrolling');
	carousel.scrollLeft += 400;

	carousel.addEventListener('scrollend', () => {
		carousel.classList.remove('scrolling');
	});
});

document.querySelector('.activities-upcoming-inner').addEventListener('scroll', () => {
	const carousel = document.querySelector('.activities-upcoming-inner');

	if (carousel.scrollLeft === 0) {
		document.querySelector('.activities-upcoming-arrow-left').classList.add('disabled');
		carousel.parentElement.classList.add('start');
	} else {
		document.querySelector('.activities-upcoming-arrow-left').classList.remove('disabled');
		carousel.parentElement.classList.remove('start');
	}

	if (Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth) {
		document.querySelector('.activities-upcoming-arrow-right').classList.add('disabled');
		carousel.parentElement.classList.add('end');
	} else {
		document.querySelector('.activities-upcoming-arrow-right').classList.remove('disabled');
		carousel.parentElement.classList.remove('end');
	}
});

// Upcoming carousel drag
let isDown = false;
let startX;
let scrollLeft;

document.querySelector('.activities-upcoming-inner').addEventListener('mousedown', (e) => {
	isDown = true;
	startX = e.pageX - document.querySelector('.activities-upcoming-inner').offsetLeft;
	scrollLeft = document.querySelector('.activities-upcoming-inner').scrollLeft;

	document.querySelector('.activities-upcoming-inner').classList.remove('scrolling');
	document.querySelector('.activities-upcoming-inner').classList.add('grabbing');
});

document.querySelector('.activities-upcoming-inner').addEventListener('mouseleave', () => {
	isDown = false;
	document.querySelector('.activities-upcoming-inner').classList.remove('grabbing');
});

document.querySelector('.activities-upcoming-inner').addEventListener('mouseup', () => {
	isDown = false;
	document.querySelector('.activities-upcoming-inner').classList.remove('grabbing');
});

document.querySelector('.activities-upcoming-inner').addEventListener('mousemove', (e) => {
	if (!isDown) return;
	e.preventDefault();
	const x = e.pageX - document.querySelector('.activities-upcoming-inner').offsetLeft;
	const walk = x - startX; //scroll-fast
	document.querySelector('.activities-upcoming-inner').scrollLeft = scrollLeft - walk;
});

// Get recent 5 blog posts
async function getBlogPosts() {
	const posts = await getRequest('/api/blog/articles/all?page=0&count=5');

	return posts.data['Articles'];
}

// Get upcoming events
async function getUpcomingEvents() {
	const events = await getRequest('/api/blog/events/all?hidePast=true');

	return events.data['Events'];
}

// Create upcoming event card
function createEventCards(events, parent) {
	Object.values(events).forEach((event) => {
		const card = document.createElement('div');
		card.classList.add('activities-upcoming-item');

		card.innerHTML = `
		<div class="activities-upcoming-item-date">
			<span>${new Date(event.Date).getDate()}</span>
			<span>${new Date(event.Date).toLocaleString('default', { month: 'short' })}</span>
		</div>

		<div class="activities-upcoming-item-title"><span>${event.Title}</span></div>`;

		parent.appendChild(card);
	});
}

// Main function
async function main() {
	const events = await getUpcomingEvents();
	const posts = await getBlogPosts();

	// Create upcoming events
	const upcoming = document.querySelector('.activities-upcoming-inner');
	createEventCards(events, upcoming);

	// Create posts
	new Articles(Object.values(posts), document.querySelector('.articles-grid'));

	// Hide loader
	document.getElementById('articles-loader').classList.add('hidden');
}

main();
