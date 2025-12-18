type RoomType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    participants: string[];
};

type MessageType = {
    id: string;
    roomId: string;
    sender: string;
    text: string;
    createdAt: string;
    updatedAt: string;
};
