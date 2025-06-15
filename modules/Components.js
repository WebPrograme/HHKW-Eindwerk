// Class for a single article
class Article {
	constructor(data, parent, isSmall = false, multiple = false) {
		this.data = data;
		this.parent = parent;
		this.article = null;

		if (isSmall) this.parent.classList.add('articles-grid-small');
		if (!multiple) {
			this.createArticle(data, parent, isSmall);

			this.resizeGrid(parent);
		}

		if (this.constructor === Article) {
			this.createArticle(data, parent, isSmall);
		}
	}

	createArticle(data, parent, isSmall) {
		const timestring = this.getTimeString(data.Timestamp);
		const article = document.createElement('a');
		article.classList.add('article', 'section', isSmall ? 'article-small' : 'article-large');
		article.href = `/pages/article.html?id=${data.ID}`;

		article.innerHTML = `
			<div class="article-image ${isSmall ? 'col-12' : 'col-5'}">
				<img src="${data.Image}" alt="${data.Title}" fetchpriority="high" loading="lazy" />
			</div>
			<div class="article-content ${isSmall ? 'col-12' : 'col-7'}">
				<h2>${data.Title}</h2>
				<span class="article-date">${timestring}</span>
				${
					isSmall
						? ''
						: `<p>
					${data.Description['0']}<br />
				</p>`
				}				
			</div>  `;

		this.article = article;

		parent.appendChild(article);

		const title = article.querySelector('.article-content h2');
		const text = article.querySelector('.article-content p');

		if (title && text) {
			const titleHeight = title.offsetHeight;
			const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
			const buffer = 10;

			if (titleHeight > lineHeight + buffer) {
				text.style.setProperty('--article-line-clamp', '2');
			} else {
				text.style.setProperty('--article-line-clamp', '3');
			}
		}
	}

	getTimeString(timestamp) {
		const now = new Date().getTime();
		const diff = now - timestamp;

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		let dateStr = '';

		switch (true) {
			case days > 3:
				dateStr = new Intl.DateTimeFormat('nl-BE', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}).format(new Date(timestamp));
				break;
			case days > 0:
				dateStr = `${days} dagen geleden`;
				break;
			case hours > 0:
				dateStr = `${hours} uur geleden`;
				break;
			case minutes > 0:
				dateStr = `${minutes} minuten geleden`;
				break;
			default:
				dateStr = 'Zojuist';
				break;
		}

		return dateStr;
	}

	resizeGrid(parent) {
		// Resize the grid
		const mediaQuery = window.matchMedia('(max-width: 998px)');

		if (mediaQuery.matches) {
			parent.classList.replace('col-10', 'col-12');
		} else {
			parent.classList.replace('col-12', 'col-10');
		}

		mediaQuery.addEventListener('change', (e) => {
			if (e.matches) {
				parent.classList.replace('col-10', 'col-12');
			} else {
				parent.classList.replace('col-12', 'col-10');
			}
		});
	}
}

// Class for a list of articles
class Articles extends Article {
	constructor(data, parent, isSmall = false) {
		super(data, parent, isSmall, true);
		this.createArticles(data, parent, isSmall);

		this.resizeGrid(parent);
	}

	createArticles(data, parent, isSmall) {
		data.forEach((article) => {
			this.createArticle(article, parent, isSmall);
		});
	}
}

// Class for a single publication
class Publication {
	constructor(data, parent) {
		this.data = data;
		this.parent = parent;
		this.publication = null;

		if (this.constructor === Publication) {
			this.createPublication(data, parent);
		}
	}

	createPublication(data, parent) {
		const publication = document.createElement('div');
		publication.classList.add('publication');

		publication.innerHTML = `
				<div class="publication-cover">
					<img src="${data.CoverImage}" />
				</div>
				<div class="publication-content">
					<h3>${data.Title}</h3>

					<div class="publication-content-buttons">
						<a class="btn btn-primary" href="${data.Content}" target="_blank">Lees</a>
						<a class="btn btn-primary" download href="${data.Content}"><i data-lucide="download"></i></a>
					</div>
				</div>`;

		this.publication = publication;

		parent.appendChild(publication);
	}
}

// Create a publication list
class Publications extends Publication {
	constructor(data, parent) {
		super(data, parent);
		this.createPublications(data, parent);
	}

	createPublications(data, parent) {
		data.forEach((publication) => {
			this.createPublication(publication, parent);
		});
	}
}

export { Article, Articles, Publication, Publications };
