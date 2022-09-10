
document.addEventListener('DOMContentLoaded', () => {
	// variables //
  const cursorCustom = document.querySelectorAll('[data-cursor-custom]');
	const header = document.querySelector('[data-header]');
	const navigationLink = document.querySelectorAll('[data-nav-link]');
	const mobileToggle = document.querySelector('[data-toggle-mobile]');
  const svgLine = document.querySelector('[data-svg-line');

	/// Diagonal svg effect ///

	window.onscroll = () => {
		const scroll = window.scrollY;
		//30 is the starting width
		//alter the amount of growth by changing scroll/x
		svgLine.setAttribute('stroke-width', 30 + scroll / 10 + '%');

		// Sticky header //
		if (scroll > 100) {
			header.classList.add('is-sticky');
		} else {
			header.classList.remove('is-sticky');
		}
	};

	/// custom cursor ///

	const moveCursor = (e) => {
		const mouseY = e.pageY;
		const mouseX = e.pageX;

    for (let element of cursorCustom) {
      element.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
	};

	window.addEventListener('mousemove', moveCursor);

	// Mobile Navigation & Navigation Scroll //

	mobileToggle.addEventListener('click', () => {
		if (header.classList.contains('is-open')) {
			header.classList.remove('is-open');
		} else {
			header.classList.add('is-open');
		}
	});

  for (let link of navigationLink) {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      let sectionId = e.target.getAttribute('href');
      let headerHeight = 105;;
      let scrollTarget = document.querySelector(sectionId);

      if (header.classList.contains('is-open')) {
        header.classList.remove('is-open');
      }
      window,scrollTo(0, scrollTarget.offsetTop - headerHeight);
    });
  }
});
