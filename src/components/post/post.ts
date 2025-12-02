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
  protected readonly JSON = JSON;

  ngOnInit() {
    const status = this.tweetService.didCurrentUserLikeTweets(this.tweet)
    this.isLiked.set(status)
    this.likeCount.set(this.tweet.likes)
  }

  likePost() {
    if(this.isLiked()) {
      this.likeCount.update(likes => likes--)
    }
    else {
      this.likeCount.update(likes => likes++)
    }
    this.isLiked.set(!this.isLiked)
    this.tweetService.likeTweet(this.tweet)
  }
}
