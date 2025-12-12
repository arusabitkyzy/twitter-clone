import {Component, inject, Input, signal} from '@angular/core';
import {TweetInfo} from '../../../models/Tweet';
import { MatIconModule } from '@angular/material/icon';
import {ModalService} from '../../../services/modal-service/modal-service';
import {PostEditor} from '../../../components/post-editor/post-editor';
import {TweetServices} from '../../../services/tweet-service/tweet-services';
import {PostContent} from '../../../components/post-content/post-content';

@Component({
  selector: 'app-comments-modal',
  imports: [
    MatIconModule,
    PostEditor,
    PostContent,
  ],
  templateUrl: './comments-modal.html',
  styleUrl: './comments-modal.scss',
})
export class CommentsModal {
  @Input() tweet!: TweetInfo;
  modalService = inject(ModalService);
  tweetService = inject(TweetServices);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    console.log(this.tweet);
  }

  onSubmit(comment: TweetInfo) {
    this.isLoading.set(true)
    this.tweetService.addComment(this.tweet.uid, comment)
      .then(() => {
        console.log('Successfully added the comment');
        this.isLoading.set(false)
        // Close this specific modal after submitting
        this.modalService.closeModal(`commentsModal-${this.tweet.uid}`);
      })
      .catch((error: any) => {
        console.error('Error adding comment:', error);
      });
  }
}
