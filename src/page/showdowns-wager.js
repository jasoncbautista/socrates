(function(window) {
    'use strict';

    define([ 'backbone', 'mvc/layout', 'mvc/item-view', 'page/showdowns', 'flash', 'app' ], function(Backbone, Layout, ItemView, PageShowdowns, Flash, App) {

        var display = function(showdownsId, wagerId) {
            document.title = "Sqor | Showdown Wager";

            var showdownsModel = new PageShowdowns.ShowdownsModel({ id: showdownsId });
            var showdownsView = new PageShowdowns.ShowdownsView({ model: showdownsModel });
            var wagerModel = new ShowdownsWagerModel({ showdowns: showdownsModel, wagerId: wagerId });
            var wagerView = new ShowdownsWagerLayout({ model: wagerModel });

            App.mainContent.show(wagerView);

            wagerModel.fetch({
                success: function() {
                    wagerView.render();
                    wagerView.showdownsContainer.show(showdownsView);
                },
                error: function() {
                    Flash.error('Sorry, we were unable to retrieve this head-to-head matchup');
                }
            });

            showdownsModel.fetch({
                success: function() {
                    wagerView.render();
                    wagerView.showdownsContainer.show(showdownsView);
                },
                error: function() {
                    Flash.error('Sorry, we were unable to retrieve this head-to-head matchup');
                }
            });
        };

        var ShowdownsWagerModel = Backbone.Model.extend({

            url: function() {
                return '/api/h2h/' + this.get('showdowns').get('id') + '/wagers/' + this.get('wagerId');
            },

            parse: function(response) {
                if (response.length <= 0) {
                    throw 'No wager data received';
                }
                response[0].wager_amt = 100;
                return { wager: response[0] };
            },

            getStatAction: function() {
                switch (this.get('showdowns').get('stat_type')) {
                    case 'fumbles':
                        return 'fumble';
                    case 'passingyards':
                        return 'pass for';
                    case 'penalties':
                        return 'get';
                    case 'points':
                        return 'score';
                    case 'receivingyards':
                        return 'receive for';
                    case 'rushingyards':
                        return 'rush for';
                    case 'tackles':
                        return 'tackle';
                    case 'touchdowns':
                        return 'score';
                    case 'turnovers':
                        return 'turnover';
                    case 'wins':
                        return 'win';
                    case 'yardage':
                        return 'acquire';
                }
                return '[unknown stat]';
            },

            getStatUnits: function() {
                switch (this.get('showdowns').get('stat_type')) {
                    case 'fumbles':
                        return 'times';
                    case 'passingyards':
                        return 'yards';
                    case 'penalties':
                        return 'penalties';
                    case 'points':
                        return 'points';
                    case 'receivingyards':
                        return 'yards';
                    case 'rushingyards':
                        return 'yards';
                    case 'tackles':
                        return 'times';
                    case 'touchdowns':
                        return 'touchdowns';
                    case 'turnovers':
                        return 'times';
                    case 'wins':
                        return 'times';
                    case 'yardage':
                        return 'yards';
                }
                return '[unknown stat]';
            }

        });

        var ShowdownsWagerLayout = Layout.extend({
            tagName: "div",
            className: "page page-showdowns-wager",
            templateName: 'showdowns-wager',

            regions: {
                showdownsContainer: '.showdowns-container'
            },

            serializeData: function() {
                var data = Layout.prototype.serializeData.apply(this);
                var showdowns = this.model.get('showdowns');
                data.showdowns = showdowns && showdowns.toJSON() || null;
                data.statAction = this.model.getStatAction();
                data.statUnits = this.model.getStatUnits();
                return data;
            }
        });


        return {
            display: display
        };

    });
}(window));
