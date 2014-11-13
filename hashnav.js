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
     - container_classes -- comma separate string of one or more classes
        to add to container upon each navigation
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

        @todo: support route-specific container_classes as well (?)
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

    var navigate = function(page, content, route) {
        // TODO: restructure code to move history modification, calls
        // to slide, and calling after_render callback in separate function
        var l = history.length;

        if (l === 0) {  /* No history */
            history.push({p: page, r: route});
            slide(content);
            if (route.after_render) {route.after_render();}
        } else if (history[l-1].p === page) {  /* Same page */
            if (options.allow_reloads || route.allow_reloads) {
                /* Don't push to history, but reload content */
                slide(content);
                if (route.after_render) {route.after_render();}
            } /* else, just ignore */
        } else if (l > 1 && page === history[l-2].p) { /* Previous page */
            /* Slide from the left and pop current page from history */
            history.pop();
            slide(content, 'left');
            if (route.after_render) {route.after_render();}
        } else if (typeof route.top_level_tab_index != 'undefined') {
            /* It's one of the top level pages; clear history and add current
               page to it, and then transition according to previously visited
               top-level page and use options */
            var t_idx = history[0].r.top_level_tab_index;
            if (typeof t_idx === 'undefined' || t_idx === route.top_level_tab_index ||
                    options.always_transition_top_level_pages_from_center) {
                slide(content);
                if (route.after_render) {route.after_render();}
            } else {
                var direction = (route.top_level_tab_index < t_idx) ? ('left') : ('right');
                slide(content, direction);
                if (route.after_render) {route.after_render();}
            }
            history = [{p: page, r: route}];
        } else {
            /* New page to push on history stack */
            history.push({p: page, r: route});
            slide(content, 'right');
            if (route.after_render) {route.after_render();}
        }
    }

    var slide = function(content, from) {
        if (!from) {
            $('#' + container_id).html(content);
            $('#' + container_id).attr('class', 'page center');// TODO: slide up or down
            if (options.container_classes) {
                $('#' + container_id).addClass(options.container_classes);
            }
        } else {
            var temp_container_id = container_id + '___rlj32489fd'; // TODO: use guid to ensure uniqueness
            $('#' + container_id).after('<div id="' + temp_container_id + '"><div>');
            $('#' + temp_container_id).html(content);
            if (options.container_classes) {
                $('#' + temp_container_id).addClass(options.container_classes);
            }

            $('#' + container_id).one('webkitTransitionEnd', function(e) {
                $('#' + container_id).remove();
                $('#' + temp_container_id).attr('id', container_id);
            });

            // Force reflow. More information here:
            // http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
            $('#' + container_id).offsetWidth;

            // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
            $('#' + container_id).attr('class', 'page transition ' + (from === 'left' ? 'right' : 'left'));
        }
    }

    $(window).on('hashchange', this.go);
}
