export function getChatRoomId(userIdOne:string, userIdTwo:string ):string{
    const roomIdSorted = [userIdOne, userIdTwo].sort().join('-');
    return roomIdSorted;
}