(function (window) {
  'use strict';

  var define = window.define;

  define(['jquery',
          'app',
          'flash',
          'util',
          'mvc/layout',
          'page/common/feed/feed',
          'nested'],
    function ($, App, Flash, Util, Layout, Feed) {

      var HomeFeedCollection = Feed.FeedCollection.extend({
        constructor: function () {
          var args = Array.prototype.slice.apply(arguments);
          Feed.FeedCollection.prototype.constructor.apply(this, args);
        },
        url: function () {
          return '/api/feed/home?limit=40';
        }
      });

      var HomeView = Layout.extend({
        tagName: 'div',
        className: 'page page-home',
        templateName: 'home',

        events: {
          'submit .save-your-spot-form': '_onSubmitSaveYourSpot'
        },

        regions: {
          feedContainer: '.feed-container'
        },

        _onSubmitSaveYourSpot: function (e) {
          var email = $('.save-your-spot-form input.email').val();
          if (!Util.isValidEmail(email)) {
            e.preventDefault();
            Flash.error('Please enter a valid email address');
          }
        }
      });

      var display = function () {
        document.title = "Sqor";

        var view = new HomeView();
        var feed = new HomeFeedCollection();

        feed.fetch({
          success: function (collection) {
            var feedView = new Feed.FeedView({
              collection: collection
            });
            view.feedContainer.show(feedView);
            $('.feed-container > div').nested({
              selector: '.feed-item',
              minWidth: 287.5,
              resizeToFit: false,
              gutter: 5,
              animate: false
            });
          },
          error: function () {
            Flash.error('Sorry, we could not get the feed');
          }
        });

        App.mainContent.show(view);
      };

      return {
        display: display,
        HomeView: HomeView,
        HomeFeedCollection: HomeFeedCollection
      };
    });
}(window));