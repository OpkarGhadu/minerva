import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { fetchCommunityDetails } from "@/lib/actions/community.actions";

import Image from "next/image";
import ProfileHeader from "@/components/shared/ProfileHeader";
import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";


// Page gets id from params, which is [id] in navbar
const Page = async ({params}: {params: {id:string}}) => {
    // Get current user
    const user = await currentUser();
    if(!user){ return null;}

    // Get Community Details
    const communityDetails = await fetchCommunityDetails(params.id);
    
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}  
                authUserId={user.id}    // Lets us know if user is looking at their own profile
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />
            {/* Will contain tabs, made using shadcn */}
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                    {/* Loop over tabs, saved in /constants/ */}
                    {communityTabs.map((tab) => (
                        <TabsTrigger  key={tab.label} value={tab.value} className="tab">
                            <Image
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <p className="max-sm:hidden">{tab.label}</p>
                            {/* For Threads tab, user needs # of threads they have*/}
                            {tab.label === 'Threads' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {communityDetails?.threads?.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                        {/* Tab for Threads,members, and requests */}
                        <TabsContent 
                            value={'threads'}
                            className="w-full text-light-1">
                            <ThreadsTab
                                currentUserId={user.id} // Logged in User
                                accountId={communityDetails._id} // User of page we are view
                                accountType="Community"
                            />
                        </TabsContent>
                        
                        <TabsContent 
                            value={'members'}
                            className="w-full text-light-1">
                            <section className="mt-9 flex flex-col gap-10">
                                {communityDetails?.members.map((member:any)=>(
                                    <UserCard
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username} 
                                        imgUrl={member.image} 
                                        personType="User"                                        
                                    />
                                ))}
                            </section>
                        </TabsContent>
                        
                        <TabsContent 
                            value={'requests'}
                            className="w-full text-light-1">
                            <ThreadsTab
                                currentUserId={user.id} // Logged in User
                                accountId={communityDetails._id} // User of page we are view
                                accountType="Community"
                            />
                        </TabsContent>
                </Tabs>
            </div>

        </section>
    )
}

export default Page;