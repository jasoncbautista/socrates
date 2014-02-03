define(['util', 'mvc/item-view', 'mvc/composite-view', 'page/common/ncaaAssets'],
  function (Util, ItemView, CompositeView, ncaaAssets) {
    'use strict';

    var TeamListEntryView = ItemView.extend({
      tagName: 'div',
      className: 'team-list-entry col-sm-4',
      templateName: 'team-list/list-entry',
      templateHelpers: {
        getURLSafeTeamName: function (parts) {
          // Cleaning up the team name along with location: 
          var rawTeamName = '';
          for (var i = 0; i < parts.length; i++) {
            rawTeamName += Util.makeSEOFriendly(parts[i]) + '-';
          }
          return rawTeamName.slice(0, -1);
        },

        getLogo: function () {
          try {
            if (this.sport === 'ncaafb') {
              return ncaaAssets[this.external_id].image;
            } else {
              var city = this.location.split(',')[0].toLowerCase();
              city = city.replace(/[\s\.]/g, '');
              var name = this.name.toLowerCase().replace(/[\s\.]/g, '');
              var sport = this.sport;
              var filename = city + '_' + name + '.png';
              var url = 'http://s3-us-west-2.amazonaws.com/sqor-images/';
              return url + sport + '/' + filename;
            }
          } catch(e){}
        }

      }
    });

    var TeamListView = CompositeView.extend({
      tagName: 'div',
      className: 'page page-team-list container',
      templateName: 'team-list/teamsport',
      itemView: TeamListEntryView,
      itemViewOptions: function (model, index) {
        return {
          index: index,
        };
      },
      itemViewContainer: '.team-list',

      defaults: {
        page: 1
      },

      onDomRefresh: function () {
        this.$el.addClass(this.options.sportId);
        this.$el.find('h1').text(this.options.headLine);
      },

      events: {
        'click .page-prev': '_onClickPagePrev',
        'click .page-next': '_onClickPageNext'
      },

      _onClickPagePrev: function (e) {
        e.preventDefault();

        if (this.options.page <= 1) {
          return;
        }

        this._goToPage(--this.options.page);
      },

      _onClickPageNext: function (e) {
        e.preventDefault();

        if (this.collection.length < this.collection.limit) {
          return;
        }

        this._goToPage(++this.options.page);
      },

      _goToPage: function (page) {
        var id = this.options.sportId;
        this.collection.fetchPage(id, page, this.options.limit);
        Backbone.history.navigate('/sport/' + id + '/page/' + page);
      }
    });

    return TeamListView;
  });
