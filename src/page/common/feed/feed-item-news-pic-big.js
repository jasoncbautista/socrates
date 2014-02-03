define(['jquery', 'page/common/feed/feed-item'], function ($, FeedItem) {
  'use strict';

  var view = FeedItem.FeedItemView.extend({
    tagName: 'div',
    className: 'feed-item feed-item-news-pic-big size21',
    templateName: 'feed-item-news-pic-big',

    events: {
      'click': '_onClick'
    },

    onRender: function () {
      var img = this.model.get('item_media')[0].url;
      var frost =
        '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="580" height="287"><defs><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter></defs><image xlink:href="' +
        img + '" width="580" height="287" filter="url(#blur)"/></svg>';
      frost = encodeURIComponent(frost);
      var frostStyle = 'background-image: url("data:image/svg+xml,' + frost +
        '"), url("' + img + '");';
      this.$el.attr('style', 'background-image: url(' + img + ')');
      var classId = 'item' + this.model.get('id');
      var type = this.model.get('item_type');
      var c = classId + ' ' + type;
      this.$el.addClass(c);
      this.$el.prepend('<style>.' + classId + ' .text::before{' +
        frostStyle + '}</style>');
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
    var bannedTags = ['nba'];
    var tags = item.item_tags;
    if (tags) {
      if (!$.isArray(tags)) {
        tags = tags.split(',');
      }

      var bannedMatch = $.map(tags, function (v, i) {
        if (bannedTags.indexOf(v.toLowerCase()) > -1) {
          return v;
        }
      });

      if (bannedMatch.length === 0 && types.indexOf(item.item_type) > -1) {
        if (item.item_link && item.item_link.length > 0) {
          if (item.item_summary && item.item_summary.length > 0) {
            if (item.item_media && item.item_media.length > 0) {
              if (item.item_media[0].width > 570) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  return {
    view: view,
    isValid: validate
  };
});
