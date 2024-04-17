import {getMessage} from './ClientReceiver';

export function sendMessage(text){
    if (arguments.length === 1) {
        getMessage(text);
    }
    else if (arguments.length === 2) {
        var msg = arguments[1];
        getMessage(text, msg);
    }
}
