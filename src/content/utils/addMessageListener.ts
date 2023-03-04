import { b } from "../../common/misc";
import { BackgroundMessage, MessageSender } from "../../types/messages";

export default function addMessageListener<K extends keyof BackgroundMessage>(
  type: K,
  callback: (
    message: BackgroundMessage[K]["message"],
    sender: MessageSender,
    sendResponse: (response: BackgroundMessage[K]["response"]) => void
  ) => void
) {
  b.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type !== type) return;
    callback(message, sender, sendResponse);
    return true;
  });
}
