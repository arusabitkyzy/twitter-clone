import { Component, inject, model, input, computed } from '@angular/core';
import { TweetServices } from '../../../services/tweet-service/tweet-services';
import { AppStore } from '../../../services/auth-service/auth.store';
import { TweetInfo } from '../../../models/Tweet';
import { ModalOption, SideModal } from '../../../components/ui/side-modal/side-modal';
import {ModalService} from '../../../services/modal-service/modal-service';

@Component({
  selector: 'app-post-action-modal',
  imports: [SideModal],
  templateUrl: './post-action-modal.html',
  styleUrl: './post-action-modal.scss',
})
export class PostActionModal {
  tweet = input.required<TweetInfo>();

  private tweetService = inject(TweetServices);
  private user = inject(AppStore).user()

  // Use computed to derive modal options
  modalOptions = computed<ModalOption[]>(() => {
    const currentTweet = this.tweet();
    const currentUser = this.user();

    if (currentUser?.uid === currentTweet.author.uid) {
      return this.getOwnerOptions(currentTweet);
    }
    return this.getViewerOptions(currentTweet);
  });

  private getOwnerOptions(tweet: TweetInfo): ModalOption[] {
    return [
      {
        label: 'Delete Post',
        icon: '/assets/icons/delete.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Edit Post',
        icon: '/assets/icons/edit.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Pin to your profile',
        icon: '/assets/icons/pinToProfile.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Highlight on your profile',
        icon: '/assets/icons/highlightOnProfile.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Add/Remove from your Lists',
        icon: '/assets/icons/lists.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Change who can reply',
        icon: '/assets/icons/replySettings.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Embed post',
        icon: '/assets/icons/embedPost.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
    ];
  }

  private getViewerOptions(tweet: TweetInfo): ModalOption[] {
    return [
      {
        label: 'Not interested in this post',
        icon: '/assets/icons/notInterested.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: `Follow @${tweet.author.username}`,
        icon: '/assets/icons/follow.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Add/Remove from your Lists',
        icon: '/assets/icons/lists.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: `Block @${tweet.author.username}`,
        icon: '/assets/icons/block.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: `Mute @${tweet.author.username}`,
        icon: '/assets/icons/mute.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
      {
        label: 'Embed post',
        icon: '/assets/icons/embedPost.svg',
        action: (event: Event) => {
          event.stopPropagation();
        }
      },
    ];
  }
}
