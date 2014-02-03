define(['page/common/feed/feed-item'], function (FeedItem) {
  'use strict';

  var NewsFeedItemView = FeedItem.FeedItemView.extend({
    tagName: 'div',
    className: 'feed-item feed-item-news link',
    templateName: 'feed-item-news',

    events: {
      'click': '_onClick'
    },

    onBeforeRender: function () {
      var nestedClass = this.nestedClass();
      var type = this.model.get('item_type');
      this.className += ' ' + nestedClass + ' ' + type;
      this.$el.addClass(this.className);
    },

    nestedClass: function () {
      var description = this.model.get('description'),
        media = this.model.get('item_media');
      var col = 'size11';

      if (description && description.length > 400) {
        col = 'size21';
      }

      return col;
    },

    _onClick: function () {
      if (!this.model.get('item_link')) {
        return;
      }
      window.open(this.model.get('item_link'));
    }
  });

  var validate = function (item) {
    var types = ['espn_api'];
    if (types.indexOf(item.item_type) > -1) {
      if (item.item_link && item.item_link.length > 0) {
        if (item.item_summary && item.item_summary.length > 0) {
          return true;
        }
      }
    }
    return false;
  };

  return {
    view: NewsFeedItemView,
    isValid: validate
  };
});
