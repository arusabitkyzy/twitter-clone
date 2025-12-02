// tweet.service.ts
import {inject, Injectable, signal} from '@angular/core';
import {TweetInfo} from '../../models/Tweet';
import {AuthService} from '../auth-service/auth-service';
import {addDoc, collection, doc, Firestore, getDoc, getDocs, updateDoc, where} from '@angular/fire/firestore';
import {forkJoin, from, map, Observable, of, switchMap} from 'rxjs';
import {UserProfile} from '../../models/User';
import { serverTimestamp } from '@angular/fire/firestore';
import {query} from '@angular/fire/database';
import firebase from 'firebase/compat/app';
import CollectionReference = firebase.firestore.CollectionReference;
import {DocumentData} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TweetServices {
  private auth = inject(AuthService);
  private firestore = inject(Firestore);
  tweets = signal<TweetInfo[]>([]);
  followingTweets = signal<TweetInfo[]>([]);
  currentUser: UserProfile|null = null

  constructor() {
    this.loadTweets()
    this.currentUser = this.auth.getUser()
  }

  loadTweets() {
    this.getAllTweets().subscribe(tweets => this.tweets.set(tweets));
    this.getFollowingTweets().subscribe(tweets => this.followingTweets.set(tweets))
  }

  getAllTweets() {
    const tweetsRef = collection(this.firestore, 'tweet');

    return from(getDocs(tweetsRef)).pipe(
      switchMap(snapshot =>
        forkJoin(
          snapshot.docs.map(async d => {
            const data = d.data() as any;

            let author: UserProfile | null = null;

            if (data.author) {
              const authorSnap = await getDoc(data.author);
              author = authorSnap.exists() ? authorSnap.data() as UserProfile : null;
            }

            return {
              uid: d.id,
              ...data,
              author
            } as TweetInfo;
          })
        )
      )
    );
  }


  getFollowingTweets() {
    const followings = this.currentUser?.followings ?? [];
    if (followings.length === 0) return of([]);

    // Convert user doc refs into observable tweet fetches
    const fetches = followings.map(userRef => {
      const userDocRef = doc(this.firestore, `users/${userRef.uid}`);
      return from(getDoc(userDocRef)).pipe(  // ← Added 'return' here
        switchMap(userSnap => {
          const user = userSnap.data() as UserProfile;
          const tweetRefs = user.tweets ?? [];

          // Fetch all tweet docs for this user
          return forkJoin(
            tweetRefs.map(tweetRef => {
              const tweetDocRef = doc(this.firestore, `tweets/${tweetRef.uid}`);
              return from(getDoc(tweetDocRef)).pipe(  // ← Added 'return' here
                map(tweetSnap => ({
                  uid: tweetSnap.id,
                  ...tweetSnap.data()
                } as TweetInfo))  // ← Added 'as TweetInfo' cast
              );
            })
          );
        })
      );
    });

    return forkJoin(fetches).pipe(
      map(allTweetArrays => allTweetArrays.flat())
    );
  }


  addTweet(tweetInfo: TweetInfo) {
    const userDocRef = doc(this.firestore, `users/${this.currentUser?.uid}`);

    return addDoc(collection(this.firestore, 'tweet'), {
      ...tweetInfo,
      author: userDocRef,
      createdAt: serverTimestamp(),
    }).then(async (docRef) => {
      // resolve author for the newly added tweet
      const authorSnap = await getDoc(userDocRef);
      const author = authorSnap.data() as UserProfile;

      // append new tweet to signal
      this.tweets.update(prev => [
        {
          ...tweetInfo,
          uid: docRef.id,
          author,
          createdAt: new Date()
        },
        ...prev
      ]);
    });
  }

  likeTweet(tweetInfo: TweetInfo) {
    if (!this.currentUser) return;

    const currentUserLikedTweets = this.currentUser.likedTweets ?? [];
    const tweetDocRef = doc(this.firestore, `tweet/${tweetInfo.uid}`);
    const userDocRef = doc(this.firestore, `users/${this.currentUser.uid}`);

    // Check if tweet is already liked by comparing UIDs
    const isLiked = currentUserLikedTweets.some(tweet => tweet.uid === tweetInfo.uid);

    if (isLiked) {
      // Unlike: remove from the currentUserLikedTweets list
      const updatedLikedTweets = currentUserLikedTweets.filter(tweet => tweet.uid !== tweetInfo.uid);

      // Update Firestore
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        // Update local state
        if (this.currentUser) {
          this.currentUser.likedTweets = updatedLikedTweets;
        }

        // Decrement like count on tweet
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) - 1
        });
      });
    } else {
      // Like: add tweetInfo to currentUserLikedTweets
      const updatedLikedTweets = [...currentUserLikedTweets, tweetInfo];

      // Update Firestore
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        // Update local state
        if (this.currentUser) {
          this.currentUser.likedTweets = updatedLikedTweets;
        }

        // Increment like count on tweet
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) + 1
        });
      });
    }
  }

  didCurrentUserLikeTweets(tweetInfo: TweetInfo) {
    const tweet = this.currentUser?.likedTweets.filter((tweet) => tweet.uid === tweetInfo.uid)

    // @ts-ignore
    return tweet?.length > 0
  }

  // // Add a single tweet
  // addTweet(tweet: TweetInfo) {
  //   const currentTweets = this.tweetsSubject.value;
  //   this.tweetsSubject.next([tweet, ...currentTweets]);
  // }
  //
  // // Manually load tweets
  // loadTweets(tweets: TweetInfo[]) {
  //   this.tweetsSubject.next(tweets);
  // }
  //
  // // Delete a tweet
  // deleteTweet(usedId: string, tweetId: string) {
  //   const currentTweets = this.tweetsSubject.value;
  //   this.tweetsSubject.next(currentTweets.filter(t => t.uid !== id));
  // }
}
