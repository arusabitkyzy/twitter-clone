import {Component, input, Input} from '@angular/core';
import {Avatar} from '../ui/avatar/avatar';
import {PostAuthor} from '../ui/post-author/post-author';
import {TweetInfo} from '../../models/Tweet';

@Component({
  selector: 'app-post-content',
  imports: [
    Avatar,
    PostAuthor
  ],
  standalone: true,
  templateUrl: './post-content.html',
  styleUrl: './post-content.scss',
})
export class PostContent {
  mode = input<'detailed' | 'shortcut'>('detailed')
  @Input() tweet!: TweetInfo;
}
