(function (window) {
  'use strict';

  define(['mvc/item-view'], function (ItemView) {

    var FeedItemView = ItemView.extend({
      columnWidth: 6,
      innerClassName: null,

      _getColumnWidth: function () {
        return this._getFunctionOrVal(this.columnWidth, 6);
      },

      _getInnerClassName: function () {
        return this._getFunctionOrVal(this.innerClassName, '');
      },

      _getFunctionOrVal: function (property, defaultVal) {
        if (typeof property === 'function') {
          return property.apply(this) || defaultVal;
        }
        return property || defaultVal;
      }
    });

    return {
      FeedItemView: FeedItemView
    };
  });
}(window));
