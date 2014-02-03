(function(window, undefined) {
  'use strict';

  define(['backbone', 'mvc/item-view', 'moment', 'app'], function(Backbone, ItemView, moment, App) {

    var display = function(showdownsId) {
        document.title = "Sqor | Showdowns";

        var model = new ShowdownsModel({
          id: showdownsId
        });
        model.fetch({
          complete: function() {
            var view = new ShowdownsView({
              model: model
            });
            App.mainContent.show(view);
          }
        });
        // TODO: Show some sort of loading indicator
      };

    var ShowdownsModel = Backbone.Model.extend({

      initialize: function(attributes, options) {

      },

      url: function() {
        if (this.get('id')) {
          return '/api/h2h/' + this.get('id');
        }
        return '/api/h2h';
      },

      parse: function(response) {
        if (response.length <= 0) {
          throw 'No head-to-head data received';
        }
        response = response[0];

        var rootAttributes = ['challenge_type', 'game_id', 'id', 'my_stat_value', 'number_of_comments', 'number_of_wagers', 'scheduled_time', 'stat_type', 'status'];
        var compositeAttributes = ['away_player', 'away_team', 'home_player', 'home_team'];
        var i, j, parsed = {};

        for (i = 0; i < rootAttributes.length; i++) {
          parsed[rootAttributes[i]] = response[rootAttributes[i]];
        }

        for (i = 0; i < compositeAttributes.length; i++) {
          parsed[compositeAttributes[i]] = {};
          for (j in response) {
            if (compositeAttributes[i] === j.substr(0, compositeAttributes[i].length)) {
              parsed[compositeAttributes[i]][j.substr(compositeAttributes[i].length + 1)] = response[j];
            }
          }
        }
        if (parsed.challenge_type === 'player') {
          parsed.home_athlete = parsed.home_player;
          parsed.away_athlete = parsed.away_player;
          this._setPlayerProfileUrls(parsed);
        }

        parsed.home_player = undefined;
        parsed.away_player = undefined;


        return parsed;
      },

      _setPlayerProfileUrls: function(parsed) {
        if (parsed.away_athlete) {
          parsed.away_athlete.profileUrl = this._generateAthleteProfileUrl(parsed.away_athlete);
        }
        if (parsed.home_athlete) {
          parsed.home_athlete.profileUrl = this._generateAthleteProfileUrl(parsed.home_athlete);
        }
      },

      _generateAthleteProfileUrl: function(athlete) {
        var nameUriComponent = athlete.first_name.toLowerCase() + '-' + athlete.last_name.toLowerCase();
        nameUriComponent = nameUriComponent.replace(/[^a-z0-9\-]/g, '');
        return '/athlete/' + athlete.id + '/' + nameUriComponent;
      }
    });


    var ShowdownsView = ItemView.extend({
      tagName: "div",
      className: "page page-showdowns",
      templateName: "showdowns",

      serializeData: function() {
        var serialized = ItemView.prototype.serializeData.apply(this);

        serialized.dateAbbrev = this._getDateAbbreviation();
        serialized.statMap = {
          touchdowns: 'Touchdowns',
          points: 'Points',
          fieldgoals: 'Field Goals',
          kickingpoints: 'Kicking Points',
          receivingyards: 'Receiving Yards',
          receptions: 'Receptions',
          rushingyards: 'Rushing Yards',
          passingyards: 'Passing Yards',
          yardage: 'Yardage',
          wins: 'Winner'
        };

        serialized.positionMap = {
          HB: 'Halfback',
          FB: 'Halfback',
          RB: 'Halfback',
          QB: 'Quarterback',
          TE: 'Tight End',
          WR: 'Wide Receiver',
          K: 'Kicker'
        };

        return serialized;
      },

      _getDateAbbreviation: function() {
        var date = this.model.get('scheduled_time');

        if (!(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(date))) {
          return '';
        }

        return moment(date).format('MMM D');
      }
    });


    return {
      display: display,
      ShowdownsModel: ShowdownsModel,
      ShowdownsView: ShowdownsView
    };
  });
}(window));
