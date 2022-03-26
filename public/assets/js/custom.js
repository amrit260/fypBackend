jQuery(document).ready(function ($) {
  'use strict';

  $(function () {
    $('#tabs').tabs();
  });

  // Page loading animation

  $('#preloader').animate(
    {
      opacity: '0',
    },
    600,
    function () {
      setTimeout(function () {
        $('#preloader').css('visibility', 'hidden').fadeOut();
      }, 300);
    }
  );

  if ($('.header-text-homepage').length == 0) {
    $('#header').addClass('background-header');
  }

  // console.log(homepage);

  $(window).scroll(function () {
    if ($('.header-text-homepage').length == 1) {
      // console.log('on homepage');
      var scroll = $(window).scrollTop();
      var box = $('.header-text').height() + 100;
      var header = $('#header').height();

      if (scroll >= box - header) {
        $('#header').addClass('background-header');
      } else {
        $('#header').removeClass('background-header');
      }
    } else {
      $('#header').addClass('background-header');
    }
  });
});
