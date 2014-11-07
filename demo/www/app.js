(function () {
    var hashnav = new HashNav('current-page');
    hashnav.add_route("/?", function(a){
        return '<div>Hello</div>' +
            '<p><a href="#/foo/">foo</a></p>' +
            '<p><a href="#/bar/">bar</a></p>' +
            '<p><a href="#/baz">baz</a></p>';
    })
    hashnav.add_route("/foo/?", {top_level_tab_index: 0}, function(a){
        return '<div style="background-color: red;">Foo</div>' +
            '<p><a href="#/foo/Bob/">Bob</a></p>' +
            '<p><a href="#/foo/Bob/Jones/">Bob Jones</a></p>';
    });
    hashnav.add_route("/bar/?", {top_level_tab_index: 1}, function(a){
        return '<div style="background-color: blue;">Bar</div>';
    });
    hashnav.add_route("/baz/?", {top_level_tab_index: 2}, function(a){
        return '<div style="background-color: orange;">Baz</div>';
    });
    hashnav.add_route("/foo/:first_name/?", function(first_name){
        return '<div style="background-color: yellow;">Foo ' + first_name + '</div>' +
            '<p><a href="#/foo/Bob/Jones/">Bob Jones</a></p>';
    });
    hashnav.add_route("/foo/:first_name/:last_name/?", function(first_name, last_name){
        return '<div style="background-color: purple;">Foo ' + first_name + ' ' + last_name +'</div>';
    });
    hashnav.go();
}());
