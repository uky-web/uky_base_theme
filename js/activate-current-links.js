'use strict';

var $ = jQuery;

Drupal.behaviors.activate_current_links = {
  attach: function attach(context, settings) {
    $('a').each(function () {
      var $a = $(this);
      var url = $a.attr('href');
      if (url == window.location.href || url == window.location.pathname) {
        $a.addClass('is-active');
      }
      return;
    });
    return;
  }
};
//# sourceMappingURL=activate-current-links.js.map
