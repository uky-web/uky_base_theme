'use strict';

var togglebutton = function togglebutton() {
  $('.toggle-button').each(function (i, e) {
    if ($(e).data('toggle-viz') == true) {
      var $button = $(e);
      var $toggle = $($button.data('toggle'));
      var original_label = $button.find('.label').text();
      var original_icon = $button.find('.ic').attr('class').match(/ic--(\w+)/)[1];
      $button.data('toggle-icon', original_icon);
      $button.data('toggle-label', original_label);
      if ($toggle.prop('hidden')) {
        $toggle.attr('aria-hidden', true);
      }
    }
  });
  $('.toggle-button').on('click', function (e) {
    var $button = $(e.currentTarget);
    var toggleclass = $button.data('toggle-class');
    var toggleviz = $button.data('toggle-viz') == true;
    var $toggle = $($button.data('toggle'));
    var pressed = $button.attr('aria-pressed') == 'true';
    var toggled_label = $button.data('toggle-toggled-label');
    var toggled_icon = $button.data('toggle-toggled-icon');
    var original_label = $button.data('toggle-label');
    var original_icon = $button.data('toggle-icon');
    var newpressed = pressed ? 'false' : 'true';
    if (toggled_label) {
      var nextLabel = newpressed == 'true' ? toggled_label : original_label;
      $button.find('.label').text(nextLabel);
    }
    if (toggled_icon) {
      var nextIcon = newpressed == 'true' ? toggled_icon : original_icon;
      var removeIcon = newpressed == 'true' ? original_icon : toggled_icon;
      $button.find('.ic').addClass('ic--' + nextIcon).removeClass('ic--' + removeIcon);
    }
    if (toggleclass) {
      $toggle.toggleClass(toggleclass, newpressed);
    }
    if (toggleviz) {
      var isHidden = $toggle.prop('hidden');
      $toggle.prop('hidden', !isHidden);
      $toggle.attr({
        'aria-hidden': !isHidden
      });
    }
    $button.attr('aria-pressed', newpressed);
  });
};
//# sourceMappingURL=toggle-button.js.map
