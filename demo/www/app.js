(function () {
    var hashnav = new HashNav('current-page');
    hashnav.add_route("/?", function(a){
        return '<div>Hello</div>' +
            '<p><a href="#/foo/">foo</a></p>' +
            '<p><a href="#/bar/">bar</a></p>' +
            '<p><a href="#/baz">baz</a></p>' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<p>';
    })
    hashnav.add_route("/foo/?", {
        top_level_tab_index: 0,
        after_render: function() {
            setTimeout("$('#foo-div').css('background-color', 'green')", 500);
        }
    }, function(a){
        return '<div id="foo-div" style="background-color: red;">Foo</div>' +
            '<p><a href="#/foo/Bob/">Bob</a></p>' +
            '<p><a href="#/foo/Bob/Jones/">Bob Jones</a></p>';
    });
    hashnav.add_route("/bar/?", {top_level_tab_index: 1}, function(a){
        return '<div style="background-color: blue;">Bar</div>' +
            '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?<p>';
    });
    hashnav.add_route("/baz/?", {top_level_tab_index: 2}, function(a){
        return '<div style="background-color: orange;">Baz</div>' +
            '<p>At quo iisque integre eleifend, duo cu ipsum consul iriure. An nemore noluisse pro, ea pericula democritum abhorreant sit, paulo solet omnesque sea ne. Cu solum minim dignissim quo. Saperet debitis principes quo ne. Vis in augue dolorum aliquando, ei sit meis iusto, ex purto malis tacimates vix. Unum dictas molestie pro id, est omittantur mediocritatem in, mel ne nobis possim indoctum.<p>';
    });
    hashnav.add_route("/foo/:first_name/?", function(first_name){
        return '<div style="background-color: yellow;">Foo ' + first_name + '</div>' +
            '<p><a href="#/foo/Bob/Jones/">Bob Jones</a></p>' +
            '<p>Cum ea minim altera commodo, qui vide moderatius an. Nec eu reque eleifend volutpat. Nec in scripta appareat. Mucius latine nec ad, te accusam molestie pri. Eam cu case solet nusquam. Sed et dicam corpora quaerendum, vis esse nibh euripidis ad, vis suas omnis tacimates ad. An has simul oportere repudiandae. Ea debet scripta vis, eum cu eirmod dolorum sensibus. Sint contentiones cum ea, ut mea odio menandri volutpat. Vim reque audire temporibus eu, ne prima accumsan qui. Id mea elitr civibus. Ex oratio disputationi eum.<p>';
    });
    hashnav.add_route("/foo/:first_name/:last_name/?", function(first_name, last_name){
        return '<div style="background-color: purple;">Foo ' + first_name + ' ' + last_name +'</div>' +
            '<p>Cu vis inani blandit, enim honestatis instructior has ex. Porro numquam ius ut, zril nonumy nominavi ex mei. Ea his accusam scriptorem, ne primis commodo omnesque nam. Ea diam placerat interpretaris vix, ex error laudem pro, aperiri consequat ad eam. Ei mel propriae volutpat scribentur, eu qui movet primis. An doming putent nostrud vis. Quas assum tibique qui in. Ex est vide comprehensam necessitatibus, sit tota oportere no. Cu duo mundi mollis eleifend.<p>';
    });
    hashnav.go();
}());
