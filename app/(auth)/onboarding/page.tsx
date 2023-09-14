/* 
    Onboarding Page
    To collect additional information on the users
    after they have signed up
*/
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation'


async function Page() {
    // First make sure user logged in
    const user = await currentUser();
    if(!user){
        return null;
    }

    /* Get user info from the Database 
        if they have already been onboarded,
        send to home page
        User.id comes from Clerk
        userInfo comes from Mongo
    */
    const userInfo = await fetchUser(user.id);
    if(userInfo?.onboarded){
        redirect('/');
    }

    /* before we pass user to Profile
     we want to create userData object
      userData needs id of user
      and object id, which we get
      from the db so we can attach stuff to them
        NOTE - QUESTION MARK CHECKS IF EXISTS
        NOTE - _id is the 
    */
    const userData = {
        id: user?.id, // ID from clerk
        objectId: userInfo?._id, // _id is the unique ObjectId in Mongo
        username: userInfo ? userInfo?.username : user?.username,
        name: userInfo ? userInfo?.name : user?.firstName || "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user?.imageUrl,
    }
       

    return (
        <main className="mx-auto flex max-w-3x1 flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads.
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                {/* The AccountProfile will later be used if
                    the user wants to edit their bio. Therefore,
                    we send btnTitle to specify interaction
                */}
                tProfile
                    user={userData}
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}

export default Page;