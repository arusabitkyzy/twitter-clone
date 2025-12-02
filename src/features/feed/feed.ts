import {Component, inject, SimpleChanges} from '@angular/core';
import {AddPost} from "../posts/add-post/add-post";
import {signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {AuthService} from '../../services/auth-service/auth-service';
import {TweetServices} from '../../services/tweet-service/tweet-services';
import {Post} from '../../components/post/post';


@Component({
  selector: 'app-feed',
  imports: [
    AddPost,
    NgClass,
    Post
  ],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed {
  category = signal('RECOMMENDED')
  auth = inject(AuthService)
  tweetService = inject(TweetServices)

  constructor() {
    this.tweetService.loadTweets()
  }

  changeCategory(new_category: string) {
    this.category.set(new_category);
  }

}
