define(['page/common/feed/feed-item', 'lib/jquery.timeago/jquery.timeago'], function (FeedItem) {
  'use strict';

  var TweetFeedItemView = FeedItem.FeedItemView.extend({
    tagName: 'div',
    className: 'feed-item feed-item-tweet',
    templateName: 'feed-item-tweet',
    onRender: function() {
      $('abbr.timeago', this.$el).timeago();
    }
  });

  var validate = function (item) {
    return item.item_type === 'tweet';
  };

  return {
    view: TweetFeedItemView,
    isValid: validate
  };
});
