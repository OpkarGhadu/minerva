import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Result {
    name: string;
    image: string;
    id: string;
    threads: {
      _id: string;
      text: string;
      parentId: string | null;
      author: {
        name: string;
        image: string;
        id: string;
      };
      community: {
        id: string;
        name: string;
        image: string;
      } | null;
      createdAt: string;
      children: {
        author: {
          image: string;
        };
      }[];
    }[];
  }

// To render tabs on profile page
interface Props {
    currentUserId : string;
    accountId : string;
    accountType: string;
}

// Will fetch specific posts for user or community
const ThreadsTab = async ({currentUserId, accountId, accountType}: Props) => {
    let result: Result;
    // Check if Users or Community Posts
    if(accountType === 'Community'){
        result = await fetchCommunityPosts(accountId);
    }
    else {
        // Fetch Profile Threads
        result = await fetchUserPosts(accountId);
    }

    if(!result){
        redirect('/')
    }
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={accountType === 'User' // If account is user, return result info from db
                        ? {name: result.name, image: result.image, id: result.id}
                        : { // If not user, get this info from the thread
                            name: thread.author.name,
                            image: thread.author.image,
                            id: thread.author.id}
                    }  // if account is a community, give name id and image, else give threads community
                    community={
                        accountType === 'Community'
                        ? {name : result.name, id: result.id, image: result.image}
                        : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab;