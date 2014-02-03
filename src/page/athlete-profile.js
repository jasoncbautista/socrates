define(['jquery', 'backbone', 'mvc/layout', 'app', 'flash', 'model/athlete',
  'page/common/feed/feed', 'page/team-profile', 'util', 'config'], function (
  $, Backbone, Layout, App, Flash, Athlete, Feed, PageTeamProfile, util, config) {
  'use strict';

  var athleteViewMap = {
    'default': 'athlete-profiles/'
    //ncaafb: 'athlete-profiles/ncaafb/'
  };

  function getViewPrefix(sport) {
    return athleteViewMap[sport] || athleteViewMap['default'];
  }

  var displayFeed = function (athlete, athleteView) {
    athlete.getFeed({
      success: function (feedCollection) {
        var feedView = new Feed.FeedView({
          collection: feedCollection
        });
        athleteView.feedContainer.show(feedView);
      },
      error: function () {
        console.log('Unable to retrieve athlete feed');
      }
    });
  };


  var renderGraphs = function(el, model) {
      // Ugly hardcoded graph values:
      var stats = {
        "nba": {"weight": {"bin_counts": [31, 102, 146, 123, 81, 20], "max": 290.0, "delta": 21.5, "bin_range": [161.0, 182.5, 204.0, 225.5, 247.0, 268.5, 290.0], "min": 161.0}, "height": {"bin_counts": [7, 49, 104, 136, 164, 43], "max": 87.0, "delta": 3.0, "bin_range": [69.0, 72.0, 75.0, 78.0, 81.0, 84.0, 87.0], "min": 69.0}}, "nfl": {"weight": {"bin_counts": [288, 539, 500, 157, 407, 64], "max": 360.0, "delta": 32.5, "bin_range": [165.0, 197.5, 230.0, 262.5, 295.0, 327.5, 360.0], "min": 165.0}, "height": {"bin_counts": [12, 206, 355, 787, 535, 60], "max": 81.0, "delta": 2.6666666666666665, "bin_range": [65.0, 67.66666666666667, 70.33333333333333, 73.0, 75.66666666666667, 78.33333333333333, 81.0], "min": 65.0}}, "mlb": {"weight": {"bin_counts": [39, 265, 387, 283, 54, 5], "max": 290.0, "delta": 23.333333333333332, "bin_range": [150.0, 173.33333333333334, 196.66666666666666, 220.0, 243.33333333333331, 266.66666666666663, 290.0], "min": 150.0}, "height": {"bin_counts": [5, 96, 229, 474, 207, 22], "max": 81.0, "delta": 2.6666666666666665, "bin_range": [65.0, 67.66666666666667, 70.33333333333333, 73.0, 75.66666666666667, 78.33333333333333, 81.0], "min": 65.0}}, "ncaafb": {"weight": {"bin_counts": [2527, 10922, 5653, 4276, 723, 20], "max": 401.0, "delta": 44.333333333333336, "bin_range": [135.0, 179.33333333333334, 223.66666666666669, 268.0, 312.33333333333337, 356.6666666666667, 401.0], "min": 135.0}, "height": {"bin_counts": [7, 328, 5770, 13122, 4788, 106], "max": 83.0, "delta": 3.8333333333333335, "bin_range": [60.0, 63.833333333333336, 67.66666666666667, 71.5, 75.33333333333333, 79.16666666666667, 83.0], "min": 60.0}}
      };
      var _id = 'heightGraphCanvas';

      var athlete = model;



    var currentStats = stats[athlete.attributes.sport];
    var getMax = function(numbers) {
        var max = numbers[0];

        _.each(numbers, function(number){
            if (number > max ) {
                max = number;
            }
        });
        return max;
    };

    var normalizeStats = function(statsInfo) {
        var max = getMax(statsInfo.bin_counts);
        var array = [];
        _.each(statsInfo.bin_counts, function(count) {
            array.push(count/max);
        });
        return array;
    };

    var getBinIndex = function(playerInfo, statsArray, delta, min) {
        var index = 0;
        index = Math.floor( (playerInfo - min)/delta);
        // SAFEGUARDS TODO: REMOVE
        if( index >= 6) {
          index = 5;
        }
        if (index < 0) {
          index = 0;
        }
        return index;
    };

    var heightIndex = getBinIndex(athlete.attributes.height, currentStats.height.bin_counts, currentStats.height.delta, currentStats.height.min);
    var weightIndex = getBinIndex(athlete.attributes.weight, currentStats.weight.bin_counts, currentStats.weight.delta, currentStats.weight.min);

    var weights = normalizeStats(currentStats.weight, weightIndex);
    var heights = normalizeStats(currentStats.height, heightIndex);

    // Update images:
    el.find(".heightChart .chartImage img").attr("src", "/img/athlete-profile/heightGraphic" + heightIndex + ".png");
    el.find(".weightChart .chartImage img").attr("src", "/img/athlete-profile/weightGraphic" + weightIndex + ".png");
    
    
    drawChart(el, 'heightGraphCanvas', heights, heightIndex);
    drawChart(el, 'weightGraphCanvas', weights, weightIndex);
  };

  // Only show handles that are defined: 
  var showHandles = function(el, model){
    if (model.attributes.twitter_handle === null ||
        model.attributes.twitter_handle.length === 0 ||
        model.attributes.twitter_handle.trim().length === 0)  {
    } {
      el.find(".twitter-handle").show();
    }
  };

  var AthleteProfileView = Layout.extend({
    tagName: "div",
    className: "page page-athlete-profile",
    templateName: 'athlete-profile',
    onRender: function(){
        try {
            // TODO: move most of this to a third party library!
            renderGraphs(this.$el, this.model);
            showHandles(this.$el, this.model);
        } catch(e) {

        }
    },

    templateHelpers: {

      getURLSafeTeamName: function () {
        // Cleaning up the team name along with location:
        var rawTeamName = util.makeSEOFriendly(this.team.location) +
          "-" + util.makeSEOFriendly(this.team.name);
        return rawTeamName;
      },

      getLogo: function () {
        return util.getLogo(this.team);
      }
    },
    onDomRefresh: function () {
      this.$el.addClass(this.model.get('sport'));
    },

    regions: {
      feedContainer: '.athlete-feed'
    },

    serializeData: function () {
      var serialized = this.model.toJSON();
      serialized.heightDisplay = this.model.getDisplayHeight();
      serialized.weightDisplay = this.model.getDisplayWeight();
      serialized.cleanWeight = this.model.getCleanWeight();
      serialized.cleanWeightUnits = this.model.getCleanWeightUnits();
      serialized.positionDisplay = this.model.getDisplayPosition();
      serialized.team = this.model.get('team').toJSON();
      return serialized;
    }
  });

  var renderPage = function (athlete) {
    var templatePrefix = getViewPrefix(athlete.get('sport'));
    var view = new AthleteProfileView({
      model: athlete,
      templatePrefix: templatePrefix
    });
    App.mainContent.show(view);

    // Render Athlete feed
    displayFeed(athlete, view);
  };

  var teamSuccess = function (team, resp, options) {
    var athlete = options.athlete;
    athlete.set('team', team);

    var url = '/wiki' + config.wikiBucket;
    url += athlete.id + '/wikiprofile.json';
    $.getJSON(url, function (data) {
      athlete.set('bio', data.bio);
      renderPage(athlete);
    }).fail(function () {
      renderPage(athlete);
    });
  };


  var drawChart = function (el, _id, values, selectedIndex  ){
      var canvas = el.find('#' + _id)[0];
      var context = canvas.getContext('2d');
      var drawCircle = function(x, y, context, radius, color ){
          var counterClockwise = false;
          context.beginPath();
          context.arc(x, y, radius, 0 ,  2* Math.PI , counterClockwise);
          context.fillStyle = color;
          context.fill();
      };

      var drawRectangle= function(context, x, y, height, width, color ){
          var counterClockwise = false;
          context.beginPath();
          // x, y, width, height
          context.fillStyle = color;
          context.fillRect(x,y, width, height);
      };


      var drawRects = function( context, circles , selectedIndex, canvasWidth , scale) {
          var topOffset = 10;
          var currentOffset = 0;
          var middle = Math.floor(circles.length/2);
          var yBase = 0;
          var xOffset = 4;

          var widthPerBar = 0.6*canvasWidth* 1/circles.length;
          var leftOffset = 0.4*canvasWidth * 1/2;
          for(var ii = 0; ii < circles.length; ii++) {
              var circle = circles[ii];
              var radius = circle.radius * scale;
              var x = 0;
              x  = currentOffset;
              var color = "#999999";
              if (ii === selectedIndex ) {
                  color = "#ed1e24";
              }

              if (ii >= middle ) {
                  // yBase -=xOffset;
              } else {
                  // yBase +=xOffset;
              }
              yBase = radius;

              var height = radius;
              drawRectangle(context, leftOffset + ii*widthPerBar, 0 , height, widthPerBar, color);
              currentOffset += (radius*2);
          }
      };

      var drawCircles  = function( context, circles , selectedIndex,  leftOffset) {
          var topOffset = 10;
          var currentOffset = leftOffset;
          var middle = Math.floor(circles.length/2);
          var yBase = 0;
          var xOffset = 4;
          for(var ii = 0; ii < circles.length; ii++) {
              var circle = circles[ii];
              var radius = circle.radius;
              var x = 0;
              x  = currentOffset;
              var color = "#999999";
              if (ii === selectedIndex ) {
                  color = "#ed1e24";
              }

              if (ii >= middle ) {
                  // yBase -=xOffset;
              } else {
                  // yBase +=xOffset;
              }
              yBase = radius;

              drawCircle(x+radius ,    yBase  , context, radius, color);
              currentOffset += (radius*2);
          }
      };

      // Sample implementation:
      var circles = [];
      var totalWidth = 0;
      var maxWidth= 148; // Size of canvas el

      // Convert data
      for(var ii = 0; ii < values.length; ii++) {
          var radius = 10 * values[ii];
          radius = Math.ceil(radius);
          circles.push({"radius": radius});
          totalWidth += radius*2;
      }

      var leftOffset= (maxWidth - totalWidth) / 2;
      drawCircles(context, circles , selectedIndex, leftOffset );
      //rawRects(context, circles , selectedIndex, 148, 4);

      // */
  };

  var athleteSuccess = function (athlete) {
    $("title").text("Sqor | " + athlete.attributes.first_name + " " +
      athlete.attributes.last_name);
    $('#metadesc').attr('content', '');
    $('#metakeys').attr('content',
      'sports, scores, news, <sport>, <team>, <school>, <player name>'
    );

    var athleteAssets = new Athlete.AthleteAssetsModel({
      id: athlete.id
    });

    var teamModel = new PageTeamProfile.TeamModel({
      id: athlete.get('team_id')
    });

    teamModel.fetch({
      athlete: athlete,
      success: teamSuccess,
      error: function () {
        Flash.error(
          'Sorry, we could not display this athlete');
      }
    });
  };

  var display = function (athleteId) {
    var athlete = new Athlete.AthleteModel({
      id: athleteId
    });

    athlete.fetch({
      success: athleteSuccess,
      error: function () {
        Flash.error('Sorry, we could not display this athlete');
      }
    });
  };

  return {
    display: display,
    AthleteProfileView: AthleteProfileView
  };
});
