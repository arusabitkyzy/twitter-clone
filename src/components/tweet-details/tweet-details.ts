import {Component, inject, Input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../post/post';
import {TweetInfo} from '../../models/Tweet';
import {TweetServices} from '../../services/tweet-service/tweet-services';
import {PostEditor} from '../post-editor/post-editor';
import {LoadingBar} from '../loading-bar/loading-bar';
import {CommentsModal} from '../../features/comments/comments-modal/comments-modal';
import {Modal} from '../modal/modal';
import { Location } from '@angular/common';
import {TweetStore} from '../../store/tweet-store/tweet-store';

@Component({
  selector: 'app-tweet-details',
  imports: [
    MatIconModule,
    Post,
    PostEditor,
    LoadingBar,
    CommentsModal,
    Modal
  ],
  templateUrl: './tweet-details.html',
  styleUrl: './tweet-details.scss',
})
export class TweetDetails {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  tweetService = inject(TweetServices);
  tweetStore = inject(TweetStore);
  location = inject(Location);

  tweetId = signal<string | null>(null);
  tweet = signal<TweetInfo | null>(null);
  isLoading = signal(false);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;

      this.tweetId.set(id);

      const cached = this.tweetStore.get(id);
      if (cached) {
        this.tweet.set(cached);
        return;
      }

      this.isLoading.set(true);
      try {
        const tweet = await this.tweetService.getTweetById(id);
        if (tweet) {
          this.tweetStore.set(tweet);
          this.tweet.set(tweet);
        }
      } finally {
        this.isLoading.set(false);
      }
    });
  }

  navigateBack() {
    this.location.back();
  }

  navigateTweet(comment: TweetInfo) {
    // cache immediately for instant back navigation
    this.tweetStore.set(comment);
    this.router.navigate(['/tweet', comment.author.username, comment.uid]);
  }

  async onSubmit(comment: TweetInfo) {
    const id = this.tweetId();
    if (!id || !this.tweet()) return;

    this.isLoading.set(true);
    try {
      await this.tweetService.addComment(id, comment);

      const updated: TweetInfo = {
        ...this.tweet()!,
        comments: [...this.tweet()!.comments, comment]
      };

      // 🔥 update BOTH component and store
      this.tweet.set(updated);
      this.tweetStore.set(updated);

    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
