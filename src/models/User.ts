import {TweetInfo} from './Tweet';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;

export interface UserProfileCreation {
  uid: string;
  email: string;
  name: string;
  birthday: Date;
  createdAt: FieldValue;
}
export interface UserProfile extends UserProfileCreation {
  isVerified?: boolean;
  bio?: string;
  avatar?: string;
  tweets: TweetInfo[];
  followers: UserProfile[];
  followings: UserProfile[];
  backgroundImage?: string;
  location?: string[];
  website?: string;
  savedTweets: TweetInfo[];
  repliedTweets: TweetInfo[];
  repostedTweets: TweetInfo[];
  likedTweets: TweetInfo[];
  username: string;
}
