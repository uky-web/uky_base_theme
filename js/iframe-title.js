(function () {
    'use strict';

    function setIframeTitles() {
        document.querySelectorAll('.video-embed-field-responsive-video iframe').forEach(function (iframe) {
            // Skip iframes that already have a title attribute
            if (iframe.hasAttribute('title')) {
                return;
            }

            var title = '';

            // Try to get title from data-media-title attribute
            if (iframe.hasAttribute('data-media-title')) {
                title = iframe.getAttribute('data-media-title');
            }

            // Fallback: check parent elements for data-media-title
            if (!title) {
                var parent = iframe.parentElement;
                while (parent && !title) {
                    if (parent.hasAttribute('data-media-title')) {
                        title = parent.getAttribute('data-media-title');
                        break;
                    }
                    parent = parent.parentElement;
                }
            }

            // Last resort: extract from figcaption text
            if (!title) {
                var fig = iframe.closest('figure');
                if (fig) {
                    var caption = fig.querySelector('figcaption .heading__text, figcaption h3, figcaption');
                    if (caption) {
                        title = caption.textContent.trim();
                    }
                }
            }

            // Set title if found
            if (title) {
                iframe.setAttribute('title', title);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setIframeTitles);
    } else {
        setIframeTitles();
    }
})();
