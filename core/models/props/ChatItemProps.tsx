import { MessageModel } from "../MessageModel";
import { ChatModel } from "../ChatModel";
import { UserModel } from "../UserModel";

export interface ChatItemProps {
    chat: ChatModel;
    userChat: UserModel;
    currentUser: UserModel;
}