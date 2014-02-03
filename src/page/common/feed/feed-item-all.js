define(['page/common/feed/feed-item-news-article',
        'page/common/feed/feed-item-tweet',
        'page/common/feed/feed-item-getty-image',
        'page/common/feed/feed-item-news-pic-big'], function (NewsFeedItem,
  TweetFeedItem, GettyImage, NewsPicBigItem) {
  'use strict';

  /**
   * This is an ordered list. The NewsFeedItem is a catch all for news articles
   * that may have media we don't know how to handle yet. 
   */
  return [
    NewsPicBigItem,
    NewsFeedItem,
    GettyImage,
    TweetFeedItem
    ];
});
