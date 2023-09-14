"use client"
import { useState } from "react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";


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
              return acc + 1;
            }
          }
          return acc;
        }, 0);
        setScore(totalCorrect);
      };

      const refreshPage = () => {
        window.location.reload();
      }



    return (
        <div>
            {quizObject.map((quizItem,quizIndex) => (
                <div key={quizItem._id} className="border text-light-1">
                    <h2>{quizItem.question}</h2>
                    <ul>
                        {quizItem.options.map((option, optionIndex) => (
                            <li key={option._id}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`quiz_${quizIndex}`}
                                        value={optionIndex}
                                        onChange={()=> handleOptionSelect(quizIndex,optionIndex)}
                                    />
                                    {option.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <Button 
                type="submit"
                className="bg-primary-500 mt-10"
                onClick={calculateScore}
            >
            Submit Quiz
            </Button>
            {score !== null && (
                <>
                <p className="text-light-2 mt-4">
                    Your Score: {score} / {quizObject.length}
                </p>
                <Button 
                    type="submit"
                    className="bg-primary-500 mt-10"
                    onClick={refreshPage}
                >
                    Retry
                </Button>
                </>
            )}

      </div>
    );
};

export default TakeQuiz;