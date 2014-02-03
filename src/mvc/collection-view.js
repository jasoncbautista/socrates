(function(window) {
    'use strict';

    define(['marionette', 'mvc/template-cache'], function(Marionette, TemplateCache) {

        /**
         * Base view class which lazy loads a template file over HTTP. Template will only be
         * retrieved once for life of page. Example:
         *
         *   var MyCustomView = CollectionView.extend({
         *       templateName: "home"
         *   });
         *
         * The templateName property must correspond to an HTML file in the /tmpl directory.
         */
        var CollectionView = Marionette.CollectionView.extend({
            getTemplate: function() {
                return TemplateCache.get(this.templateName);
            }
        });

        return CollectionView;
    });
}(window));
