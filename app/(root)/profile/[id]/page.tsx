import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";


// Page gets id from params, which is [id] in navbar
const Page = async ({params}: {params: {id:string}}) => {
    // Get current user
    const user = await currentUser();
    // If user not logged in
    if(!user){ return null;}
    // Get Info of the user whose PAGE WE ARE ON
    //  that is why we page user id in nav bar
    const userInfo = await fetchUser(params.id);
    
    
    // If user has not onboarded, send them to /onboarding
    if(!userInfo?.onboarded) redirect ('/onboarding');

    
    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id} // Id of User we are looking at
                authUserId={user.id}    // Lets us know if user is looking at their own profile
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />
            {/* Will contain tabs, made using shadcn */}
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                    {/* Loop over tabs, saved in /constants/ */}
                    {profileTabs.map((tab) => (
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
                                    {userInfo?.threads?.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent 
                            key={`content-${tab.label}`} //dynamic key
                            value={tab.value}
                            className="w-full text-light-1"
                        >
                            <ThreadsTab
                                currentUserId={user.id} // Logged in User
                                accountId={userInfo.id} // User of page we are view
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

        </section>
    )
}

export default Page;