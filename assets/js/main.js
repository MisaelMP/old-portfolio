$(document).ready(() => {



});


document.addEventListener('DOMContentLoaded', () => {
	/// Diaginaol svg effect ///

	window.onscroll = () => {
		const scroll = $(window).scrollTop();
		$('.diagonal-bg svg line').attr('stroke-width', 30 + scroll / 10 + '%');
		//30 is the starting width
		//alter the amount of growth by changing scroll/x
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

	// Sticky Header
	$(window).scroll(function () {
		if ($(window).scrollTop() > 100) {
			$('.main_h').addClass('sticky');
		} else {
			$('.main_h').removeClass('sticky');
		}
	});

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
		var id = $(this).attr('href');
		var offset = 70;
		var target = $(id).offset().top - offset;
		$('html, body').animate(
			{
				scrollTop: target,
			},
			500
		);
		event.preventDefault();
	});
});

 