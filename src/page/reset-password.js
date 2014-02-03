(function(window) {
    'use strict';

    define([ 'backbone', 'mvc/item-view', 'app', 'flash' ], function(Backbone, ItemView, App, Flash) {

        var display = function(userId, resetToken) {
            document.title = "Sqor | Reset Password";

            var model = new ResetPasswordModel({
                userId: userId,
                token: resetToken
            });
            var view = new ResetPasswordView({ model: model });
            App.mainContent.show(view);
        };

        var ResetPasswordModel = Backbone.Model.extend({
            url: '/api/reset_pw'
        });

        var ResetPasswordView = ItemView.extend({
            tagName: "div",
            className: "page page-reset-password",
            templateName: "reset-password",

            ui: {
                password: '.reset-password-form input[name="password"]',
                password2: '.reset-password-form input[name="password2"]'
            },

            events: {
                'submit .reset-password-form': '_onSubmit'
            },

            _onSubmit: function(e) {
                e.preventDefault();

                if (!this._validate()) {
                    return;
                }

                this.model.save({
                    pw: this.ui.password.val()
                }, {
                    success: function() {
                        Backbone.history.navigate('/login', true);
                    },
                    error: function() {
                        Flash.error('Sorry, we were unable to reset your password. Please try again.');
                    }
                });
            },

            _validate: function() {
                if (this.ui.password.val().length <= 0) {
                    this.ui.password.focus();
                    Flash.error('Please enter your new password');
                    return false;
                } else if (this.ui.password.val() !== this.ui.password2.val()) {
                    this.ui.password2.focus();
                    Flash.error('The passwords you entered do not match');
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
