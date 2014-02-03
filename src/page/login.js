(function(window) {
    'use strict';

    define(['underscore', 'backbone', 'marionette', 'mvc/item-view', 'app', 'auth/auth', 'flash', 'auth/facebook'], function(_, Backbone, Marionette, ItemView, App, Auth, Flash, Facebook) {

        var LoginModel = Backbone.Model.extend({
            defaults: {
                returnPath: null
            }
        });


        var LoginView = ItemView.extend({
            tagName: 'div',
            className: "page page-login",
            templateName: "login",

            events: {
                'submit .login-form': '_onSubmit',
                'click .btn-fb-login': '_onClickFbLogin'
            },

            serializeData: function() {
                return {
                    isLoggedIn: Auth.isLoggedIn(),
                    email: Auth.get('email')
                };
            },

            _onSubmit: function(e) {
                var data, that = this;

                e.preventDefault();

                data = {
                    provider: 'email',
                    email: this.$el.find('.login-form input[name="email"]').val(),
                    secret: this.$el.find('.login-form input[name="password"]').val()
                };

                Auth.login(data, {
                    success: function() {
                        that._onLoginSuccess();
                    },
                    error: function(message) {
                        Flash.error(message);
                    }
                });
            },

            _onClickFbLogin: function(e) {
                var that = this;

                e.preventDefault();

                Facebook.loginOrRegister({
                    success: function() {
                        that._onLoginSuccess();
                    },
                    error: function() {
                        Flash.error('Facebook login failed');
                    }
                });
            },

            _onLoginSuccess: function() {
                if (this.model.get('returnPath')) {
                    Backbone.history.navigate('/reset', true);
                    Backbone.history.navigate(this.model.get('returnPath'), true);
                } else {
                    this.render();
                }
            }
        });

        return {
            LoginModel: LoginModel,
            LoginView: LoginView
        };
    });
}(window));
