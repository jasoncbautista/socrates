(function(window) {
    'use strict';

    define([ 'backbone', 'marionette', 'auth/auth', 'app' ], function(Backbone, Marionette, Auth, App) {
        var loginStatusView, siteSearchView;

        var init = function() {
            // loginStatusView = new LoginStatusView({ model: Auth });
            // loginStatusView.render();

            // siteSearchView = new SiteSearchFormView();

            $('.touch header nav ul li a[href]').click(function() {
                $('header nav .navbar-collapse').collapse('hide');
            });
        };

        /**
         * View displayed in the site header. Indicates whether or not the user is logged in.
         */
        var LoginStatusView = Marionette.ItemView.extend({
            el: '.login-status',
            template: '#login-status-template',

            initialize: function() {
                this.listenTo(this.model, 'change', function() { this.render(); });
            },

            events: {
                'click .logout-btn': '_onClickLogout'
            },

            serializeData: function() {
                return {
                    isLoggedIn: this.model.isLoggedIn(),
                    email: this.model.get('email')
                };
            },

            _onClickLogout: function(e) {
                e.preventDefault();
                this.model.clear();
                Backbone.history.navigate('/gettheapp', true);
            }
        });

        var SiteSearchFormView = Backbone.View.extend({
            el: 'header nav .search-form',

            events: {
                'submit': '_onSubmit'
            },

            _onSubmit: function(e) {
                e.preventDefault();
                console.log('Search submitted');
                Backbone.history.navigate('/search');
            }
        });

        return {
            init: init
        };

    });

}(window));