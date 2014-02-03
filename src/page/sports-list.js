(function (window) {

  define(['model/sport', 'mvc/composite-view', 'mvc/item-view', 'app', 'flash'],
    function (Sport, CompositeView, ItemView, App, Flash) {

      var SportListEntryView = ItemView.extend({
        tagName: 'div',
        className: 'sport-list-entry col-sm-12',
        templateName: 'sport-list-entry'
      });

      var SportListView = CompositeView.extend({
        tagName: "div",
        className: "page page-sport-list container",
        templateName: "sport-list",
        itemView: SportListEntryView,
        itemViewContainer: '.sport-list',
      });

      var display = function (sportId, page) {
        var collection = new Sport.Collection();
        var view = new SportListView({
          page: page,
          collection: collection
        });
        App.mainContent.show(view);
        collection.fetch({
          error: function () {
            Flash.error('Sorry, we could not retrieve the list of sports');
          }
        });
      };

      return {
        display: display,
        SportListView: SportListView
      };
    });
}(window));
