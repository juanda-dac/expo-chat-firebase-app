import { Timestamp } from "firebase/firestore";

export type MessageStatus = 'sent' | 'received' | 'read';

export interface MessageModel {
    id?: string;
    chatId:string;
    sender: string;
    receiver: string;
    text: string;
    status: MessageStatus;
    date?: Timestamp;
}