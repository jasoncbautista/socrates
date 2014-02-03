(function(window) {
    'use strict';
    /**
     * Application logic
     *
     * Initializes components required to run the application
     */

    define(['jquery', 'underscore', 'backbone', 'marionette'], function($, _, Backbone, Marionette) {

        var app = new Marionette.Application();

        $.extend(_.templateSettings, {
            variable: "data"
        });

        app.addRegions({
            mainContent: "#main-content-container"
        });

        app.on("initialize:after", function() {
            Backbone.history.start({ pushState: true, root: "/", silent: false });
        });

        return app;
    });

}(window));
