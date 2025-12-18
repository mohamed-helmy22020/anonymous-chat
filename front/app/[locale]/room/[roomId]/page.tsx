import RoomPage from "@/Components/RoomPage";
import { getRoomMessages, getUserData } from "@/lib/actions/user.actions";
import { permanentRedirect } from "next/navigation";
const errors = ["room-not-found", "room-full"];
const Page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
    const roomId = (await params).roomId;
    const [userData, roomDataRes] = await Promise.all([
        getUserData(),
        getRoomMessages(roomId),
    ]);

    if (!userData.username) {
        permanentRedirect(`/?redirect=/room/${roomId}`);
    }
    if (!roomDataRes.success) {
        console.log(roomDataRes);
        if (errors.includes(roomDataRes.msg)) {
            permanentRedirect(`/?error=${roomDataRes.msg}`);
        } else {
            permanentRedirect(`/?error=unknown-error`);
        }
    }
    const { room, messages } = roomDataRes;
    return <RoomPage userData={userData} room={room} messages={messages} />;
};

export default Page;
