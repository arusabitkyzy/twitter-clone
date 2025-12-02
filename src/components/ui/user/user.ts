import {Component, Input} from '@angular/core';
import {Avatar} from '../avatar/avatar';
import {UserProfile} from '../../../models/User';

@Component({
  selector: 'app-user',
  imports: [
    Avatar
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss',
  standalone: true,
})
export class User {
  @Input() user = {} as UserProfile;
  @Input() isVerified = false;
  @Input() isActionInvolved = false;
  @Input() actionText = ""
  @Input() actionFunc = () => {}
}
