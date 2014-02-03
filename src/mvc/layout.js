define(['marionette', 'mvc/template-cache'], function (Marionette,
  TemplateCache) {
  'use strict';

  /**
   * Base view class which lazy loads a template file over HTTP. Template will only be
   * retrieved once for life of page. Example:
   *
   *   var MyCustomLayout = Layout.extend({
   *       templateName: "home",
   *       templatePrefix: "site/"
   *   });
   *
   * The templateName property must correspond to an HTML file in the /tmpl directory.
   *
   * Introduced template prefixs to let templates load from nested
   * directories. This lets the view name it's template but allows for
   * alternate templates to be served. Prefixes should include slashes and
   * are still assumed to be loading from the /tmpl directory.
   */
  var Layout = Marionette.Layout.extend({
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

  return Layout;
});
