import { getMessage } from "./ServerReceiver";

export function sendMessage(text) {
  if (arguments.length === 1) {
    getMessage(text);
  } else if (arguments.length === 2) {
    var msg = arguments[1];
    getMessage(text, msg);
  } else if (arguments.length === 3) {
    var msg = arguments[1];
    var msg2 = arguments[2];
    getMessage(text, msg, msg2);
  }
}
