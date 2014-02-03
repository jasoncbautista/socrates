(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Contact";
            
            var view = new ContactView();
            App.mainContent.show(view);
        };

        var ContactView = ItemView.extend({
            tagName: "div",
            className: "page page-contact",
            templateName: "contact",

            events: {
                "click .map-circle": "clickMapCircle",
            },

            clickMapCircle: function() {
              window.open( $('#map-link').attr('href') );
            },
        });

        return {
            display: display
        };
    });
}(window));
