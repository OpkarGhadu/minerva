"use client"

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



interface QuizItem {
    question: string;
    options: QuizOption[];
    _id: string;
}
  
interface QuizOption {
    text: string;
    isCorrect: boolean;
    _id: string;
}

interface Props {
    quiz: string;
}
 
const TakeQuiz = ({quiz} : Props) => {   
    // Convert Json String to Object
    const quizObject: QuizItem[] = JSON.parse(quiz);
    //console.log("Json:", quizObject);
    // State
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState<number | null>(null);
    
    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const calculateScore = () => {
        const totalCorrect = quizObject.reduce((acc, quizItem, index) => {
          const selectedOptionIndex = userAnswers[index];
          if (selectedOptionIndex !== undefined) {
            const selectedOption = quizItem.options[selectedOptionIndex];
            if (selectedOption.isCorrect) {
                console.log("Correct ", index);
              return acc + 1;
            }
          }
          return acc;
        }, 0);
        const score = totalCorrect*100.0/quizObject.length;
        console.log("SCORE IS ", score.toString() , "%");
        setScore(totalCorrect);
        

      };

 
      const refreshPage = () => {
        window.location.reload();
      }



    return (
        <div>
            {quizObject.map((quizItem,quizIndex) => (
                <div key={quizItem._id} className="border text-light-1">
                    <h2 className="mx-3 my-2 text-heading4-medium">{quizIndex+1}. {quizItem.question}</h2>
                    <ul>
                        {quizItem.options.map((option, optionIndex) => (
                            <li key={option._id} className="mb-2 mx-3">
                                <label>
                                    <input
                                        type="radio"
                                        name={`quiz_${quizIndex}`}
                                        value={optionIndex}
                                        onChange={()=> handleOptionSelect(quizIndex,optionIndex)}
                                    />
                                    {" "}{option.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <AlertDialog>
                <AlertDialogTrigger
                        className="bg-primary-500 rounded-lg mt-10 px-4 py-2 text-light-1 hover"
                        onClick={calculateScore}
                    >
                    Submit Quiz
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Results</AlertDialogTitle>
                        <AlertDialogDescription>        
                            Your Score: {score} / {quizObject.length}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={refreshPage}>
                            Retry
                        </AlertDialogAction>
                        <AlertDialogAction >
                            Ok
                        </AlertDialogAction>
                    </AlertDialogFooter>       
             </AlertDialogContent>
            </AlertDialog>
      </div>
    );
};

export default TakeQuiz;