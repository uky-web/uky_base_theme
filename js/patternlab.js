'use strict';

/* 
 * code specific to patternlab goes here
 */

$(document).ready(function () {
  // Grid toggle behavior, dev only
  $('.gridToggle').on('click', function () {
    $('body').toggleClass('layout-grid--on');
  });
  // Include labels
  $('.includeToggle').on('click', function () {
    $('body').toggleClass('twig-includes--on');
  });

  // Initialize RIA components; 
  // this is handled differently in Drupal
  image_gallery();
  accordion();
  ambient_video();
  carousel();
  modals();
  togglebutton();
  responsive_grid_table();
});
//# sourceMappingURL=patternlab.js.map
