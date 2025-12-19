import {Injectable} from '@angular/core';
import {TweetInfo} from '../../models/Tweet';

@Injectable({ providedIn: 'root' })
export class TweetStore {
  private tweets = new Map<string, TweetInfo>();

  get(id: string): TweetInfo | undefined {
    return this.tweets.get(id);
  }

  set(tweet: TweetInfo) {
    this.tweets.set(tweet.uid, tweet);
  }

  has(id: string) {
    return this.tweets.has(id);
  }
}
