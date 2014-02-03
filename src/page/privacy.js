(function(window) {
    'use strict';

    define([ 'mvc/item-view', 'app' ], function(ItemView, App) {

        var display = function() {
            document.title = "Sqor | Privacy Policy";

            var view = new PrivacyPolicyView();
            App.mainContent.show(view);
        };

        var PrivacyPolicyView = ItemView.extend({
            tagName: "div",
            className: "page page-privacy legal",
            templateName: "privacy"
        });

        return {
            display: display
        };
    });
}(window));
