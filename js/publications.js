import { getRequest } from '../modules/Request.js';
import { Publications } from '../modules/Components.js';

async function main() {
	// Get publications
	const publications = await getRequest('/api/publications/all');

	// Create publication list
	new Publications(Object.values(publications.data['Publications']), document.querySelector('.publications-main'));

	lucide.createIcons();

	// Hide loader
	document.getElementById('publications-loader').classList.add('hidden');
}

main();
