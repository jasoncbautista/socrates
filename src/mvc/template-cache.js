(function(window) {
    'use strict';

    define([ 'jquery', 'underscore', 'marionette' ], function($, _, Marionette) {

        var templateCache = {};

        var get = function(templateName) {
            if (!isTemplateLoaded(templateName)) {
                loadTemplate(templateName);
            }
            return templateCache[templateName];
        };


        var isTemplateLoaded = function(templateName) {
            return !!templateCache[templateName];
        };


        var loadTemplate = function(templateName) {
            var url = '/tmpl/' + templateName + '.html';
            if (window.cacheBuster) {
                url += '?cb=' + window.cacheBuster;
            }

            $.ajax({
                url: url,
                async: false,
                success: function(data) {
                    templateCache[templateName] = _.template(data);
                },
                error: function() {
                    console.error('Unable to load template: ' + templateName);
                },
                context: this
            });
        };


        return {
            get: get
        };

    });
}(window));
