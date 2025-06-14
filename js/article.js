import { getRequest, postRequest } from '../modules/Request.js';
import Share from '../modules/Share.js';

// Get blog post by id
async function getBlogPost(id) {
	const post = await getRequest(`/api/blog/articles/${id}`).catch((error) => {
		return error;
	});
	return post;
}

// Get recent 3 blog posts
async function getBlogPosts() {
	const posts = await getRequest('/api/blog/all?page=0&count=3');
	return posts.data['Articles'];
}

// Show blog post
function showBlogPost(post) {
	const dateStr = new Intl.DateTimeFormat('nl-BE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(post.Timestamp));

	document.querySelector('.page-article-img img').src = post.Image;
	document.querySelector('.page-article-img img').alt = post.Title;
	document.querySelector('.page-article-title').textContent = post.Title;
	document.querySelector('head title').textContent = 'HHKW - ' + post.Title;
	document.querySelector('.page-article-date').textContent = dateStr;

	// Show article text
	// First line and then the Share component
	document.querySelector('.page-article-text').innerHTML = `<p>${Object.values(post.Description)[0]}</p>`;

	// Share component
	document.querySelector('.page-article-text').innerHTML += '<div class="page-article-share"></div>';
	new Share(document.querySelector('.page-article-share'), window.location.href, post.Title);

	// The rest of the article text
	document.querySelector('.page-article-text').innerHTML += Object.values(post.Description)
		.slice(1)
		.map((line) => `<p>${line}</p>`)
		.join('');
}

// Show recent blog posts
function showRecentBlogPosts(posts) {
	const container = document.querySelector('.page-article-recent-articles');
	Object.values(posts).forEach((post) => {
		const template = `
            <div class="recent-article">
                <img src="${post.Image}" alt="${post.Title}" />
                <div class="recent-article-content">
                    <h3>${post.Title}</h3>
                </div>
            </div>
        `;

		container.innerHTML += template;
	});
}

// Get blog post id from URL
function getBlogPostId() {
	const url = new URL(window.location.href);
	return url.searchParams.get('id');
}

// Get blog post and show it
async function init() {
	const id = getBlogPostId();

	if (!id) {
		window.location.href = '/index.html';
		return;
	}

	// Show blog post
	const post = await getBlogPost(id);
	if (post.status === 404) {
		window.location.href = '/index.html';
		return;
	}
	showBlogPost(post.data);
}

init();
