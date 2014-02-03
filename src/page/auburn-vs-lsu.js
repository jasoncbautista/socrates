(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Auburn vs LSU";
            
            var view = new GameView();
            App.mainContent.show(view);
        };

        var GameView = ItemView.extend({
            tagName: "div",
            className: "page page-auburn-vs-lsu",
            templateName: "auburn-vs-lsu"
        });

        return {
            display: display
        };
    });
}(window));
