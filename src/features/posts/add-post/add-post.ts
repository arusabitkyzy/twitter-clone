import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service/auth-service';
import {UserProfile} from '../../../models/User';
import {Avatar} from '../../../components/ui/avatar/avatar';
import {TweetServices} from '../../../services/tweet-service/tweet-services';
import {TweetInfo} from '../../../models/Tweet';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.html',
  styleUrls: ['./add-post.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, Avatar]
})
export class AddPost {
  currentUser: UserProfile | null;
  isLoading = signal(false)

  form = new FormGroup({
    contentText: new FormControl('', [Validators.required]),
    contentImage: new FormControl(''),
    createdAt: new FormControl(new Date()),
    likes: new FormControl(0),
    comments: new FormControl(0),
    reposts: new FormControl(0),
    views: new FormControl(0),
    replyAllowed: new FormControl(true),
  });

  constructor(private authService: AuthService, private tweetService: TweetServices) {
    this.currentUser = authService.getUser()
  }

  onSubmit() {
    console.log(this.form.value);
    this.isLoading.set(true)
    if (this.form.invalid) return;

    // @ts-ignore
    this.tweetService.addTweet(this.form.value as TweetInfo)
      .then(() => {
        console.log('Successfully added the post');
        this.isLoading.set(false)
        this.form.reset({
          contentText: '',
          contentImage: '',
          likes: 0,
          comments: 0,
          reposts: 0,
          views: 0,
          replyAllowed: true
        });
      })
      .catch((error: any) => {
        console.error('Error adding tweet:', error);
      });
  }
}
