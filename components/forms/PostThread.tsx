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

 
import { Button } from "../ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import * as z from "zod"
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { QuizValidation, ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { Input } from "../ui/input";


import { useState } from "react";

import { sendMessageToChatGPT } from "@/lib/actions/quiz.actions";
import QuizCard from "../cards/QuizCard";
 
// define props as interface
// we need to specify type of prop input
interface Props {
    userId: string;
}

function PostThread({userId} : Props){
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  // Zod will assess the Thread form using the 
  //  Thread Validation guidelines we set up
  const form = useForm<z.infer<typeof QuizValidation>>({
    resolver:zodResolver(QuizValidation),
    defaultValues: {
        thread: '',
        accountId: userId,
    }
  });
  
  
  // Items are the Questions that are in the DB
  // Ans are the Answers to these questions
  const [items, setItems] = useState<string[]>([]);
  const [ans , setAns] = useState<string[]>([]);
  // New Item is the Question String
  const [newItem, setNewItem] = useState<string>('');

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      // Make GPT Call
      console.log("Ask GPT:", newItem);
      const res = await sendMessageToChatGPT(newItem);
      // Format string so that each response is on a new line
      const formattedRes = `${res ? res[0] : ""}\n${res ? res[1] : ""}\n${res ? res[2] : ""}\n${res ? res[3] : ""}`

      // Confirmation box on if the questions and answers should be added to db
      if(confirm(`Would you like this question in the Quiz?\n${newItem}\n${formattedRes}`)){
        console.log("ADD TO DB");
        setItems([...items, newItem]);
        setAns([...ans, res ? formattedRes : ""]);
        setNewItem('');
      }
      else { // Question not needed
        console.log("Discard");
        setNewItem('');
      }

    }
  };

  /* Quiz Interfaces 
      Quiz Item is Top Level
      Quiz Option stores text and bool
  */   
  interface QuizItem {
    question: string;
    options: QuizOption[];
  }

  interface QuizOption {
    text: string;
    isCorrect: boolean;
  }

  // Fix Quiz to be added to DB
  const formatQuiz = (items:string[],ans:string[]): QuizItem[] => {
    if (items.length !== ans.length) {
      throw new Error('Number of questions and answers should match');
    }

    // Create quiz, which is array of QuizItems. Initially empty []
    const quiz: QuizItem[] = [];
    // Iterate through items and turn into quizItems

    for(let i = 0; i < items.length; i++){
      const question = items[i];
      // Create Array of answer choices
      const answerChoices = ans[i].split('\n')
        .map((choice) => choice.trim())
    
      const options: QuizOption[] = [];

      answerChoices.forEach((choice) => {
        // Will match REGEX of Question, period, true/false
        const match = choice.match(/([A-Z])\) (.+)\. (True|False)/);
        if (match){
          // Deconstruct match
          // Skip first two, Letter 'A' and ')'
          const [, , text, isCorrect] = match;
          options.push({
            text,
            isCorrect: isCorrect === 'True'
          });
        }
      });
      quiz.push({
        question,
        options
      })
    }

    return quiz;
  }

  // Submit Quiz to Database
  const onSubmit = async (values: z.infer<typeof QuizValidation>) =>{
    // Format Quiz
    const formattedQuiz = formatQuiz(items , ans);

    // Create Thread
    console.log("SUBMIT");
    await createThread({
      text: values.thread,
      author: userId,     // PostThread created w/ userId
      communityId: organization ? organization.id : null,// if in org, give id, else null
      quiz: formattedQuiz,
      path: pathname,
    });

    router.push('/');
  }

  return(
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-10 flex flex-col justify-start gap-10"
    >
      {/*QUIZ NAME */}
      <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
            <FormLabel className="text-base-semibold text-light-2 ">
              {/*Name field*/}
              Quiz Name
            </FormLabel>
            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
              <Input 
                required
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

      {/* RENDER QUESTIONS */}
      {items.map((item,index)=> (
        <QuizCard
          key={item}
          question={item}
          answer={ans[index]}
          index={index}
        />
      ))}

      {/* FIELD TO ADD NEW QUESTIONS*/}
      <div className="focus flex flex-row">
        <Textarea
          rows={5}
          placeholder="Let Chat-GPT create a quiz by asking a question like: 'What is the capital of Belgium?'"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button 
            type="button"
            className="bg-primary-500 ml-5 p-6 py-8"
            onClick={handleAddItem}
            >
            Ask Question
        </Button>
      </div>

     


      {/* Button to Submit Quiz*/}
      <Button 
            type="submit"
            className="bg-primary-500 mt-10"
            >
            Create Quiz
      </Button>

    </form>
    </Form>
  )
}

export default PostThread;
