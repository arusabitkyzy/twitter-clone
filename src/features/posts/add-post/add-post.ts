import {Component, inject} from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import {Avatar} from '../../../components/ui/avatar/avatar';
import {TweetInfo} from '../../../models/Tweet';
import {PostEditor} from '../../../components/post-editor/post-editor';
import {TweetServices} from '../../../services/tweet-service/tweet-services';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.html',
  styleUrls: ['./add-post.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, Avatar, PostEditor]
})
export class AddPost {
  tweetService = inject(TweetServices)

  onSubmit(payload: TweetInfo) {
    this.tweetService.addTweet(payload)
      .then(() => {
        console.log('Successfully added the post');
      })
      .catch((error: any) => {
        console.error('Error adding tweet:', error);
      });
  }
}
