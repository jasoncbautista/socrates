define(['backbone', 'mvc/collection-view', 'mvc/item-view', 'mvc/layout',
    'app', 'flash', 'model/athlete', 'page/common/feed/feed',
    'util', 'model/sport', 'page/common/ncaaAssets'],
  function (Backbone, CollectionView, ItemView, Layout, App, Flash, Athlete,
    Feed, util, Sport, ncaaAssets) {
    'use strict';

    var team;
    var teamViewMap = {
      'default': 'team-profiles/' //,
      // ncaafb: 'team-profiles/ncaafb/'
    };

    function getViewPrefix(sport) {
      return teamViewMap[sport] || teamViewMap['default'];
    }

    var TeamModel = Backbone.Model.extend({
      urlRoot: '/rest/sports/teams'
    });

    var TeamFeedCollection = Feed.FeedCollection.extend({
      constructor: function (models, options) {
        var args = Array.prototype.slice.apply(arguments);
        Feed.FeedCollection.prototype.constructor.apply(this, args);

        this.teamId = options.teamId;
      },
      url: function () {
        return '/api/feed/team/' + this.teamId;
      },

      fetchPage: function (page, limit) {
        var data = {
          limit: limit,
          offset: (page - 1) * limit
        };
        return this.fetch({
          data: data,
          error: function () {
            Flash.error(
              'Sorry, we could not retrieve the team feed');
          }
        });

      }
    });

    var Roster = Backbone.Collection.extend({
      model: Athlete.AthleteModel,
      url: '/rest/sports/players',

      parse: function (response) {
        if (response.hasOwnProperty('rows')) {
          return response.rows;
        }

        return [];
      },

      fetchByTeamId: function (teamId, opts) {
        var options = {
          data: {
            'team_id': teamId,
            'limit': 30000
          }
        };
        if (opts) {
          $.extend(options, opts);
        }
        return this.fetch(options);
      }
    });

    var TeamLayout = Layout.extend({
      tagName: 'div',
      templateName: 'team-profile',
      className: 'page page-team-profile',
      templateHelpers: {
        getLogo: function () {
          return util.getLogo(this);
        }
      },
      regions: {
        roster: '.roster-list',
        feedContainer: '.feed-container'
      },

      onDomRefresh: function () {
        this.$el.addClass(this.model.get('sport'));
      },

      render: function () {
        var args = Array.prototype.slice.apply(arguments);
        Layout.prototype.render.apply(this, args);

        var teamName = this.model.get('name');
        var sport = Sport.Model.getShortName(this.model.get('sport'));
        var title = "Sqor | " + teamName + " - " + sport;
        $('title').text(title);
        $('#metadesc').attr('content', '');
        $('#metakeys').attr('content',
          'sports, scores, news, <sport>, <team>, <school>, <player name>');
      }
    });

    var RosterItemView = ItemView.extend({
      initialize: function () {
        // Let the collection view pass down the team 
        this.model.set('team', this.options.team.attributes);
      },
      tagName: 'div',
      templateName: 'roster-item',
      className: 'team-roster-entry',
      onRender: function () {
        var sa = this.model.get('selected_assets');
        if(sa.headshot) {
          this.$el.find('.player-picture').addClass('player-picture-adjust');
        }
      },
      templateHelpers: {
        getLogo: function () {
          if (this.selected_assets.headshot) {
            return this.selected_assets.headshot;
          } else {
            return util.getLogo(team.attributes);
          }
        },
        getDisplayPosition: function () {
          return this.getDisplayPosition();
        }
      },
      events: {
        'click': '_onClick'
      },

      _onClick: function (e) {
        e.preventDefault();
        Backbone.history.navigate(this.model.getProfileUrl(), true);
      }
    });

    var RosterView = CollectionView.extend({
      itemView: RosterItemView,
      itemViewOptions: function (model, index) {
        return {
          index: index,
          team: this.options.team,
          templatePrefix: this.options.templatePrefix
        };
      }
    });

    var display = function (teamId) {

      team = new TeamModel({
        id: teamId
      });

      team.fetch({
        success: function () {
          var sport = team.get('sport');
          if (sport === 'ncaafb') {
            team.set(ncaaAssets[team.get('external_id')]);
          }
          var templatePrefix = getViewPrefix(sport);
          var layout = new TeamLayout({
            model: team,
            templatePrefix: templatePrefix
          });
          App.mainContent.show(layout);

          // Render team roster
          var roster = new Roster();
          roster.fetchByTeamId(teamId, {
            success: function () {
              var rosterView = new RosterView({
                collection: roster,
                templatePrefix: templatePrefix,
                team: team
              });
              layout.roster.show(rosterView);
            }
          });

          // Render team feed
          var feed = new TeamFeedCollection(null, {
            teamId: team.get('external_id')
          });
          feed.fetchPage(1, 20).success(function () {
            var feedView = new Feed.FeedView({
              collection: feed
            });
            layout.feedContainer.show(feedView);
          });
        }
      });
    };

    return {
      display: display,
      TeamModel: TeamModel
    };
  });
