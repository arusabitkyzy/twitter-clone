import {Component, inject, Input} from '@angular/core';
import {PostActionModal} from "../../../features/posts/post-action-modal/post-action-modal";
import {TimePassedSinceCreationPipe} from "../../../helper/time-passed-since-creation-pipe";
import {Avatar} from '../avatar/avatar';
import {TweetServices} from '../../../services/tweet-service/tweet-services';
import {TweetInfo} from '../../../models/Tweet';
import {CommentsModal} from '../../../features/comments/comments-modal/comments-modal';
import {Modal} from '../../modal/modal';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-post-author',
  imports: [
    PostActionModal,
    TimePassedSinceCreationPipe,
    MatIconModule,
    Modal
  ],
  templateUrl: './post-author.html',
  styleUrl: './post-author.scss',
})
export class PostAuthor {
  tweetService = inject(TweetServices)
  @Input() tweet = {} as TweetInfo
}
