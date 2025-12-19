// tweet.service.ts
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {TweetInfo} from '../../models/Tweet';
import {AuthService} from '../auth-service/auth-service';
import {addDoc, collection, doc, Firestore, getDoc, getDocs, updateDoc, arrayUnion} from '@angular/fire/firestore';
import {forkJoin, from, map, Observable, of, switchMap} from 'rxjs';
import {UserProfile} from '../../models/User';
import {serverTimestamp} from '@angular/fire/firestore';
import {AppStore} from '../auth-service/auth.store';
@Injectable({
  providedIn: 'root'
})
export class TweetServices {
  private auth = inject(AuthService);
  private appStore = inject(AppStore);
  private firestore = inject(Firestore);

  tweets = signal<TweetInfo[]>([]);
  followingTweets = signal<TweetInfo[]>([]);

  // FIX: currentUser should be a computed signal, not UserProfile | null
  currentUser = computed(() => this.appStore.user());

  constructor() {
    effect(() => {
      const user = this.currentUser(); // Call as function to get value
      if (user()) {
        this.loadTweets();
      }
    });
  }

  loadTweets() {
    this.getAllTweets().subscribe(tweets => this.tweets.set(tweets.sort()))
  }

  loadFollowingTweets() {
    this.getFollowingTweets().subscribe(tweets => this.followingTweets.set(tweets.sort()));
  }

