define(['marionette', 'mvc/template-cache'], function (Marionette,
  TemplateCache) {
  'use strict';

  /**
   * Base view class which lazy loads a template file over HTTP. Template will only be
   * retrieved once for life of page. Example:
   *
   *   var MyCustomView = CompositeView.extend({
   *       templateName: "home"
   *   });
   *
   * The templateName property must correspond to an HTML file in the /tmpl directory.
   */
  var CompositeView = Marionette.CompositeView.extend({
    initialize: function (options) {
      var args = Array.prototype.slice.apply(arguments);
      Marionette.CompositeView.prototype.initialize.apply(this,
        arguments);

      this.options = $.extend({}, this.defaults, options);
    },

    getTemplate: function () {
      var templateName = this.templateName;

      if (this.templatePrefix || this.options.templatePrefix) {
        var p = this.options.templatePrefix || this.templatePrefix;
        templateName = p + templateName;
      }

      console.log(templateName);
      return TemplateCache.get(templateName);
    }
  });

  return CompositeView;
});
