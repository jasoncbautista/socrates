define(['view/team-list/teamsport', 'view/team-list/ufc', 'model/team'],
  function (TeamSportView, UFCView, Team) {
    'use strict';

    var headlineMap = {
      'default': '',
      mlb: 'major league baseball',
      nba: 'national basketball association',
      ncaafb: 'national collegiate athletic association football',
      nfl: 'national football league',
      mma: 'mixed martial arts'
    };

    var pageTitleMap = {
      'default': '',
      mlb: 'MLB',
      nba: 'NBA',
      ncaafb: 'NCAA football',
      nfl: 'NFL',
      mma: 'MMA'
    };

    var teamViewMap = {
      'default': TeamSportView,
      ufc: UFCView
    };

    var collectionMap = {
      'default': Team.Collection,
      ufc: Team.UFCCollection
    };

    /**
     * Returns object containing strategies for building a team list page
     *
     * example:
     *  {
     *    collection: CollectionObject,
     *    headLine: string,
     *    title: string,
     *    view: string
     *  }
     **/
    return function (sport) {
      var strat = {};

      strat.view = teamViewMap[sport] || teamViewMap['default'];
      strat.headLine = headlineMap[sport] || headlineMap['default'];
      strat.title = pageTitleMap[sport] || pageTitleMap['default'];
      strat.collection = collectionMap[sport] || collectionMap['default'];

      return strat;
    };
  });
