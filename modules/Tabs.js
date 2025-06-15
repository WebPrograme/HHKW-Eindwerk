export default class Tabs {
	constructor(element, panelElement, options = { startTab: 0, tabActiveClass: 'tab-active', panelActiveClass: 'panel-active', evenly: false, stored: false }, callback) {
		this.element = element;
		this.tabs = this.element.querySelectorAll('.tab');
		this.panels = panelElement.querySelectorAll('*[data-value]');
		this.options = options;
		this.callback = callback;

		this.init();
	}

	init() {
		this.tabs[this.options.startTab].classList.add(this.options.tabActiveClass);
		this.panels[this.options.startTab].classList.add(this.options.panelActiveClass);

		if (this.options.stored) {
			const storedTab = localStorage.getItem('tab');
			if (storedTab) {
				this.tabs.forEach((tab) => {
					if (tab.getAttribute('data-value') === storedTab) {
						tab.classList.add(this.options.tabActiveClass);
					} else {
						tab.classList.remove(this.options.tabActiveClass);
					}
				});
				this.panels.forEach((panel) => {
					if (panel.getAttribute('data-value') === storedTab) {
						panel.classList.add(this.options.panelActiveClass);
					} else {
						panel.classList.remove(this.options.panelActiveClass);
					}
				});
			} else {
				this.tabs[this.options.startTab].classList.add(this.options.tabActiveClass);
				this.panels[this.options.startTab].classList.add(this.options.panelActiveClass);
			}
		}

		if (this.options.evenly) {
			this.element.classList.add('tabs-evenly');
		}

		this.tabs.forEach((tab) => {
			tab.addEventListener('click', (e) => {
				this.toggleTabs(e);
			});
		});
	}

	toggleTabs(e) {
		const tab = e.currentTarget;
		const tabId = tab.getAttribute('data-value');

		this.tabs.forEach((tab) => {
			tab.classList.remove(this.options.tabActiveClass);
		});

		let foundedPanel;
		this.panels.forEach((panel) => {
			panel.classList.remove(this.options.panelActiveClass);
			if (panel.getAttribute('data-value') === tabId) {
				panel.classList.add(this.options.panelActiveClass);
				foundedPanel = panel;
			}
		});

		tab.classList.add(this.options.tabActiveClass);

		if (this.options.stored) {
			localStorage.setItem('tab', tabId);
		}

		if (this.callback) {
			this.callback(tabId, tab, foundedPanel);
		}
	}

	getActiveTab() {
		return this.element.querySelector(`.${this.options.tabActiveClass}`).getAttribute('data-value');
	}
}
