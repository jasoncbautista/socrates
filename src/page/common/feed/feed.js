define(['jquery', 'underscore', 'backbone', 'mvc/collection-view',
  'mvc/item-view', 'page/common/feed/feed-item-all', 'util'], function ($,
  _, Backbone, CollectionView, ItemView, FeedItems, Util) {
  'use strict';

  var FeedItemModel = Backbone.Model.extend({});

  var FeedCollection = Backbone.Collection.extend({
    model: FeedItemModel,

    parse: function (response) {
      return this._filterForGoodItems(response.hit);
    },

    _filterForGoodItems: function (items) {
      items = _.map(items, function (item) {
        var data = item.data;
        data.id = item.id;
        data.description = data.item_summary;

        data.title = Util.htmlToPlainText(data.item_title);
        data.description = Util.htmlToPlainText(data.description);

        return data;
      }, this);
      items = _.filter(items, function (item) {
        return FeedItemDataSpec.isValid(item);
      });

      return items;
    }
  });


  var FeedEmptyView = Backbone.View.extend({
    render: function () {
      this.$el.text('No feed items');
    }
  });


  var FeedView = CollectionView.extend({
    getItemView: function (model) {
      var i;
      for (i = 0; i < FeedItems.length; i++) {
        if (FeedItems[i].isValid(model.attributes)) {
          return FeedItems[i].view;
        }
      }
    }
  });


  var FeedItemDataSpec = {
    isValid: function (item) {
      var i;
      for (i = 0; i < FeedItems.length; i++) {
        if (FeedItems[i].isValid(item)) {
          return true;
        }
      }
      return false;
    }
  };


  return {
    FeedItemModel: FeedItemModel,
    FeedCollection: FeedCollection,
    FeedView: FeedView
  };
});
