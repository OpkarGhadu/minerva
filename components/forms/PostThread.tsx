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
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import * as z from "zod"
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { Input } from "../ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useState } from "react";

import { sendMessageToChatGPT } from "@/lib/actions/quiz.actions";
import QuizCard from "../cards/QuizCard";
 
// define props as interface
// we need to specify type of prop input
interface Props {
    userId: string;
}

function PostThread({userId} : Props){
  // Items are the Questions that are in the DB
  // Ans are the Answers to these questions
  const [items, setItems] = useState<string[]>([]);
  const [ans , setAns] = useState<string[]>([]);
  // New Item is the Question String
  const [newItem, setNewItem] = useState<string>('');

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      // MAKE GPT CALL HERE
      console.log("Ask GPT:", newItem);
      const res = await sendMessageToChatGPT(newItem);
      // SHOW USER RESULT, IF YES Format and add to db
      const formattedRes = `${res ? res[0] : ""}\n${res ? res[1] : ""}\n${res ? res[2] : ""}\n${res ? res[3] : ""}`
      if(confirm(`Would you like this question in the Quiz?\n${newItem}\n${formattedRes}`)){
        console.log("ADD TO DB");
        setItems([...items, newItem]);
        setAns([...ans, res ? formattedRes : ""]);
        setNewItem('');
      }
      else {
        console.log("Discard");
        setNewItem('');
      }

    }
  };

  return(
    <div>
      {items.map((item,index)=> (
        <QuizCard
          key={item}
          question={item}
          answer={ans[index]}
          index={index}
        />
        
      ))}

      <div>
        <input
          type="text"
          placeholder="Enter a new item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={handleAddItem}>Add</button>
      </div>
    </div>
  )
}

export default PostThread;

/* 
import React, { useState } from 'react';
import { Form } from 'shadcn';

// Child component that receives the 'name' prop
function DisplayUserName({ name }) {
  return <div>Username: {name}</div>;
}

// Parent component
function App() {
  // Step 2: Define a state variable to store the user's input
  const [userName, setUserName] = useState('');

  // Step 3: Handle changes in the text input and update the state variable
  const handleInputChange = (event) => {
    setUserName(event.target.value);
  };

  return (
    <div>
      <h1>Enter Your Name</h1>
      {/* Use the Shadcn Form component 
      <Form>
        {/* Text input for the user to enter their name
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded-md"
        />
      </Form>
      {/* Step 4: Pass the 'userName' state variable as a prop to the child component 
      <DisplayUserName name={userName} />
    </div>
  );
}

export default App;
*/