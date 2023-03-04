import { b } from "../../common/misc";
import { ContentMessage } from "../../types/messages";

export default function <K extends keyof ContentMessage>(
  message: ContentMessage[K]["message"] & { type: K }
): Promise<ContentMessage[K]["response"]> {
  return b.runtime.sendMessage(message);
}
