import Lobby from "@/Components/Lobby";
import { getUserData } from "@/lib/actions/user.actions";
import { Suspense } from "react";

const Page = async () => {
    const userData = await getUserData();
    return (
        <Suspense>
            <Lobby username={userData.username} />
        </Suspense>
    );
};

export default Page;
