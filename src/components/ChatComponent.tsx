import React, { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const useYoutubeLiveChat = (youtubeUrl: string) => {
  const fn = useRef<null | ((message: MessageEvent<any>) => void)>();

  function unsubscribe() {
    getWebSocket()?.close();
    fn.current = null;
  }

  const subscribe = (callback: (message: MessageEvent<any>) => void) => {
    fn.current = callback;

    return unsubscribe;
  };

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    "ws://localhost:8080"
  );

  useEffect(() => {
    if (lastMessage !== null) {
      if (fn.current) {
        fn.current(lastMessage);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ youtubeUrl }));
    }
  }, [readyState, sendMessage, youtubeUrl, getWebSocket]);

  useEffect(() => {
    return () => {
      if (readyState === ReadyState.OPEN) {
        getWebSocket()?.close();
      }
    };
  }, []);

  return {
    subscribe,
    unsubscribe,
  };
};
export const ChatComponent = ({
  youtubeUsername,
}: {
  youtubeUsername: string;
}) => {
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { subscribe } = useYoutubeLiveChat(
    `https://youtube.com/${youtubeUsername}`
  );

  useEffect(() => {
    const unsubscribe = subscribe((message) => {
      setMessageHistory((prev) => [...prev, message].slice(-20));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full">
        <ul>
          {messageHistory.map((message, idx) => {
            const messageJSON = JSON.parse(message.data as string) as Record<
              string,
              any
            >;

            if (messageJSON.chat === undefined) {
              return null;
            }

            return (
              <MessageComponent
                key={idx}
                msg={messageJSON.chat as unknown as MessageComponentProps}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

type MessageItem = { text: string } | EmojiItem;
interface EmojiItem extends ImageItem {
  emojiText: string;
  isCustomEmoji: boolean;
}
interface ImageItem {
  url: string;
  alt: string;
}

interface MessageComponentProps {
  message: MessageItem[];
  author: MessageAuthor;
  timestamp: string;
}

interface MessageAuthor {
  name: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  channelId: string;
}

const MessageComponent: React.FC<{ msg: MessageComponentProps }> = ({
  msg: { author, message, timestamp },
}) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex gap-1">
      {message.map((messageItem, index) => {
        if ("text" in messageItem) {
          return (
            <span key={index}>
              [{formattedTime}] <strong>{author.name}</strong>:{" "}
              {messageItem.text}
            </span>
          );
        } else if ("url" in messageItem) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={messageItem.url}
              alt={messageItem.alt}
              style={{ width: "24px" }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default MessageComponent;
