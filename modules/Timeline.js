export default class Timeline {
	constructor(element, options = { items: [], sortOn: null, sortDirection: 'asc', oneSide: false, startSide: 'left' }) {
		this.element = element;
		this.options = options;
		this.items = this.options.items;
		this.prevSide = this.options.startSide === 'left' ? 'right' : 'left';

		this.init();
	}

	init() {
		this.element.classList.add('timeline');

		if (this.options.sortOn && this.items.length > 0) {
			// Check if the sortOn property is a valid property
			if (!this.items[0].hasOwnProperty(this.options.sortOn)) {
				console.error(`Property ${this.options.sortOn} does not exist on the items.`);
				return;
			}

			// Sort the items by the sortOn property
			this.items.sort((a, b) => {
				if (a[this.options.sortOn] < b[this.options.sortOn]) {
					return 1;
				} else if (a[this.options.sortOn] > b[this.options.sortOn]) {
					return -1;
				}

				return 0;
			});

			if (this.options.sortDirection === 'asc') {
				this.items.reverse();
			}
		}

		this.items.forEach((item) => {
			this.createItem(item);
		});
	}

	addItems(items) {
		this.items = this.items.concat(items);

		// Sort the items by the sortOn property
		if (this.options.sortOn) {
			this.items.sort((a, b) => {
				if (a[this.options.sortOn] < b[this.options.sortOn]) {
					return 1;
				} else if (a[this.options.sortOn] > b[this.options.sortOn]) {
					return -1;
				}

				return 0;
			});

			if (this.options.sortDirection === 'asc') {
				this.items.reverse();
			}
		}

		this.items.forEach((item) => {
			this.createItem(item);
		});
	}

	createItem(item) {
		const side = this.options.oneSide ? this.options.startSide : this.prevSide === 'left' ? 'right' : 'left';
		const timelineItem = document.createElement('div');
		timelineItem.classList.add('timeline-item');

		const timelineItemContent = document.createElement('div');
		timelineItemContent.classList.add('timeline-content');

		if (item.image) {
			const timelineItemImage = document.createElement('a');
			timelineItemImage.setAttribute('data-pswp-src', item.image);
			timelineItemImage.innerHTML = `<img src="${item.image}" alt="${item.title}" class="timeline-image" onload="(function(img){
				const parent = img.parentElement;
				const width = img.naturalWidth;
				const height = img.naturalHeight;

				parent.setAttribute('data-pswp-width', width);
				parent.setAttribute('data-pswp-height', height);})(this)">`;
			timelineItemContent.appendChild(timelineItemImage);
		}

		if (item.title) {
			const timelineItemTitle = document.createElement('h3');
			timelineItemTitle.textContent = item.title;
			timelineItemContent.appendChild(timelineItemTitle);

			// Vroonhof tag, TODO: configure this in the backend
			if (item.vroonhofTag) {
				const timelineItemTag = document.createElement('span');
				timelineItemTag.classList.add('timeline-tag');
				timelineItemTag.textContent = 'Vroonhof';

				if (side === 'left') {
					timelineItemTitle.insertBefore(timelineItemTag, timelineItemTitle.firstChild);
				} else {
					timelineItemTitle.appendChild(timelineItemTag);
				}
			}
		} else if (item.tag) {
			const timelineItemTag = document.createElement('span');
			timelineItemTag.classList.add('timeline-tag');
			timelineItemTag.textContent = item.tag;
			timelineItemContent.appendChild(timelineItemTag);
		}

		if (item.date) {
			const timelineItemDate = document.createElement('span');
			timelineItemDate.classList.add('timeline-date');
			timelineItemDate.textContent = item.date;
			timelineItemContent.appendChild(timelineItemDate);
		}

		if (item.content) {
			const timelineItemDescription = document.createElement('p');
			timelineItemDescription.textContent = item.content;
			timelineItemContent.appendChild(timelineItemDescription);
		}

		timelineItem.appendChild(timelineItemContent);

		if (this.options.oneSide) {
			timelineItem.classList.add('timeline-item-one-side');
			timelineItem.classList.add(`timeline-${this.options.startSide}`);
		} else {
			timelineItem.classList.add(`timeline-${side}`);
			this.prevSide = side;
		}

		this.element.appendChild(timelineItem);
	}
}
