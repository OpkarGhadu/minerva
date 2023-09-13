"use client"
// For the Shadcn Form
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import * as z from "zod"
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

// define props as interface
// we need to specify type of prop input
interface Props {
    user : {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    };
    btnTitle: string;
}

// AccountProfile will take props of user and btnTitle
const AccountProfile = ({user, btnTitle}: Props) => {
    // For profile pic, we will have file and ability to
    //  set file. Type of useState will be array of files
    const [files, setFiles] = useState<File[]>([]);
    
    // Define Upload thing hook
    const {startUpload } = useUploadThing("media");

    const router = useRouter();
    const pathname = usePathname();


    /* Data for the Form
        Form will user zod to resolve values
        and defaultValues
          Check if user has values already,
          otherwise give is empty string
    */  
    const form = useForm({
        resolver:zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
        }
    })

    // Will update the profile picture when new one uploaded
    // This is how react hookform works
    //      we immediatly get the value here
    const handleImage = (event: ChangeEvent<HTMLInputElement>, fieldChange: (value:string) => void) => {
        // Prevent page from refreshing when form submitted
        event.preventDefault();
        
        // Initialize a file Reader which will read file
        const fileReader = new FileReader();

        // Need to check if null before getting length
        // Checks if file actually exists
        if(event.target.files && event.target.files.length > 0){
            // Get file
            const file = event.target.files[0];
            // set to state
            setFiles(Array.from(event.target.files));
            // If not image type, return
            if(!file.type.includes('image')) return;
            // Get url of target, turn to string
            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                fieldChange (imageDataUrl);
            }
            // read image into file
            fileReader.readAsDataURL(file);
        }
    }
    
    // type is UserValidation because we will submit whatever
    //  is within that object
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        // Will submit values to database
        // We can start by getting our photo
        const blob = values.profile_photo;
        // But we do not know if image has changed, so check
        //  if is base64 image. If image is already there
        //  we dont need to run
        const hasImageChanged = isBase64Image(blob);

        // If image has changed, we need to upload it using
        //  package called upload thing
        if(hasImageChanged){
          const imgRes = await startUpload(files);
          // If image response exists and fileUrl exists
          // we can updata values
          if(imgRes && imgRes[0].url){
            values.profile_photo = imgRes[0].url;
          }
          
        }

        // HERE UPDATE USER PROFILE
        // update
        // NOTE - we have to make sure order is correct for 
        //  function params, but it is better to make into object
        //  and send it all together
        await updateUser({
          userId: user.id,
          username: values.username,
          name: values. name,
          bio: values.bio,
          image: values.profile_photo,
          path: pathname,
        });

        // Now redirect depending on if user was
        // editing profile or creating account
        if(pathname === '/profile/edit'){
          // Previous page
          router.back();
        }
        else {
          // will send to '/' - root page
          router.push('/')
        }
    }

    return(
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                    {/*If we have a profile to show*/}
                    {field.value? (
                        <Image
                            src={field.value}
                            alt="profile photo"
                            width={96}
                            height={96}
                            priority
                            className="rounded-full object-contain"
                        />
                    ) : (
                        <Image
                            src="/assets/profile.svg"
                            alt="profile photo"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    )}
                </FormLabel>
                <FormControl className="flex-1 text-base-semibold text-gray-200">
                  <Input 
                    type="file"
                    // accept any image type file
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    // When image field changes, call handleImage
                    onChange={(event) => handleImage(event, field.onChange)} 
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 ">
                    {/*Name field*/}
                    Name
                </FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    className="account-form_input no-focus"
                    // We do not need onChange because we can
                    // simply spread the field
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 ">
                    {/*Name field*/}
                    Username
                </FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    className="account-form_input no-focus"
                    // We do not need onChange because we can
                    // simply spread the field
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2 ">
                    {/*Name field*/}
                    Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className="account-form_input no-focus"
                    // We do not need onChange because we can
                    // simply spread the field
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        
        <Button 
            type="submit"
            className="bg-primary-500"
            >
            {btnTitle}
        </Button>
        </form>
        </Form>
    )
}

export default AccountProfile;