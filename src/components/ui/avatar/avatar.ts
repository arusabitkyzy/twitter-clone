import {Component, Input} from '@angular/core';
import {UserProfile} from '../../../models/User';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  standalone: true,
})
export class Avatar {
  @Input() user: UserProfile|null = {} as UserProfile|null
}
