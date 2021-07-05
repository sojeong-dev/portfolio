$(function() {
  'use strict';

  showIndicatorContFn();

  function showIndicatorContFn() {
    var $indicatorMenu = $('#pageNav > ul.indicator > li > a');

    $indicatorMenu.on('click', function() {
      var contID = $(this).attr('href'),
    });
  }

})