document.addEventListener('DOMContentLoaded', () => {
	/// Diaginaol svg effect ///

	window.onscroll = () => {
		const scroll = $(window).scrollTop();
		//30 is the starting width
		//alter the amount of growth by changing scroll/x
		$('.diagonal-bg svg line').attr('stroke-width', 30 + scroll / 10 + '%');

    // Sticky header //
    if ($(window).scrollTop() > 100) {
			$('.main_h').addClass('sticky');
		} else {
			$('.main_h').removeClass('sticky');
		}
	};

	/// custom cursor ///
	const cursorLarge = document.querySelector('.cursor-circle--large');
	const cursorSmall = document.querySelector('.cursor-circle--small');

	const moveCursor = (e) => {
		const mouseY = e.pageY;
		const mouseX = e.pageX;

		cursorLarge.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

		cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
	};

	window.addEventListener('mousemove', moveCursor);

	// Mobile Navigation
	$('.mobile-toggle').click(function () {
		if ($('.main_h').hasClass('open-nav')) {
			$('.main_h').removeClass('open-nav');
		} else {
			$('.main_h').addClass('open-nav');
		}
	});

	$('.main_h li a').click(function () {
		if ($('.main_h').hasClass('open-nav')) {
			$('.navigation').removeClass('open-nav');
			$('.main_h').removeClass('open-nav');
		}
	});

	// navigation scroll
	$('nav a').click(function (event) {
		let id = $(this).attr('href');
		let offset = 70;
		let target = $(id).offset().top - offset;
		$('html, body').animate(
			{
				scrollTop: target,
			},
			500
		);
		event.preventDefault();
	});
});

 