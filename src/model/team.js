define(['backbone'], function (Backbone) {
  'use strict';

  var Team = {};

  var abbrvMap = {
    mlb: {
      conference: {
        AL: 'American League',
        NL: 'National League'
      },
      division: {
        E: 'Eastern',
        C: 'Central',
        W: 'Western'
      }
    }
  };

  Team.Collection = Backbone.Collection.extend({
    url: '/rest/sports/teams',

    parse: function (response) {
      if (response.hasOwnProperty('rows')) {
        var rows = response.rows;

        for(var i = 0; i < rows.length; i++) {
          var team = rows[i];
          if(abbrvMap[team.sport]) {
            var abbrvSprt = abbrvMap[team.sport];

            if(abbrvSprt.conference[team.conference]) {
              rows[i].conference = abbrvSprt.conference[team.conference];
            }

            if(abbrvSprt.division[team.division]) {
              rows[i].division = abbrvSprt.division[team.division];
            }
          }
        }

        return rows;
      }

      return [];
    },

    fetchPage: function (id, page, limit) {
      var data = {
        sport_id: id,
        limit: limit,
        offset: (page - 1) * limit
      };
      this.fetch({
        data: data,
        error: function () {
          Flash.error(
            'Sorry, we could not retrieve the list of teams');
        }
      });

    }
  });

  Team.UFCCollection = Backbone.Collection.extend({});

  return Team;
});
