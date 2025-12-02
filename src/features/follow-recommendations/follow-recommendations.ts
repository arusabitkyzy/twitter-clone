import { Component } from '@angular/core';
import {NewsItem} from "../../components/news-item/news-item";
import {User} from '../../components/ui/user/user';
import {UserProfile} from '../../models/User';

@Component({
  selector: 'app-follow-recommendations',
    imports: [
        User
    ],
  templateUrl: './follow-recommendations.html',
  styleUrl: './follow-recommendations.scss',
})
export class FollowRecommendations {
  recommendations:UserProfile[] = []
}
