 define(['mvc/item-view', 'app'], function (ItemView, App) {
   'use strict';

   var display = function () {
     document.title = "Sqor | Beat Brett Rules";

     var view = new AboutView();
     App.mainContent.show(view);
   };

   var AboutView = ItemView.extend({
     tagName: "div",
     className: "page page-beatbrett",
     templateName: "beatbrett"
   });

   return {
     display: display
   };
 });
