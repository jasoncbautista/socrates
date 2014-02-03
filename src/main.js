(function (window) {
  'use strict';
  /**
   * Bootstrap
   *
   * This file bootstraps the main application and includes all the global
   * libraries.
   */

  var require = window.require;

  require.config({
    paths: {
      'jquery': 'lib/jquery/jquery-1.10.2.min',
      'nested': 'lib/nested/jquery.nested',
      'facebook': '//connect.facebook.net/en_US/all',
      'underscore': 'lib/underscore/underscore',
      'json2': 'lib/json2/json2',
      'backbone': 'lib/backbone/backbone-min',
      'bootstrap': 'lib/bootstrap/bootstrap.min',
      'marionette': 'lib/backbone.marionette/backbone.marionette',
      'modernizr': 'lib/modernizr/modernizr-2.6.2.min',
      'backbone.wreqr': 'lib/backbone.marionette/backbone.wreqr',
      'backbone.babysitter': 'lib/backbone.marionette/backbone.babysitter',
      'moment': 'lib/moment/moment.min',
      'localstorage': 'lib/localstorage/localstorage'
    },
    shim: {
      'backbone': {
        deps: ['json2', 'underscore', 'jquery'],
        exports: 'Backbone'
      },
      'nested': {
        deps: ['jquery']
      },
      'backbone.wreqr': {
        deps: ['backbone'],
        exports: 'Backbone.Wreqr'
      },
      'backbone.babysitter': {
        deps: ['backbone'],
        exports: 'Backbone.ChildViewContainer'
      },
      'bootstrap': {
        deps: ['jquery']
      },
      'facebook': {
        exports: 'FB'
      },
      'json2': {
        exports: 'JSON'
      },
      'moment': {
        exports: 'moment'
      },
      'underscore': {
        exports: '_'
      }
    }
  });

  require(['config'], function (config) {
    require.config({
      config: {
        'GoogleAnalytics': {
          'id': config.googleAnalyticsId
        }
      }
    });
  });

  var reqs = ['analytics/google', 'modernizr', 'bootstrap',
    'mvc/backbone-sync-override', 'router', 'app', 'nav'];
  require(reqs, function (GA, Modernizr, Bootstrap, BackboneSyncOverride,
    Router, App, Nav) {
    App.addInitializer(function () {
      BackboneSyncOverride.init();
      Nav.init();
    });
    App.start();
    console.log('Started');
  });

}(window));
