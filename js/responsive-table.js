'use strict';

var responsive_grid_table = function responsive_grid_table() {
  var $table = $('.table-wrapper--columnize');
  if ($table.length < 1) return;

  var headers = $table.find('thead th').map(function (i, v) {
    return v.innerText;
  });

  var rows = $table.find('tbody tr').map(function (i, v) {
    $(v).find('th,td').map(function (p, q) {
      var $cell = $(q);
      if ($cell.is('td')) {
        $cell.prepend('<div class="responsive-label">' + headers[p] + '</div>');
      }
    });
  });
};
//# sourceMappingURL=responsive-table.js.map
