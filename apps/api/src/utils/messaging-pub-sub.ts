import { Message } from "../database/schema/message";

type Subscriber = (message: Message) => void;

class MessagePubSub {
  private channels: Record<string, Subscriber[]> = {};

  subscribe(chatId: string, subscriber: Subscriber) {
    if (!this.channels[chatId]) {
      this.channels[chatId] = [];
    }

    this.channels[chatId].push(subscriber);

    return () => {
      this.channels[chatId] = this.channels[chatId].filter((s) => s !== subscriber);
    };
  }

  publish(chatId: string, message: Message) {
    if (!this.channels[chatId]) {
      return;
    }

    for (const subscriber of this.channels[chatId]) {
      subscriber(message);
    }
  }
}

export const messaging = new MessagePubSub();
