define(['page/common/feed/feed-item'], function (FeedItem) {
  'use strict';

  var view = FeedItem.FeedItemView.extend({
    tagName: 'div',
    className: 'feed-item feed-item-getty-image size22',
    templateName: 'feed-item-getty-image',

    onRender: function () {
      var classId = 'item' + this.model.get('id');
      var type = this.model.get('item_type');
      var c = classId + ' ' + type;
      var img = this.model.get('item_media')[0].url;
      this.$el.find('.blur').attr('style', 'background-image: url('+img+');');
      this.$el.addClass(c);
    }
  });

  var validate = function (item) {
    var types = ['57', 'getty_images'];
    if (types.indexOf(item.item_type) > -1) {
      if (item.item_media && item.item_media.length > 0) {
        return true;
      }
    }
    return false;
  };

  return {
    view: view,
    isValid: validate
  };
});
