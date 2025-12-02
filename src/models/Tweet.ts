import {UserProfile} from './User';
import firebase from 'firebase/compat/app';

export interface TweetInfo {
  uid: string,
  author: UserProfile,
  contentText: string,
  contentImage?: string,
  createdAt: Date,
  comments: number,
  likes: number,
  reposts: number,
  views: number,
  replyAllowed: boolean,
}
