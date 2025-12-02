import { Component } from '@angular/core';
import {News} from "../news/news";
import {Search} from '../../components/search/search';
import {FollowRecommendations} from '../follow-recommendations/follow-recommendations';

@Component({
  selector: 'app-right-sidebar',
  imports: [
    News,
    Search,
    FollowRecommendations
  ],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.scss',
})
export class RightSidebar {

}
