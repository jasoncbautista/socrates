define(['backbone', 'page/common/feed/feed'], function (Backbone, Feed) {
  'use strict';

  var AthleteAssetsModel = Backbone.Model.extend({
    url: function () {
      return '/rest/sports/players/' + this.get('id') + '/assets';
    },

    parse: function (result) {
      var assets = {};
      if (result.hasOwnProperty('rows')) {
        var i;
        for (i = 0; i < result.rows.length; i++) {
          assets[result.rows[i].asset_type] = result.rows[i].url;
        }
      }

      return assets;
    }
  });

  var AthleteModel = Backbone.Model.extend({
    initialize: function () {
      var args = Array.prototype.slice.apply(arguments);
      Backbone.Model.prototype.initialize.apply(this, args);
      this.set('profileUrl', this.getProfileUrl());
    },

    urlRoot: '/rest/sports/players',

    positionMap: {
      'nba': {
        F: 'Forward',
        G: 'Guard',
        C: 'Center',
        PF: 'Power Forward',
        PG: 'Point Guard',
        SF: 'Small Forward',
        SG: 'Shooting Guard',
        'C-F': 'Center Forward',
        'F-C': 'Forward Center',
        'F-G': 'Forward Guard',
        'G-F': 'Guard Forward'
      },
      'nfl': {
        C: 'Center',
        FB: 'Fullback',
        G: 'Offensive Guard',
        OG: 'Offensive Guard',
        OL: 'Offensive Lineman',
        OT: 'Offensive Tackle',
        QB: 'Quarterback',
        RB: 'Running Back',
        T: 'Offensive Tackle',
        TE: 'Tight End',
        WR: 'Wide Receiver',
        CB: 'Cornerback',
        DB: 'Defensive Back',
        DE: 'Defensive End',
        DT: 'Defensive Tackle',
        FS: 'Free Safety',
        LB: 'Linebacker',
        MLB: 'Middle Linebacker',
        NT: 'Nose Tackle',
        OLB: 'Outside Linebacker',
        SAF: 'Safety',
        SS: 'Strong Safety',
        K: 'Kicker',
        LS: 'Long Snapper',
        P: 'Punter'
      },
      'ncaafb': {
        C: 'Center',
        FB: 'Fullback',
        G: 'Offensive Guard',
        OG: 'Offensive Guard',
        OL: 'Offensive Lineman',
        OT: 'Offensive Tackle',
        QB: 'Quarterback',
        RB: 'Running Back',
        T: 'Offensive Tackle',
        TE: 'Tight End',
        WR: 'Wide Receiver',
        CB: 'Cornerback',
        DB: 'Defensive Back',
        DE: 'Defensive End',
        DT: 'Defensive Tackle',
        FS: 'Free Safety',
        LB: 'Linebacker',
        MLB: 'Middle Linebacker',
        NT: 'Nose Tackle',
        OLB: 'Outside Linebacker',
        SAF: 'Safety',
        SS: 'Strong Safety',
        K: 'Kicker',
        LS: 'Long Snapper',
        P: 'Punter'
      },
      'mlb': {
        P: 'Pitcher',
        C: 'Catcher',
        '1B': '1st Base',
        '2B': '2nd Base',
        '3B': '3rd Base',
        SS: 'Shortstop',
        LF: 'Left Field',
        CF: 'Center Field',
        RF: 'Right Field',
        DH: 'Designated Hitter',
        PH: 'Pinch Hitter',
        PR: 'Pinch Runner',
        IF: 'Infield',
        OF: 'Outfield',
        RP: 'Relief Pitcher',
        SP: 'Starting Pitcher'
      }
    },

    parse: function (data) {
      data.profileUrl = this.getProfileUrl(data);
      data.positionFull = this.getDisplayPosition(data);
      return data;
    },

    getDisplayPosition: function (data) {
      var d = data || this.attributes;
      var p;
      if ('position' in d) {
        p = d.position.toUpperCase();
        var sport = d.sport.toLowerCase(),
          positionMap = this.positionMap;

        if (sport in positionMap) {
          if (p in positionMap[sport]) {
            return positionMap[sport][p];
          }
        }
      }

      return p;
    },

    getDisplayHeight: function () {
      var height = this.get('height');
      if (!height || !/^[0-9]+$/.test(height)) {
        return null;
      }
      height = parseInt(height, 10);
      var feet = Math.floor(height / 12);
      var inches = height - feet * 12;
      return feet + "'" + inches + '"';
    },

    getCleanWeight: function () {
      var weight = this.get('weight');
      if (!weight || !/^[0-9]+$/.test(weight)) {
        return null;
      }
      return weight;
    },

    getCleanWeightUnits: function() {
      return "lb";
    },

    getDisplayWeight: function () {
      var weight = this.get('weight');
      if (!weight || !/^[0-9]+$/.test(weight)) {
        return null;
      }
      return weight + ' lbs';
    },

    getFeed: function (options) {
      var feed = new AthleteFeedCollection(null, {
        athleteId: this.get('external_id')
      });
      feed.fetch(options);
    },

    getProfileUrl: function (data) {
      var d = data || this.attributes;
      return '/athlete/' + d.id + '/' + this._getProfileUrlNameComponent(d);
    },

    _getProfileUrlNameComponent: function (data) {
      var d = data || this.attributes;
      var parts = [];
      if (d.first_name) {
        parts.push(d.first_name.toLowerCase());
      }
      if (d.last_name) {
        parts.push(d.last_name.toLowerCase());
      }
      if (parts.length <= 0) {
        parts.push('no-name');
      }
      return parts.join('-').replace(/[^a-z0-9\-]/g, '');
    }
  });

  var AthleteFeedCollection = Feed.FeedCollection.extend({
    constructor: function (models, options) {
      var args = Array.prototype.slice.apply(arguments);
      Feed.FeedCollection.prototype.constructor.apply(this, args);

      this.athleteId = options.athleteId;
    },

    url: function () {
      return '/api/feed/player/' + this.athleteId + '?limit=20';
    }
  });

  return {
    AthleteModel: AthleteModel,
    AthleteAssetsModel: AthleteAssetsModel
  };
});
