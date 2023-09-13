"use client" // <-- lets it know we are client side rendering
import {sidebarLinks} from "@/constants";
import Image from "next/image";
import Link from "next/link";
import {usePathname , useRouter} from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";


function LeftSidebar() {
    // Hooks to determine if current page is active in map
    const router = useRouter();
    const pathname = usePathname();
    const {userId} = useAuth();
    
    return(
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                // Turn map into a returned function so we can 
                // add additional logic above

                // Figure out is link is currently active
                const isActive = (pathname.includes
                    // Check if link.route in pathname and length>1
                    // length>1 means not just home
                    (link.route) && link.route.length > 1) 
                    || pathname === link.route;
                    // Or is pathname the link route

                // Make Profile Link point to right route
                // Get user id from useAuth
                if(link.route === '/profile'){
                    link.route = `${link.route}/${userId}`
                }
                return (
                    <Link
                        href={link.route}
                        key={link.label}
                        className={`leftsidebar_link ${
                            isActive && 'bg-primary-500'}`}
                    >
                    <Image
                        src={link.imgURL}
                        alt={link.label}
                        width={24}
                        height={24}
                    />

                    <p className="text-light-1 max-lg:hidden">
                        {link.label}
                    </p>

                    </Link>
                
                )})}

            </div>
            <div className="mt-10 px-6">
                {/*Only seend by logged in users */}
                <SignedIn>
                        {/*Callback will send user to route of 
                            sign-in when they press sign out
                        */}
                        <SignOutButton signOutCallback={() => 
                            router.push('/sign-in')}>
                            <div className="flex cursor-pointer gap-4 p-4">
                                <Image
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                                <p className="text-light-2 max-lg:hidden">
                                    Logout</p>
                            </div>
                        </SignOutButton>
                </SignedIn>
            </div>

        </section>
    );
}

export default LeftSidebar;