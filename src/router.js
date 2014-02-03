(function (window) {
  'use strict';
  /**
   * Application router
   */

  window.define([
        'jquery',
        'backbone',
        'marionette',
        'app',
        'auth/auth',
        'require',
        'analytics/google',
        'page/login'
    ], function ($, Backbone, Marionette, App, Auth, require, ga) {

    var MainRouter, MainController, mainRouter;

    App.addInitializer(function () {
      mainRouter = new MainRouter({
        controller: new MainController()
      });

      // Catch links and use pushSate
      $(window.document).on('click', 'a:not([data-bypass])', function (e) {
        e.preventDefault();
        var href = $(this).prop('href');
        var location = window.location;
        var root = location.protocol + '//' + location.host + '/';
        if (root === href.slice(0, root.length)) {
          Backbone.history.navigate(href.slice(root.length), true);
        }
      });

      // Catch coming soon links
      $(window.document).on('click', 'a[data-coming-soon]', function (e) {
        e.preventDefault();
        $('#coming-soon-modal').modal();
      });
    });


    MainRouter = Marionette.AppRouter.extend({
      initialize: function () {
        var args = Array.prototype.slice.apply(arguments);
        Marionette.AppRouter.prototype.initialize.apply(this, args);

        this.bind('route', function () {
          ga('send', 'pageview', Backbone.history.root + Backbone.history
            .fragment);
        });
      },

      appRoutes: {
        '': 'home',
        'about': 'about',
        'athlete/:athlete_id/:name': 'athleteProfile',
        'auburn-vs-lsu': 'auburnVsLsu',
        'beatbrett': 'beatbrett',
        'contact': 'contact',
        'forgot-password': 'forgotPassword',
        'gettheapp': 'itunesApp',
        'leaderboard': 'leaderboard',
        'login': 'login',
        'privacy': 'privacy',
        'register': 'register',
        'reset': 'reset',
        'reset-password/:user_id/:reset_token': 'resetPassword',
        'showdowns/:showdowns_id': 'showdowns',
        'showdowns/:showdowns_id/call/:wager_id': 'showdownsWager',
        'sports': 'sportsList',
        'sport/:sportId': 'teams',
        'sport/:sportId/page/:page': 'teams',
        'support': 'support',
        'team/:team_id': 'teamProfile',
        'team/:team_id/:sport/:teamname': 'teamProfile',
        'tos': 'tos',
        'ufc': 'ufc',
        'user/:id': 'userProfile'
      }
    });


    /**
     * Use this function to wrap route handlers that require the user to
     * be authenticated. Will show login view if user is not logged in,
     * then redirect them to the page they were trying to access.
     */
    var requiresAuth = function (routeCallback) {
      return function () {
        if (!Auth.isLoggedIn()) {
          showLogin(Backbone.history.fragment);
          return;
        }

        routeCallback.apply(this, arguments);
      };
    };

    /**
     * A simple route handler for any page that exports a method named
     * display. Args for the route are forwarded to the page's display
     * method.
     */
    var displayPage = function (pageModule) {
      return function () {
        var args = Array.prototype.slice.apply(arguments);

        require([pageModule], function (Page) {
          Page.display.apply(Page, args);
        });
      };
    };


    MainController = Marionette.Controller.extend({
      home: displayPage('page/home'),

      about: displayPage('page/about'),
      
      beatbrett: displayPage('page/beatbrett'),

      athleteProfile: displayPage('page/athlete-profile'),

      auburnVsLsu: displayPage('page/auburn-vs-lsu'),

      contact: displayPage('page/contact'),

      forgotPassword: displayPage('page/forgot-password'),

      gettheapp: displayPage('page/getapp'),

      showdowns: displayPage('page/showdowns'),

      showdownsWager: displayPage('page/showdowns-wager'),

      leaderboard: displayPage('page/leaderboard'),

      login: function () {
        showLogin('/');
      },

      privacy: displayPage('page/privacy'),

      register: displayPage('page/register'),

      reset: function () {
        App.mainContent.close();
      },

      resetPassword: displayPage('page/reset-password'),

      sportsList: displayPage('page/sports-list'),

      support: displayPage('page/support'),

      tos: displayPage('page/tos'),

      teamProfile: displayPage('page/team-profile'),

      teams: displayPage('page/team-list'),

      ufc: displayPage('page/ufc'),

      userProfile: displayPage('page/user-profile'),

      itunesApp: function () {
        window.location =
          'https://itunes.apple.com/us/app/sqor/id700913088?ls=1&mt=8';
      }
    });


    var showLogin = function (returnPath) {
      returnPath = returnPath || Backbone.history.fragment;
      if (returnPath === 'login' || returnPath === '/login') {
        returnPath = '/';
      }

      require(['page/login'], function (PageLogin) {
        var model = new PageLogin.LoginModel({
          returnPath: returnPath
        });
        var view = new PageLogin.LoginView({
          model: model
        });
        App.mainContent.show(view);
      });
    };


    return {
      MainRouter: MainRouter,
      MainController: MainController,
      showLogin: showLogin
    };
  });

}(window));
