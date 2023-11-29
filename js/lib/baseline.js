/*!
 * Baseline.js 1.1
 *
 * Copyright 2013, Daniel Eden http://daneden.me
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: 2014-06-20
 */

(function (window, $) {

    'use strict';

    var baseline = (function () {
        var cssAttr = 'data-baseline';

        /** insert
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = window.getComputedStyle(element, null).fontSize;
            return parseFloat(fontSize) || 16;
        }

        function convertToPx(element, value) {
            var numbers = value.split(/\d/);
            var units = numbers[numbers.length - 1];
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                    // for now, not supporting physical units (since they are just a set number of px)
                    // or ex/ch (getting accurate measurements is hard)
            }
        }
        /* end */

        /* extract CSS rules ... */
        /**
         * @param {String} css
         */
        function extractQuery(css) {
            css = css.replace(/'/g, '"');
            var q = {
                sel: '',
                val: null
            };
            var r = new RegExp(['\\[\s?', cssAttr, '\s?'].join(''), 'i');
            var a = css.split(r);
            var b = a[1].split(/](.+)?/);
            a[1] = b.shift().replace('=', '').replace(/"/g, '');
            q.sel = a[0] += b.join('').trim();
            q.val = convertToPx(false, a[1].trim());
            return q;
        }
        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var allQueries = [];
            var selector = '';
            var cssR = new RegExp(['\\[(?:\s\s+)?', cssAttr, '(?:\s\s+)?='].join(''), 'i');
            if (!rules) return;
            if (typeof rules === 'string') {
                if (rules.search(cssR) != -1) {
                    allQueries.push(extractQuery(rules));
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (selector.search(cssR) != -1) {
                            allQueries.push(extractQuery(selector));
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
            return allQueries;
        }

        /**
         * `_base` will later hold the value for the current baseline that matches
         * the given breakpoint. `_breakpoints` will hold a reference to all
         * breakpoints given to the baseline call.
         */
        var _base = 0,
            _breakpoints = {},
            _dynamicBase;

        /**
         * @name     _setBase
         *
         * Set the correct margin-bottom on the given element to get back to the
         * baseline.
         *
         * @param    {Element}  element
         *
         * @private
         */

        function _setBase(element) {
            var rect = element.getBoundingClientRect();
            var height = ((rect.hasOwnProperty('height')) ? rect.height : element.offsetHeight),
                current, old;

            if (_dynamicBase) {

                /**
                 * Compute the _base through a user defined function on each execution.
                 * This could be used to get the current grid size for different breakpoints
                 * from an actual element property instead of defining those breakpoints in the options.
                 */
                _base = _dynamicBase();

            } else {

                /**
                 * In this step we loop through all the breakpoints, if any were given.
                 * If the baseline call received a number from the beginning, this loop
                 * is simply ignored.
                 */

                for (var key in _breakpoints) {
                    current = key;

                    if (document.body.clientWidth > current && current >= old) {
                        _base = _breakpoints[key];
                        old = current;
                    }
                }

            }

            /**
             * We set the element's margin-bottom style to a number that pushes the
             * adjacent element down far enough to get back onto the baseline.
             */

            element.style.marginBottom = _base - (height % _base) + 'px';
        }

        /**
         * @name     _init
         *
         * Call `_setBase()` on the given element and add an event listener to the
         * window to reset the baseline on resize.
         *
         * @param    {Element}  element
         *
         * @private
         */

        function _init(element) {
            _setBase(element);
            element.setAttribute(cssAttr, _base);
            if ('addEventListener' in window) {
                window.addEventListener('resize', function () {
                    _setBase(element);
                }, false);
            } else if ('attachEvent' in window) {
                window.attachEvent('resize', function () {
                    _setBase(element);
                });
            }
        }

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         */
        function cssBaselineRules() {
            var targets = [];
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    targets = targets.concat(
                        readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules || document.styleSheets[i].cssText)
                    );
                } catch (e) {
                    if (e.name !== 'SecurityError') {
                        throw e;
                    }
                }
            }
            return targets;
        };

        /**
         * @name     baseline
         *
         * Gets the correct elements and attaches the baseline behaviour to them.
         *
         * @param    {String/Element/NodeList}  elements
         * @param    {Number/Object}            options
         */

        function baseline(elements, options) {
            if (!elements) {
                /**
                 * No elements = parse CSS for [cssAttr]
                 */
                var rootBaseline = window.getComputedStyle(document.createElement('p'), null).lineHeight;
                cssBaselineRules().forEach(function (q) {
                    baseline(q.sel, (q.val || ((typeof options === 'number') ? options : rootBaseline)));
                });
                return false;
            }
            /**
             * Accept a NodeList or a selector string and set `targets` to the
             * relevant elements.
             */
            var targets = typeof elements === 'string' ? document.querySelectorAll(elements) : elements,
                len = targets.length;

            /**
             * Decide whether to set the `_breakpoints` or `_dynamicBase` variables or not.
             * This will be relevant in the `_setBase()` function.
             */

            if (typeof options === 'number') {
                _base = parseFloat(options, 10);
            } else if (typeof options === 'function') {
                _dynamicBase = options;
            } else if (typeof options === 'object') {
                var em = parseFloat(getComputedStyle(document.body, null).getPropertyValue('font-size'), 10);

                for (var point in _breakpoints) {
                    var unitless = /\d+em/.test(point) ? parseFloat(point, 10) * em : /\d+px/.test(point) ? parseFloat(point, 10) : point;
                    _breakpoints[unitless] = parseFloat(_breakpoints[point], 10);
                }
            }

            /**
             * If we have multiple elements, loop through them, otherwise just
             * initialise the functionality on the single element.
             */

            if (len > 1) {
                while (len--) {
                    _init(targets[len]);
                }
            } else {
                _init(targets[0]);
            }
        };

        // parse CSS ...
        // To support elder browsers (IE8) ...
        var stateCheck = setInterval(function () {
            if (document.readyState === 'complete') {
                clearInterval(stateCheck);
                baseline();
                /* NOTE : some browsers are not pixel perfect now, e.g.
                // if there is absolute ::before or ::after ... CSS, so:
                */
                setTimeout(baseline, 200);
            }
        }, 100);

        return baseline;

    }());
    /**
     * Export baseline as a jQuery or Zepto plugin if any of them are loaded,
     * otherwise export as a browser global.
     */

    if (typeof $ !== "undefined") {
        $.extend($.fn, {
            baseline: function (options) {
                return baseline(this, options);
            }
        });
    } else {
        window.baseline = baseline;
    }

}(window, window.jQuery || window.Zepto || undefined));
