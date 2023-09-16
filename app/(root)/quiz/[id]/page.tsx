
import TakeQuiz from "@/components/forms/TakeQuiz";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { Button } from "@/components/ui/button";
 


interface QuizItem {
    question: string;
    options: QuizOption[];
}
  
interface QuizOption {
    text: string;
    isCorrect: boolean;
    _id: string;
}

async function Page({params} : {params: {id:string}}){
    // We need Thread Details to make the ThreadCard
    // If no id, return null
    if(!params.id) return null;
    // Get User
    const user = await currentUser();
    if(!user) { return null;}
    // Get user info from our database
    const userInfo = await fetchUser(user.id);
    // We do this to check if userInfo.onboarded is true
    if(!userInfo?.onboarded) redirect('/onboarding');
    // Current Thread
    const thread = await fetchThreadById(params.id);
    
    return(
      <section>
        <h1 className="head-text text-light-1 mb-10">{thread.text}</h1>
        <TakeQuiz
          quiz={JSON.stringify(thread.quiz)}
         />
      </section>
    );   
}

export default Page;
 