  getAllTweets(): Observable<TweetInfo[]> {
    const tweetsRef = collection(this.firestore, 'tweet');

    return from(getDocs(tweetsRef)).pipe(
      switchMap(snapshot =>
        snapshot.empty
          ? of([])
          : forkJoin(
            snapshot.docs.map(async d => {
              const data = d.data() as any;
              let author: UserProfile | null = null;

              if (data.author) {
                const authorSnap = await getDoc(data.author);
                author = authorSnap.exists() ? (authorSnap.data() as UserProfile) : null;
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

  getFollowingTweets(): Observable<TweetInfo[]> {
    const followings = this.currentUser()()?.followings ?? []; // Call as function
    if (followings.length === 0) return of([]);

    const fetches = followings.map(userRef => {
      const userDocRef = doc(this.firestore, `users/${userRef.uid}`);
      return from(getDoc(userDocRef)).pipe(
        switchMap(userSnap => {
          if (!userSnap.exists()) return of([]);

          const user = userSnap.data() as UserProfile;
          const tweetRefs = user.tweets ?? [];

          if (tweetRefs.length === 0) return of([]);

          // FIX: Changed 'tweets' to 'tweet' to match collection name
          return forkJoin(
            tweetRefs.map(tweetRef => {
              const tweetDocRef = doc(this.firestore, `tweet/${tweetRef.uid}`);
              return from(getDoc(tweetDocRef)).pipe(
                map(tweetSnap => {
                  if (!tweetSnap.exists()) return null;
                  return {
                    uid: tweetSnap.id,
                    ...tweetSnap.data(),
                    author: user
                  } as TweetInfo;
                })
              );
            })
          ).pipe(
            map(tweets => tweets.filter((t): t is TweetInfo => t !== null))
          );
        })
      );
    });

    return forkJoin(fetches).pipe(
      map(allTweetArrays => allTweetArrays.flat())
    );
  }

  async addTweet(tweetInfo: TweetInfo) {
    const user = this.currentUser(); // Call as function
    if (!user) return Promise.reject('User not authenticated');

    const userDocRef = doc(this.firestore, `users/${user()?.uid}`);

    return addDoc(collection(this.firestore, 'tweet'), {
      ...tweetInfo,
      comments: [],
      author: userDocRef,
      createdAt: serverTimestamp(),
    }).then(async (docRef) => {
      const authorSnap = await getDoc(userDocRef);
      const author = authorSnap.data() as UserProfile;

      this.tweets.update(prev => [
        {
          ...tweetInfo,
          comments: [],
          uid: docRef.id,
          author,
          createdAt: new Date()
        },
        ...prev
      ]);
    });
  }

  likeTweet(tweetInfo: TweetInfo) {
    const user = this.currentUser(); // Call as function
    if (!user) return;

    const currentUserLikedTweets: string[] = user()?.likedTweets ?? [];
    const tweetDocRef = doc(this.firestore, `tweet/${tweetInfo.uid}`);
    const userDocRef = doc(this.firestore, `users/${user()?.uid}`);

    const isLiked = currentUserLikedTweets.includes(tweetInfo.uid);

    if (isLiked) {
      // Unlike: remove tweet UID
      const updatedLikedTweets = currentUserLikedTweets.filter(uid => uid !== tweetInfo.uid);
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) - 1
        }).then(() => {
          // Update tweet signal
          this.updateTweetInSignal(tweetInfo.uid, { likes: (tweetInfo.likes ?? 0) - 1 });
        });
      });
    } else {
      // Like: add tweet UID
      const updatedLikedTweets = [...currentUserLikedTweets, tweetInfo.uid];
      return updateDoc(userDocRef, {
        likedTweets: updatedLikedTweets
      }).then(() => {
        return updateDoc(tweetDocRef, {
          likes: (tweetInfo.likes ?? 0) + 1
        }).then(() => {
          // Update tweet signal
          this.updateTweetInSignal(tweetInfo.uid, { likes: (tweetInfo.likes ?? 0) + 1 });
        });
      });
    }
  }

  didCurrentUserLikeTweets(tweetInfo: TweetInfo): boolean {
    return this.currentUser()()?.likedTweets?.includes(tweetInfo.uid) ?? false; // Call as function
  }

  saveTweet(tweetInfo: TweetInfo) {
    const user = this.currentUser(); // Call as function
    if (!user) return;

    const currentUserSavedTweets: string[] = user()?.savedTweets ?? [];
    const userDocRef = doc(this.firestore, `users/${user()?.uid}`);
    const isSaved = currentUserSavedTweets.includes(tweetInfo.uid);

    if (isSaved) {
      // Unsave: remove tweet UID
      const updatedSavedTweets = currentUserSavedTweets.filter(uid => uid !== tweetInfo.uid);
      return updateDoc(userDocRef, {
        savedTweets: updatedSavedTweets
      });
    } else {
      // Save: add tweet UID
      const updatedSavedTweets = [...currentUserSavedTweets, tweetInfo.uid];
      return updateDoc(userDocRef, {
        savedTweets: updatedSavedTweets
      });
    }
  }

  didCurrentUserSavedTweet(tweetInfo: TweetInfo): boolean {
    return this.currentUser()()?.savedTweets?.includes(tweetInfo.uid) ?? false; // Call as function
  }

  repostTweet(tweetInfo: TweetInfo) {
    const user = this.currentUser(); // Call as function
    if (!user) return;

    const currentUserRepostedTweets: string[] = user()?.repostedTweets ?? [];
    const userDocRef = doc(this.firestore, `users/${user()?.uid}`);

    const isReposted = currentUserRepostedTweets.includes(tweetInfo.uid);
    if (isReposted) {
      const updatedRepostedTweets = currentUserRepostedTweets.filter(uid => uid !== tweetInfo.uid);
      // FIX: Changed 'savedTweets' to 'repostedTweets'
      return updateDoc(userDocRef, {
        repostedTweets: updatedRepostedTweets
      });
    } else {
      // Repost: add tweet UID
      const updatedRepostedTweets = [...currentUserRepostedTweets, tweetInfo.uid];
      return updateDoc(userDocRef, {
        repostedTweets: updatedRepostedTweets
      });
    }
  }

  getTweetById(tweetId: string): TweetInfo | null {
    const tweet =  this.tweets().find(tweet => tweet.uid === tweetId);
    if(!tweet) return null;
    return tweet;
  }

  didCurrentUserRepostedTweet(tweetInfo: TweetInfo): boolean {
    return this.currentUser()()?.repostedTweets?.includes(tweetInfo.uid) ?? false; // Call as function
  }

  // Helper method to update tweet in signals
  private updateTweetInSignal(tweetUid: string, updates: Partial<TweetInfo>) {
    this.tweets.update(tweets =>
      tweets.map(t => (t.uid === tweetUid ? { ...t, ...updates } : t))
    );

    this.followingTweets.update(tweets =>
      tweets.map(t => (t.uid === tweetUid ? { ...t, ...updates } : t))
    );
  }

  async addComment(tweetId: string, comment: TweetInfo) {
    const userSignal = this.currentUser();
    const user = userSignal?.();
    if (!user) return Promise.reject('User not authenticated');

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const tweetDocRef = doc(this.firestore, `tweet/${tweetId}`);

    // Resolve author first
    const authorSnap = await getDoc(userDocRef);
    const author = authorSnap.data() as UserProfile;

    // Create the comment object
    const newComment = {
      uid: doc(collection(this.firestore, '_')).id, // Generate unique ID
      contentText: comment.contentText,
      contentImage: comment.contentImage || null,
      author: author, // Embed full author object
      createdAt: new Date(),
      likes: 0,
      reposts: 0,
      views: 0,
      comments: [], // Пустой массив для вложенных комментов (если будут)
    };

    console.log(tweetDocRef);
    // Add comment to the tweet's comments array using arrayUnion
    await updateDoc(tweetDocRef, {
      comments: arrayUnion(newComment)
    });

    // Get updated tweet data
    const tweetSnap = await getDoc(tweetDocRef);
    const updatedTweet = tweetSnap.data() as TweetInfo;

    console.log(updatedTweet);
    // Update local signal with the full comments array
    this.updateTweetInSignal(tweetId, {
      comments: updatedTweet.comments
    });

    return newComment;
  }
}
