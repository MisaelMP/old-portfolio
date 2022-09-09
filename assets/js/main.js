document.addEventListener('DOMContentLoaded', () => {
	// variables //
  const cursorCustom = document.querySelectorAll('[data-cursor-custom]');
	const header = document.querySelector('[data-header]');
	const navigationLink = document.querySelector('[data-nav-link]');
	const mobileToggle = document.querySelector('[data-mobile-toggle]');

	/// Diaginaol svg effect ///

	window.onscroll = () => {
		const scroll = window.scrollY;
		//30 is the starting width
		//alter the amount of growth by changing scroll/x
		$('.diagonal-bg svg line').attr('stroke-width', 30 + scroll / 10 + '%');

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

	navigationLink.addEventListener('click', (e) => {
		let id = $(this).attr('href');
		let offset = 70;
		let target = $(id).offset().top - offset;

		if (header.classList.contains('is-open')) {
			// $('.navigation').removeClass('is-open');
			header.classList.remove('is-open');
		}
		$('html, body').animate(
			{
				scrollTop: target,
			},
			500
		);
		e.preventDefault();
	});
});
