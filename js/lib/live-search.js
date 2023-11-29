/*
Live list searching script
Filters a list in real time based on a simple text search.
Requires jQuery.

To use:
Include an <input> box with the class '.live-search-box' and
a list (ordered or unordered) with the class '.live-search-list'

Initialize with:
liveSearch.init();

Derived from a tutorial found at
https://www.html5andbeyond.com/live-search-a-html-list-using-jquery-no-plugin-needed/
*/
var liveSearch = {};

liveSearch.init = function init() {
    $('.live-search-list li').each(function () {
        $(this).attr('data-search-term', $(this).text().toLowerCase());
    });

    $('.live-search-box').on('keyup', function () {

        var searchTerm = $(this).val().toLowerCase();

        $('.live-search-list li').each(function () {

            if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });
    });
    
    return "Live Search Initialized";
    
};