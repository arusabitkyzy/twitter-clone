import { Component } from '@angular/core';
import {Feed} from '../../features/feed/feed';

@Component({
  selector: 'app-home',
  imports: [
    Feed
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
