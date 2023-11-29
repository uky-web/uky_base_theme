'use strict';

/* 
 * Ambient video processing and initialization. 
 */

var ambient_video = function ambient_video() {
  var $av = $('.ambient-video video');
  if ($av.length < 1) return; // Bail if we have no matching components

  var $sources = $av.find('source');

  if (window.matchMedia('(min-width: 64rem)').matches) {
    $av.attr('autoplay', true);
    $av[0].play();

    // Since the video is working, enable the play / pause control
    var $control = $('.ambient-video button');
    $control.show();
    $control.click(function (e) {
      var $button = $(e.currentTarget);
      var video = $button.siblings('video')[0];
      $button.toggleClass('video-button--paused');
      if (video.paused) {
        video.play();
        $button.attr('aria-label', $button.data('pressed-label'));
      } else {
        video.pause();
        $button.attr('aria-label', $button.data('unpressed-label'));
      }
    });
  } else {
    $av[0].stop();
  }
};
//# sourceMappingURL=ambient-video.js.map
