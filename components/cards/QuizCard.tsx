interface Props{
    question: string;
    answer: string;
    index: number;
}

function QuizCard({ question, answer,index} : Props){

    return(
        <article className="mt-5 mb-2 p-4 border">
            <h4 className="text-base-semibold text-light-1 mb-2">
                {index+1}. {question}
            </h4>
            <p className="text-light-2">{answer}</p>
        </article>
    )
}

export default QuizCard;