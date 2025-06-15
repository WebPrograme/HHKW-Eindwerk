import { getRequest, postRequest } from '../modules/Request.js';

let lastImageDirection = 'left';

// Get all contact data
async function getContactSections() {
	const data = await getRequest('/api/contact/all');
	return data;
}

// Create contact section
function createContactSection(section, parent) {
	const type = section.Type;

	// Create section based on type
	if (type === 'TextOnly') {
		createTextOnlySection(section, parent);
	} else if (type === 'TextWithImage') {
		createTextWithImageSection(section, parent);
	}

	// Create text only section
	function createTextOnlySection(section, parent) {
		const div = document.createElement('div');
		div.classList.add('contact-header', 'col-10');
		div.innerHTML = `
				<h2>${section.Title}</h2>
				${section.Content.map((content) => `<p>${content}</p>`).join('')}
		`;
		parent.appendChild(div);
	}

	// Create text with image section
	function createTextWithImageSection(section, parent) {
		const div = document.createElement('div');
		div.classList.add('contact-section', lastImageDirection === 'left' ? 'right' : 'left');
		div.innerHTML = `
				<img class="contact-section-image" src="${section.Image}" alt="${section.Title}" />

				<div class="contact-section-content">
					<h3>${section.Title}</h3>
					${section.Content.map((content) => `<p>${content}</p>`).join('')}
				</div>
		`;
		parent.appendChild(div);

		lastImageDirection = lastImageDirection === 'left' ? 'right' : 'left';
	}
}

// Main function
async function init() {
	const data = await getContactSections();

	if (data.status !== 200) {
		return;
	}

	const sections = data.data;
	const container = document.querySelector('.contact-main');

	Object.values(sections).forEach((section) => {
		createContactSection(section, container);
	});
}

init();
