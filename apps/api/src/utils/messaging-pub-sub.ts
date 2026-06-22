import { Message } from "../database/schema/message";

type Subscriber<T> = (payload: T) => void;

class PubSub<T> {
  private channels: Record<string, Subscriber<T>[]> = {};

  subscribe(channel: string, subscriber: Subscriber<T>) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    this.channels[channel].push(subscriber);

    return () => {
      this.channels[channel] = this.channels[channel].filter(
        (s) => s !== subscriber,
      );
    };
  }

  publish(channel: string, payload: T) {
    if (!this.channels[channel]) {
      return;
    }

    for (const subscriber of this.channels[channel]) {
      subscriber(payload);
    }
  }
}

export type ChatListItem = {
  _id: string;
  name: string;
  lastMessage: { content: string; createdAt: Date } | null;
};

// Per-chat channel: broadcasts new messages to whoever has that chat open.
export const messaging = new PubSub<Message>();

// Per-user channel: notifies a user's chat list (sidebar) about chats they're
// a member of being created or updated, without scanning every message.
export const chatEvents = new PubSub<ChatListItem>();
