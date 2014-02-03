(function (window) {
  'use strict';

  define(['jquery', 'page/common/ncaaAssets'], function ($, ncaaAssets) {

    var isValidEmail = function (address) {
      return (
        /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9]{2,}$/
      ).test(address);
    };


    var htmlToPlainText = function (html) {
      if (!html) {
        return html;
      }

      html = html.replace(/<img[^>]+>/g, '');

      var $div = $('<div></div>').html(html);
      $div.find('script').empty();
      return $.trim($div.text());
    };

    var getLogo = function (data) {
      try {
      if (data.sport === 'ncaafb' ) {
        return ncaaAssets[data.external_id].image;
      }
        var city = data.location.split(',')[0].toLowerCase();
        city = city.replace(/[\s\.]/g, '');
        var name = data.name.toLowerCase().replace(/[\s\.]/g, '');
        var sport = data.sport;
        var filename = city + '_' + name + '.png';
        var url = 'http://s3-us-west-2.amazonaws.com/sqor-images/';
        return url + sport + '/' + filename;
      } catch(e){}
    };

    /**
      * Cleans up strings to be SEO friendly. Mostly used for parts of a URL.
      * @param (string) str, string to make SEO friendly
      * @return (string) SEO friendly string
      */
    var makeSEOFriendly = function(str){
        var seoString = str;
        // Remove excess white space
        seoString = seoString.trim();
        // Replace all spaces with -
        seoString = seoString.replace(/[-']/g, '');
        seoString = seoString.replace(/\s+/g, ' ');
        seoString = seoString.replace(/ /g, '-');
        seoString = seoString.toLowerCase();
        return seoString;
    };

    return {
      isValidEmail: isValidEmail,
      htmlToPlainText: htmlToPlainText,
      makeSEOFriendly: makeSEOFriendly,
      getLogo: getLogo
    };
  });

}(window));
