import {Component, inject, Input, signal} from '@angular/core';
import {TimePassedSinceCreationPipe} from '../../helper/time-passed-since-creation-pipe';
import {Avatar} from '../ui/avatar/avatar';
import {TweetInfo} from '../../models/Tweet';
import {TweetServices} from '../../services/tweet-service/tweet-services';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [
    TimePassedSinceCreationPipe,
    Avatar,
    NgClass
  ],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  standalone: true,
})
export class Post {
  tweetService = inject(TweetServices)
  @Input() tweet = {} as TweetInfo
  isLiked = signal(false);
  likeCount = signal<number>(0)
  pending = signal(false);

  isSaved = signal(false);
  isReposted = signal(false);
  repostCount = signal<number>(0)
  protected readonly JSON = JSON;

  ngOnInit() {
    const likeStatus = this.tweetService.didCurrentUserLikeTweets(this.tweet)
    this.likeCount.set(this.tweet.likes)
    this.isLiked.set(likeStatus)

    const saveStatus = this.tweetService.didCurrentUserSavedTweet(this.tweet)
    this.isSaved.set(saveStatus)
  }

  async likePost() {
    if (this.pending()) return;
    this.pending.set(true);

    // Optimistic UI update
    const wasLiked = this.isLiked();
    this.isLiked.set(!wasLiked);
    this.likeCount.update(likes => {
      if(wasLiked) {
        if(likes > 0) {
          return likes - 1
        }
        return likes;
      }
      return likes + 1
    });

    try {
      await this.tweetService.likeTweet(this.tweet);
    } finally {
      this.pending.set(false);
    }
  }

  async savePost() {
    const isSaved = this.isSaved();
    this.isSaved.set(!isSaved);

    // Implement save functionality here
    this.tweetService.saveTweet(this.tweet);
  }

  async repostPost() {
    // Optimistic UI update
    const wasReposted = this.isReposted();
    this.isReposted.set(!wasReposted);
    this.repostCount.update(repost => {
      if(wasReposted) {
        if(repost > 0) {
          return repost - 1
        }
        return repost;
      }
      return repost + 1
    });

    try {
      await this.tweetService.repostTweet(this.tweet);
    } catch(error) {
      console.log(error)
    }
  }
}
