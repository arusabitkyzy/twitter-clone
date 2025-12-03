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

    const currentUserLikedTweets: string[] = this.currentUser.likedTweets ?? [];
    const tweetDocRef = doc(this.firestore, `tweet/${tweetInfo.uid}`);
    const userDocRef = doc(this.firestore, `users/${this.currentUser.uid}`);

    const isLiked = currentUserLikedTweets.includes(tweetInfo.uid);

    if (isLiked) {
      // Unlike: remove tweet UID
      const updatedLikedTweets = currentUserLikedTweets.filter(uid => uid !== tweetInfo.uid);
      console.log(updatedLikedTweets);
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.likedTweets = updatedLikedTweets;
        }
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) - 1
        });
      });
    } else {
      // Like: add tweet UID
      const updatedLikedTweets = [...currentUserLikedTweets, tweetInfo.uid];
      console.log(updatedLikedTweets);
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.likedTweets = updatedLikedTweets;
        }
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) + 1
        });
      });
    }
  }

  didCurrentUserLikeTweets(tweetInfo: TweetInfo): boolean {
    return this.currentUser?.likedTweets?.includes(tweetInfo.uid) ?? false;
  }

  saveTweet(tweetInfo: TweetInfo) {
    if (!this.currentUser) return;

    const currentUserSavedTweets: string[] = this.currentUser.savedTweets ?? [];
    const userDocRef = doc(this.firestore, `users/${this.currentUser.uid}`);
    const isSaved = currentUserSavedTweets.includes(tweetInfo.uid);

    if (isSaved) {
      // Unsave: remove tweet UID
      const updatedSavedTweets = currentUserSavedTweets.filter(uid => uid !== tweetInfo.uid);
      return updateDoc(userDocRef, {
        savedTweets: updatedSavedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.savedTweets = updatedSavedTweets;
        }
      });
    }
    else {
      // Save: add tweet UID
      const updatedSavedTweets = [...currentUserSavedTweets, tweetInfo.uid];
      return updateDoc(userDocRef, {
        savedTweets: updatedSavedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.savedTweets = updatedSavedTweets;
        }
      });
    }
  }

  didCurrentUserSavedTweet(tweetInfo: TweetInfo): boolean {
    return this.currentUser?.savedTweets?.includes(tweetInfo.uid) ?? false;
  }

  repostTweet(tweetInfo: TweetInfo) {
    if (!this.currentUser) return;

    const currentUserRepostedTweets: string[] = this.currentUser.repostedTweets ?? [];
    const userDocRef = doc(this.firestore, `users/${this.currentUser.uid}`);

    const isReposted = currentUserRepostedTweets.includes(tweetInfo.uid);
    if (isReposted) {
      const updatedRepostedTweets = currentUserRepostedTweets.filter(uid => uid !== tweetInfo.uid);
      return updateDoc(userDocRef, {
        savedTweets: updatedRepostedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.repostedTweets = updatedRepostedTweets;
        }
      });
    }
    else {
      // Save: add tweet UID
      const updatedRepostedTweets = [...currentUserRepostedTweets, tweetInfo.uid];
      return updateDoc(userDocRef, {
        repostedTweets: updatedRepostedTweets
      }).then(() => {
        if (this.currentUser) {
          this.currentUser.repostedTweets = updatedRepostedTweets;
        }
      });
    }
  }

  didCurrentUserRepostedTweet(tweetInfo: TweetInfo): boolean {
    return this.currentUser?.repostedTweets?.includes(tweetInfo.uid) ?? false;
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
