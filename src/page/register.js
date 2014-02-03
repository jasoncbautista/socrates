(function(window) {
    'use strict';

    define([ 'auth/auth', 'underscore', 'backbone', 'flash', 'mvc/item-view', 'auth/facebook', 'app' ], function(Auth, _, Backbone, Flash, ItemView, Facebook, App) {

        var display = function() {
            document.title = "Sqor | Register";
            
            var view = new RegisterView({ model: Auth });
            App.mainContent.show(view);
        };

        var RegisterView = ItemView.extend({
            tagName: "div",
            className: "page page-register",
            templateName: "register",

            ui: {
                email: '.register-form input[name="email"]',
                password: '.register-form input[name="password"]',
                passwordRepeat: '.register-form input[name="password2"]'
            },

            events: {
                'submit .register-form': '_onSubmit',
                'click .btn-fb-register': '_onClickFbRegister'
            },

            serializeData: function() {
                return {
                    isLoggedIn: this.model.isLoggedIn()
                };
            },

            _onSubmit: function(e) {
                e.preventDefault();

                if (!this._validate()) {
                    return;
                }

                this.model.register({
                        provider: 'email',
                        email: this.ui.email.val(),
                        secret: this.ui.password.val()
                    },
                    {
                        success: _.bind(function() {
                            Flash.success('Registration successful');
                            this.render();
                        }, this),
                        error: function(message) {
                            Flash.error(message);
                        }
                    });
            },

            _onClickFbRegister: function(e) {
                e.preventDefault();

                Facebook.loginOrRegister({
                    success: _.bind(function() {
                        Flash.success('Registration successful');
                        this.render();
                    }, this),
                    error: function(message) {
                        Flash.error(message);
                    }
                });
            },

            _validate: function() {
                if (this.ui.password.val() !== this.ui.passwordRepeat.val()) {
                    Flash.error('Passwords do not match');
                    return false;
                }
                return true;
            }
        });

        return {
            display: display
        };
    });
}(window));
