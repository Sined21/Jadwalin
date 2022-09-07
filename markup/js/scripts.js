let loadLazyLoadScript = false;

document.addEventListener('DOMContentLoaded', function () {
	lazyLoad();
	initTabs();
});

// replaseInlineSvg
function replaseInlineSvg(el) {
	var imgID = el.getAttribute('id');
	var imgClass = el.getAttribute('class');
	var imgURL = el.getAttribute('src');
	fetch(imgURL).then(function(data) {
		return data.text();
	}).then(function(response) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(response, 'text/html');
		var svg = xmlDoc.querySelector('svg');
		if (typeof imgID !== 'undefined') {
			svg.setAttribute('id', imgID);
		}
		if (typeof imgClass !== 'undefined') {
			svg.setAttribute('class', imgClass + ' replaced-svg');
		}
		svg.removeAttribute('xmlns:a');
		el.parentNode.replaceChild(svg, el);
	});
}

// lazyLoad
function lazyLoad() {
	if ('loading' in HTMLImageElement.prototype) {
		var images = document.querySelectorAll('img.lazyload');
		images.forEach(function (img) {
			img.src = img.dataset.src;
			img.onload = function () {
				img.classList.add('lazyloaded');
			};
			if (img.classList.contains('svg-html')) {
				replaseInlineSvg(img);
			}
		});
	} else {
		if (!loadLazyLoadScript) {
			loadLazyLoadScript = true;
			var script = document.createElement('script');
			script.async = true;
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js';
			document.body.appendChild(script);
		}
		document.addEventListener('lazyloaded', function (e) {
			var img = e.target;
			if (img.classList.contains('svg-html')) {
				replaseInlineSvg(img);
			}
		});
	}
}

function initTabs() {
	const tabButtons = document.querySelectorAll('[data-tab-button]');
	const tabContents = document.querySelectorAll('[data-tab-content]');
	tabButtons.length > 0 && tabContents.length > 0 ? tabHandle(tabButtons, tabContents) : false;

	function tabHandle(tabButtons, tabContents) {
		tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				const activeTab = button.dataset.tabButton;
				setActiveAnchor(activeTab);
			});
		});
	
		function setActiveAnchor(anchor) {
			tabButtons.forEach(btn => {
				btn.classList.remove('is-active');
			});
			tabContents.forEach((tab, ind) => {
				const tabContent = tab.dataset.tabContent;
				if (tabContent === anchor) {
					tab.classList.add('is-active');
					tabButtons[ind].classList.add('is-active');
				}
				else {
					tab.classList.remove('is-active');
				}
			});
		}
	}
}