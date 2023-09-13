import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
    // Get current user
    const user = await currentUser();
    // If user not logged in
    if(!user){
        return null;
    }
    // If we do have a user, get their info
    const userInfo = await fetchUser(user.id);
    // If user has not onboarded, send them to /onboarding
    if(!userInfo?.onboarded) redirect ('/onboarding');

    return(
        <>
        <h1 className="head-text">Create a Quiz</h1>

        {/*Component to Post Thread ? To String Error*/}
        <PostThread userId={userInfo._id.toString()}/>
        </>
    )
}

export default Page;