(function(window) {
    'use strict';

    define([ 'backbone', 'mvc/item-view', 'app', 'flash', 'auth/auth' ], function(Backbone, ItemView, App, Flash, Auth) {

        var display = function() {
            document.title = "Sqor | Forgot Password";
            
            var model = new ForgotPasswordModel();
            var view = new ForgotPasswordView({ model: model });
            App.mainContent.show(view);
        };

        var ForgotPasswordModel = Backbone.Model.extend({
            url: '/api/forgotpassword'
        });

        var ForgotPasswordView = ItemView.extend({
            tagName: 'div',
            className: 'page page-forgot-password',
            templateName: 'forgot-password',

            ui: {
                email: '.forgot-password-form input[name="email"]'
            },

            events: {
                'submit .forgot-password-form': '_onSubmit'
            },

            serializeData: function() {
                return {
                    isLoggedIn: Auth.isLoggedIn(),
                    email: Auth.get('email')
                };
            },

            _onSubmit: function(e) {
                e.preventDefault();

                if (!this._validate()) {
                    return;
                }

                this.model.save({
                    email: this.ui.email.val()
                }, {
                    success: function() {
                        this.$el.find('.forgot-password-form').text('An email has been sent.');
                    },
                    error: function() {
                        Flash.error('Sorry, we were unable to send a password recovery email. Please try again.');
                    }
                });
            },

            _validate: function() {
                if (this.ui.email.val().length <= 0) {
                    this.ui.email.focus();
                    Flash.error('Please enter your email address');
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
