define(['app', 'flash', 'page/common/ncaaAssets', 'util',
    'strategy/team-list'],
  function (App, Flash, ncaaAssets, Util, teamStrategy) {
    'use strict';

    var display = function (sport, page) {
      var limit = 20;
      page = page || 1;
      var strategy = teamStrategy(sport);

      $('title').text('Sqor | ' + strategy.title + ' Team List');
      $('#metadesc').attr('content', '');
      $('#metakeys').attr('content', 'sports, scores, news, ' + strategy.title +
        ', ' + sport + ', ' + strategy.headLine);

      var collection = new strategy.collection();

      var view = new strategy.view({
        page: page,
        collection: collection,
        sportId: sport,
        limit: limit,
        headLine: strategy.headLine
      });

      App.mainContent.show(view);

      collection.fetch({
        data: {
          sport: sport
        }
      });
    };

    return {
      display: display,
    };
  });
