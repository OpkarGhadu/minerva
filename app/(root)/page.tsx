import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
// New
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import Pagination from "@/components/shared/Pagination";


// Homepage
async function Home({
  searchParams
}: {searchParams : {
    [key: string]: string | undefined };
  }) {
    // Make sure user is logged in and get info
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    /* Get 30 pages or by search Params
        On homepage (page 1), searchParams are undefined
        afterwards, they are equal to page number
        '+' sign converts string to int
        searchParams - { page: '2' }
          -> page comes from URL because pagination adds 
              ?page=  to the url
    */
    //console.log("SEARCHPARAMS", searchParams);
    const result = await fetchPosts(
      searchParams.page ? +searchParams.page : 1,
      30
    );


  return (
    <> 
      <h1 className="head-text text-left">Hello</h1>
      <section className="mt-9 flex flex-col gap-10">
        {/*If no post, render empty p tag
            if we do have posts, render fragment with posts mapped
        */}
        {result.posts.length === 0 ? (
            <p className="no-result">No Threads found.</p>
          ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post.id}
                id={post.id}
                currentUserId={user?.id || ''}// From Clerk
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ) )}
          </>
          )
        }
      </section>

      {/* To scroll to another page 
          go to home '/'
          pageNumber is 1 or the pageNumber if there are searchparams
          isNext is if it is possible to get more pages
      */}
      <Pagination 
        path="/"
        pageNumber={ searchParams?.page ? +searchParams.page : 1} 
        isNext={result.isNext} 
      />
    </>
  )
}

export default Home;