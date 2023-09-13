"use client"
import { sidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function Bottombar() {
    const pathname = usePathname();
    
    return(
        <section className="bottombar">
            <div className="bottombar_container">
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
                return (
                    <Link
                        href={link.route}
                        key={link.label}
                        className={`bottombar_link ${
                            isActive && 'bg-primary-500'}`}
                    >
                    <Image
                        src={link.imgURL}
                        alt={link.label}
                        width={24}
                        height={24}
                    />
                    {/* Text hidden on small devices, only
                        seen on tablets
                    */}
                    <p className="text-subtle-medium text-light-1 max-sm:hidden">
                        {/* Ternary Exp to only get first word*/}
                        {link.label.split(/\s+/)[0]}
                    </p>

                    </Link>
                
                )})}
            </div>
        </section>
    );
}

export default Bottombar;