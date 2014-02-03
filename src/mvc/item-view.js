define(['marionette', 'mvc/template-cache'], function (Marionette,
  TemplateCache) {
  'use strict';

  /**
   * Base view class which lazy loads a template file over HTTP. Template will only be
   * retrieved once for life of page. Example:
   *
   *   var MyCustomView = ItemView.extend({
   *       templateName: "home"
   *   });
   *
   * The templateName property must correspond to an HTML file in the /tmpl directory.
   */
  var ItemView = Marionette.ItemView.extend({
    getTemplate: function () {
      var templateName = this.templateName;

      if (this.templatePrefix || this.options.templatePrefix) {
        var p = this.options.templatePrefix || this.templatePrefix;
        templateName = p + templateName;
      }
      return TemplateCache.get(templateName);

    }
  });

  return ItemView;
});
