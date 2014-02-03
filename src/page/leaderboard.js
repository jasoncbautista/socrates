(function(window) {
    'use strict';

    define([ 'underscore', 'backbone', 'mvc/composite-view', 'mvc/item-view', 'user', 'app' ], function(_, Backbone, CompositeView, ItemView, User, App) {

        var display = function() {
            document.title = "Sqor | Leaderboard";

            var collection = new LeaderboardCollection();
            collection.fetch({
                complete: function() {
                    var view = new LeaderboardView({ collection: collection });
                    App.mainContent.show(view);
                }
            });
        };

        var LeaderboardEntryModel = Backbone.Model.extend({
        });

        var LeaderboardCollection = Backbone.Collection.extend({
            model: LeaderboardEntryModel,

            defaults: {
                filter: null
            },

            url: function() {
                var url = '/api/leaderboard';
                if (this.get('filter')) {
                    url += '?filter=' + encodeURIComponent(this.get('filter'));
                }
                return url;
            }
        });

        var LeaderboardEntryView = ItemView.extend({
            tagName: 'tr',
            templateName: 'leaderboard-entry',

            serializeData: function() {
                return {
                    rank: this.options.index + 1,
                    name: this.model.get('firstname') + ' ' + this.model.get('lastname'),
                    userProfileUrl: '/user/' + this.model.get('id'),
                    wins: this.model.get('wins'),
                    percentage: Math.round(100 * this.model.get('winratio')) + '%',
                    losses: this.model.get('total') - this.model.get('wins'),
                    avatar: this.model.get('avatar') || 'http://www.aiga.org/uploadedImages/AIGA/Content/About_AIGA/Become_a_member/generic_avatar_300.gif'
                };
            }
        });

        var LeaderboardView = CompositeView.extend({
            tagName: 'div',
            className: 'page page-leaderboard',
            templateName: 'leaderboard',
            itemView: LeaderboardEntryView,
            itemViewContainer: '.entries',
            itemViewOptions: function(model, index) {
                return {
                    index: index
                };
            }
        });

        return {
            display: display
        };
    });
}(window));
