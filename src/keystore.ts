import { createClient } from "redis";
import { ISocketMessage, ISocketSub, INotification } from "./types";
import config from "./config";

const redisClient = createClient({
  url: config.redis.url,
});

export const init = async () => {
  console.log(`connecting to redis: ${config.redis.url}`);
  return redisClient.connect();
};

const subs: ISocketSub[] = [];

export const setSub = (subscriber: ISocketSub) => subs.push(subscriber);
export const getSub = (topic: string) =>
  subs.filter(
    (subscriber) =>
      subscriber.topic === topic && subscriber.socket.readyState === 1
  );

export const setPub = (socketMessage: ISocketMessage) =>
  redisClient.lPush(
    `socketMessage:${socketMessage.topic}`,
    JSON.stringify(socketMessage)
  );

export const getPub = (topic: string) =>
  redisClient.lRange(`socketMessage:${topic}`, 0, -1).then((data: any) => {
    if (data) {
      let localData: ISocketMessage[] = data.map((item: string) =>
        JSON.parse(item)
      );
      redisClient.del(`socketMessage:${topic}`);
      return localData;
    }
  });

export const setNotification = (notification: INotification) =>
  redisClient.lPush(
    `notification:${notification.topic}`,
    JSON.stringify(notification)
  );

export const getNotification = (topic: string) =>
  redisClient.lRange(`notification:${topic}`, 0, -1).then((data: any) => {
    if (data) {
      return data.map((item: string) => JSON.parse(item));
    }
  });
