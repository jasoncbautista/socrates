define(['backbone'], function (Backbone) {
  'use strict';

  var Sport = {},
    shortNameMap = {
      mlb: 'MLB',
      nfl: 'NFL',
      ncaafb: 'NCAA Football',
      nba: 'NBA'
    };

  Sport.Collection = Backbone.Collection.extend({
    url: '/rest/sports/sports',
    model: Sport.Model
  });

  Sport.Model = Backbone.Model.extend({
    url: '/rest/sports/sports',

    /**
     * Object member shortcut to getShortName
     *
     * @see Sport.Model.getShortName
     * */
    shortName: function () {
      return Sport.Model.getShortName(this.get('name'));
    }
  });

  /**
   * Static method that returns the short name for a sport
   *
   * @param {string} abbr Sport abbreviation
   * @return {string} Short name
   */
  Sport.Model.getShortName = function (abbr) {
    abbr = abbr.toLowerCase();
    if (abbr in shortNameMap) {
      return shortNameMap[abbr];
    }

    return abbr.toUpperCase();
  };

  return Sport;
});
