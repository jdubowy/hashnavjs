/*  HashNav is ...
    It was inspired by https://github.com/ccoenraets/PageSlider

    @note: this library depends on jquery core.

    General Usage:
        var hashnav = new HashNav(container_id, options);

    Example use:
        var hashnav = new HashNav('container');
        hashnav.add_route("/foo/", {top_level_tab_index: 0}, function(a){ return '<div>Foo</div>'; };
        hashnav.add_route("/foo/(.*)/bar", function(a){ return '<div>Foo: ' + a + '</div>'; })
        hashnav.add_route("/foo/(.*)/bar", function(a){ return '<div>Bar: ' + a + '</div>'; })
        hashnav.add_route("/foo/(.*)/baz", function(a){ return '<div>Baz: ' + a + '</div>'; })

    Options:
     - allow_reloads -- regenerate same page twice in a row; this can also be
        specified per route; possible use case is if route involves querying
        of possibly chnging data from server
     - always_transition_top_level_pages_from_center -- Don't use left/right
        transition effect when going from one top level tab
     - after_render -- callback to be executed after rendering any route
        (called before any route-specific after-render callback)
*/

function HashNav(container_id, options) {
    options = options || {};

    var history = [];
    var routes = [];

    var path_param_matcher = /:[^/]+/g;

    /*  add_route: associates routes matching a pattern with a content generator.
        @todo: switch 'generator' and 'options' args and support missing options

        Options:
         - allow_reloads -- same meaning as global option of same name, except
            specific to this route.
         - top_level_tab_index -- use for animating left/right transition between
            top level tabs
         - after_render -- callback to be executed after rendering this route
            (called after any global after-render callback)
    */
    this.add_route = function(pattern, route_options, generator) {
        if (typeof route_options == 'function') {
            generator = route_options;
            route_options = {};
        } else {
            route_options = route_options || {};
        }

        //pattern = pattern.replace(/\/*$/, ''); /* so that we match with or with trailing slash */

        pattern = pattern.replace(path_param_matcher, '([^/]+)');

        var r = {
            matcher: RegExp("^" + pattern + "$"),
            generator: generator
        };
        if (typeof route_options.top_level_tab_index != 'undefined') {
            r.top_level_tab_index = route_options.top_level_tab_index;
        }
        if (typeof route_options.after_render != 'undefined') {
            r.after_render = route_options.after_render;
        }
        routes.push(r);
    }

    var leading_hash_matcher = /^#/;

    this.go = function() {
        var page = window.location.hash.replace(leading_hash_matcher, '');

        for (var i = 0; i < routes.length; i++) {
            var m = page.match(routes[i].matcher);
            if (m){
                var args = m.slice(1,m.length);
                var content = routes[i].generator.apply(null, args);
                navigate(page, content, routes[i]);
                return;
            }
        }
        // if we get here, it's effectively a 404, which we'll just ignore
        // TOOD: support options.four_oh_four
    }

    this.back = function() {
        var l = history.length;

        if (l > 1) {
            /* pop current page */
            //history.pop()
            /* go previous page */
            //navigate(history[l-2].p, history[l-2].c, history[l-2].r);
            window.location.hash = history[l-2].p;
        }
        // else, silently do nothing
        // TODO: is this appropriate behavior?
    }

    var call_after_render = function(route) {
        if (options.after_render) {
            options.after_render();
        }
        if (route.after_render) {
            route.after_render();
        }
    }

    var navigate = function(page, content, route) {
        // TODO: restructure code to move history modification, calls
        // to slide, and calling after_render callback in separate function
        var l = history.length;

        if (l === 0) {  /* No history */
            history.push({p: page, r: route});
            slide(content);
            call_after_render(route);
        } else if (history[l-1].p === page) {  /* Same page */
            if (options.allow_reloads || route.allow_reloads) {
                /* Don't push to history, but reload content */
                slide(content);
                call_after_render(route);
            } /* else, just ignore */
        } else if (l > 1 && page === history[l-2].p) { /* Previous page */
            /* Slide from the left and pop current page from history */
            history.pop();
            slide(content, 'left');
            call_after_render(route);
        } else if (typeof route.top_level_tab_index != 'undefined') {
            /* It's one of the top level pages; clear history and add current
               page to it, and then transition according to previously visited
               top-level page and use options */
            var t_idx = history[0].r.top_level_tab_index;
            if (typeof t_idx === 'undefined' || t_idx === route.top_level_tab_index ||
                    options.always_transition_top_level_pages_from_center) {
                slide(content);
                call_after_render(route);
            } else {
                var direction = (route.top_level_tab_index < t_idx) ? ('left') : ('right');
                slide(content, direction);
                call_after_render(route);
            }
            history = [{p: page, r: route}];
        } else {
            /* New page to push on history stack */
            history.push({p: page, r: route});
            slide(content, 'right');
            call_after_render(route);
        }
    }

    var first_page = true;

    var slide = function(content, from) {
        if (first_page) {
            /* Insert content with no transition effect */
            $('#' + container_id).html(content);
            first_page = false;
        } else {
            var old_container = $('#' + container_id);
            old_container.attr('id', container_id + '___rlj32489fd'); // TODO: use guid to ensure uniqueness

            add_new_content(content, from, old_container);

            transition(from, old_container, $('#' + container_id));
        }

        // Force reflow. More information here:
        // http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        $('#' + container_id).offsetWidth;
    }

    var add_new_content = function(content, from, old_container) {
        var cls = "hashnav-page";

        /* add class to position left of, right of, or below viewable region */
        if (from === 'left') {
            cls += ' hashnav-left';
        } else if (from === 'right') {
            cls += ' hashnav-right';
        } else {
            cls += ' hashnav-below';
        }

        /* add container's original classes */
        cls += ' ' + old_container.attr('class');

        old_container.after('<div id="' + container_id + '" class="' + cls + '">' + content + '<div>');
    }

    var transition = function(from, old_container, new_container) {
        var container_class = old_container.attr('class');

        old_container.one('webkitTransitionEnd', function(e) {
            $('#' + old_container.attr('id')).remove();
            new_container.attr('class', container_class);
        });
        // new_container.one('webkitTransitionEnd', function(e) {
        //     new_container.attr('class', container_class)
        // })

        old_container.attr('class', [container_class, old_container_class(from)].join(' '));
        new_container.attr('class', [container_class, new_container_class()].join(' '));
    }

    var old_container_class = function(from) {
        var cls = 'hashnav-page hashnav-transition';
        if (from === 'left') {
            cls += ' hashnav-right';
        } else if (from === 'right') {
            cls += ' hashnav-left';
        } else {
            cls += ' hashnav-above';
        }

        return cls;
    }

    var new_container_class = function() {
        return 'hashnav-page hashnav-transition hashnav-center';
    }

    $(window).on('hashchange', this.go);
}
