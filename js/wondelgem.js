import Tabs from '../modules/Tabs.js';
import Timeline from '../modules/Timeline.js';
import { getRequest, postRequest } from '../modules/Request.js';
import PhotoSwipeLightbox from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe.esm.js';

const tabClass = new Tabs(
	document.querySelector('.tabs'),
	document.querySelector('.archive-panels'),
	{
		startTab: 0,
		tabActiveClass: 'tab-active',
		panelActiveClass: 'panel-active',
		evenly: true,
		stored: true,
	},
	(tab) => {
		if (tab === 'Tijdlijn') {
			updateTimeline();
		} else {
			updateList();
		}
	}
);
const timeline = new Timeline(document.querySelector('.timeline'), {
	items: [],
	sortOn: 'order',
	sortDirection: 'asc',
	oneSide: false,
	startSide: 'left',
});

const listGallery = new PhotoSwipeLightbox({
	gallery: '.archive-list a',
	showHideAnimationType: 'zoom',
	pswpModule: PhotoSwipe,
	closeOnVerticalDrag: true,
	pinchToClose: true,
	padding: { top: 40, bottom: 60, left: 10, right: 10 },
});
const timelineGallery = new PhotoSwipeLightbox({
	gallery: '.timeline-content>a',
	showHideAnimationType: 'zoom',
	pswpModule: PhotoSwipe,
	closeOnVerticalDrag: true,
	pinchToClose: true,
	padding: { top: 40, bottom: 60, left: 10, right: 10 },
});

const activeTab = tabClass.getActiveTab();
let timelineLastPage = null;
let listLastPage = null;

// Format date
function formatDate(date = { day, month, year }) {
	const [day, month, year] = Object.values(date);
	const isFullDate = year && month && day;

	if (isFullDate) {
		return new Intl.DateTimeFormat('nl-BE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(new Date(year, month, day));
	} else if (year && month) {
		return new Intl.DateTimeFormat('nl-BE', {
			year: 'numeric',
			month: 'long',
		}).format(new Date(year, month));
	} else if (year) {
		return new Intl.DateTimeFormat('nl-BE', {
			year: 'numeric',
		}).format(new Date(year));
	} else {
		return 'Onbekend';
	}
}

async function updateTimeline(page = 0) {
	if (timelineLastPage !== null && timelineLastPage >= page) return;

	const response = await getRequest('/api/archive/timeline?page=' + page);
	const articles = response.data.Articles;
	const isLastPage = response.data.IsLastPage;

	if (isLastPage) {
		document.querySelector('.timeline-load-more').classList.add('hidden');
	} else {
		document.querySelector('.timeline-load-more').classList.remove('hidden');
	}

	const timelineArticles = Object.values(articles).map((article) => {
		return {
			image: article.Image,
			title: article.Title,
			date: formatDate(article.Date),
			content: article.Description['0'],
			order: article.Order,
			vroonhofTag: article.VroonhofTag,
		};
	});

	timeline.addItems(timelineArticles);

	timelineLastPage = page;
	timelineGallery.init();
}

async function updateList(page = 0) {
	if (listLastPage !== null && listLastPage >= page) return;

	const response = await getRequest('/api/archive/all?page=' + page);
	const articles = response.data.Articles;
	const isLastPage = response.data.IsLastPage;

	if (isLastPage) {
		document.querySelector('.list-load-more').classList.add('hidden');
	} else {
		document.querySelector('.list-load-more').classList.remove('hidden');
	}

	const container = document.querySelector('.archive-list');

	Object.values(articles).forEach((article) => {
		const template = `
			<div class="archive-item ${article.Image ? 'archive-item-image' : ''}">
			${
				article.Image
					? `<a data-pswp-src="${article.Image}"> <img src="${article.Image}" alt="${article.Title}" onload="(function(img){
			 const parent = img.parentElement;
			 const width = img.naturalWidth;
			 const height = img.naturalHeight;

			 parent.setAttribute('data-pswp-width', width);
			 parent.setAttribute('data-pswp-height', height);
			 				 })(this)"> </a>`
					: ''
			}
				<h3>${article.Title}</h3>
				${Object.values(article.Date).every((value) => value === '') ? '' : `<span class="archive-date">${formatDate(article.Date)}</span>`}
				<p>${article.Description['0']}</p>
			</div>
		`;

		container.innerHTML += template;
	});

	listLastPage = page;
	listGallery.init();
}

// Load more buttons
document.querySelector('.timeline-load-more').addEventListener('click', () => {
	updateTimeline(timelineLastPage + 1);
});

document.querySelector('.list-load-more').addEventListener('click', () => {
	updateList(listLastPage + 1);
});

if (activeTab === 'Tijdlijn') {
	updateTimeline();
} else {
	updateList();
}
