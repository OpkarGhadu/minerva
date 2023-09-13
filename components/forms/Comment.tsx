"use client"
 
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form"

 
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {zodResolver} from '@hookform/resolvers/zod';
import { usePathname } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
//import { updateUser } from "@/lib/actions/user.actions";
//import { createThread } from "@/lib/actions/thread.actions";

interface Props {
    threadId : string,
    currentUserImg: string,
    currentUserId: string,
}

const Comment = ({threadId, currentUserImg, currentUserId} : Props) => {
  
    const pathname = usePathname();

    // Zod will assess the Comment form using the 
    // Comment Validation guidelines we set up
    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver:zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        // Calls a backend action addCommentToThread
        // will take form data and make new comment
        await addCommentToThread(
            threadId , values.thread , JSON.parse(currentUserId) , pathname
        );
        form.reset();
    }


    return(
        <Form {...form}>
        {/*Tells Form what to do onSubmit */}
        <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
        >
          <FormField
            control={form.control}
            name="thread"   // We are still creating a new thread as the comment
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-3">
                <FormLabel>
                    {/*Profile Image*/}
                    <Image
                        src={currentUserImg} alt="Profile Image"
                        width={48} height={48}
                        className="rounded-full object-cover"
                    />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                    // We do not need onChange because we can
                    // simply spread the field
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button 
            type="submit"
            className="comment-form_btn"
            >
            Reply
          </Button>
        
        </form>
        </Form>
    )
}

export default Comment;