export default class Share {
	constructor(parent, link, text, options = ['x', 'facebook', 'whatsapp', 'email', 'copy']) {
		this.parent = parent;
		this.link = link;
		this.text = text;
		this.options = options;

		this.create(parent, link, text, options);
	}

	create(parent, link, text, options) {
		// Main container
		const container = document.createElement('div');
		container.classList.add('share');

		// X
		if (options.includes('x')) {
			const x = document.createElement('a');
			x.classList.add('share-x');
			x.href = `https://twitter.com/intent/tweet?text=${text.replace(/ /g, '%20')}&url=${link}`;
			x.target = '_blank';
			x.innerHTML = '<i class="fa-brands fa-x-twitter"></i>';
			container.appendChild(x);
		}

		// Facebook
		if (options.includes('facebook')) {
			const facebook = document.createElement('a');
			facebook.classList.add('share-facebook');
			facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
			facebook.target = '_blank';
			facebook.innerHTML = '<i class="fa-brands fa-facebook"></i>';
			container.appendChild(facebook);
		}

		// WhatsApp
		if (options.includes('whatsapp')) {
			const whatsapp = document.createElement('a');
			whatsapp.classList.add('share-whatsapp');
			whatsapp.href = `https://api.whatsapp.com/send?text=${text.replace(/ /g, '%20')}%20${link}`;
			whatsapp.target = '_blank';
			whatsapp.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
			container.appendChild(whatsapp);
		}

		// Email
		if (options.includes('email')) {
			const email = document.createElement('a');
			email.classList.add('share-email');
			email.href = `mailto:?subject=${text}&body=${text}%0A${link}`;
			email.innerHTML = '<i class="fa-solid fa-envelope"></i>';
			container.appendChild(email);
		}

		// Copy
		if (options.includes('copy')) {
			const copy = document.createElement('a');
			copy.classList.add('share-copy');
			copy.innerHTML = '<i class="fa-solid fa-link"></i>';
			copy.addEventListener('click', () => {
				navigator.clipboard.writeText(link);
			});
			container.appendChild(copy);
		}

		parent.appendChild(container);
	}
}
