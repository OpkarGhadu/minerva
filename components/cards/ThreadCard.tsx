import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
// New
import DeleteThread from "../forms/DeleteThread";
import { Button } from "../ui/button";

interface Props {
    id : string,
    currentUserId: string,
    parentId: string | null ,
    content: string,
    author: {
        name : string,
        image: string,
        id: string,
    }
    community: {
        id: string,
        name: string,
        image: string,
    } | null,
    createdAt: string,
    comments: {
        author: {
            image: string,
        }
    }[]       // array sign indicated multiple comments
    isComment?: boolean; // Not required
}

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
    } : Props) => {

    return(
        <article // Dynamic classname for article
            className={
                `flex w-full flex-col rounded-xl 
                ${isComment // If is comment, do first line
                    ? 'px-0 xs:px-7' // else, second
                    : 'bg-dark-2 p-7 '}`}>  
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link
                            // Dynamic Link to Profile Page
                            href={`/profile/${author.id}`}
                            className="relative h-11 w-11" 
                        >
                            <Image
                                // Image of Post Author
                                src={author.image}
                                alt="Profile Image"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar"/>
                    </div>
                    {/* For User Name */}
                    <div className="flex w-full flex-col">
                        <Link
                            // Dynamic Link to Profile Page
                            href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">
                                {author.name}
                            </h4>
                        </Link>
                    
                        <p className={isComment ? 'mt-2 text-small-regular text-light-2'
                                    : 'head-text mt-2 text-light-2' }>
                            {content}   
                        </p>
                    
                        {/* This div will hold icons to heart, reply, repost, share thread */}
                        {/* needs extra margin because isComment, done dynamically , if isComment, add mb-10*/}
                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">

                                <Link href={`/thread/${id}`}>
                                    <Image
                                        src='/assets/reply.svg' alt='reply'
                                        width={24} height={24} className="cursor-pointer object-contain"
                                    />
                                </Link>
                                <Image
                                    src='/assets/share.svg' alt='share'
                                    width={24} height={24} className="cursor-pointer object-contain"
                                />
                            </div>
                            {/* Determine if Thread is a comment 
                                If it is, show Link to thread details page
                            */}
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                </Link>
                            )}


                        </div>
                    </div>
                    { !isComment &&
                    <div className="mr-10">
                        <Link href={`/quiz/${id}`}>
                            <Button
                                className="bg-primary-500 p-8"
                            >
                                Take Quiz
                            </Button>
                        </Link>
                    </div>}
                </div>
                {/* Add Function to Delete Thread and show # replies*/}
                <DeleteThread
                    threadId={JSON.stringify(id)}
                    currentUserId={currentUserId}
                    authorId={author.id}
                    parentId={parentId}
                    isComment={isComment}
                />
            </div>
            {/*If not comment and has comments, show author img and link to commment */}
            {!isComment && comments.length > 0 && (
                <div className='ml-1 mt-3 flex items-center gap-2'>
                {comments.slice(0, 2).map((comment, index) => (
                    <Image
                    key={index}
                    src={comment.author.image}
                    alt={`user_${index}`}
                    width={24}
                    height={24}
                    className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
                    />
                ))}

                <Link href={`/thread/${id}`}>
                    <p className='mt-1 text-subtle-medium text-gray-1'>
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                    </p>
                </Link>
                </div>
            )}                
            
            {/* If not a Comment and we are in a community 
                create a link going to the community
            */}
            {!isComment && community && (
                <Link 
                    href={`/communities/${community.id}`}
                    className="mt-5 flex items-center"
                >
                    <p className="text-subtle-medium text-gray-1">
                        {formatDateString(createdAt)}
                        {" "}- {community.name} Community
                    </p>
                    <Image
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        className="ml-1 rounded-full object-cover"
                    />
                </Link>
               )}
        </article>
    )
}

export default ThreadCard;