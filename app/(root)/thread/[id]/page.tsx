
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
/* To get params out of the URL
    Destructure it to get params which contains an id of
    type string
*/

export const revalidate = 0;

const Page = async ({params} : {params: {id:string}}) => {
    // We need Thread Details to make the ThreadCard
    // If no id, return null
    if(!params.id) return null;

    // Get User
    const user = await currentUser();
    if(!user) return null;

    // Get user info from our database
    const userInfo = await fetchUser(user.id);
    // We do this to check if userInfo.onboarded is true
    if(!userInfo?.onboarded) redirect('/onboarding');

    // Current Thread
    const thread = await fetchThreadById(params.id);

    return(
        <section className="relative">
            <div>
                {/* TOP LEVEL POST */}
                <ThreadCard
                    key={thread.id}
                    id={thread.id}
                    currentUserId={user?.id || ''}// From Clerk
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            {/* COMMENT ENTRY BOX */}
            <div className="mt-7 ">
                <Comment 
                    threadId={params.id} // So we know which thread we are on
                    currentUserImg={user.imageUrl} // users own image for comment field
                    currentUserId={JSON.stringify(userInfo._id)} // could be obj, so turn into string
                />
            </div>
            {/* LIST OF COMMENTS - MAPPED OUT */}
            <div className="mt-10">
                {thread.children.map( (childItem:any) => (
                    <ThreadCard
                        key={childItem.id}
                        id={childItem.id}
                        currentUserId={user.id}// From Clerk
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment // Boolean, needed to know we can modify
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;