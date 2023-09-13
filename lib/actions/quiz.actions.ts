/* Takes Prompt from user, sends it to chatgpt
    If user approves, adds to databse
*/
"use server"
import OpenAI from "openai";

const formatString = (question: string) => {
    let res = question.split(/\r?\n/);
    return res;
}

// Will send user question to ChatGPT
//  return will be query in correct form
export const sendMessageToChatGPT = async ( question : string) => {
    
    // Check for API Key
    if(!process.env.OPENAI_API_KEY){
        return console.log("ERROR:","OPENAI_KEY not found");
    }

    // Create Prompt
    const promptText = `considering the question: \"${question}\", in multiple choice format, give me four choices for the question where only one is correct.
    Each choice should be labeled from A) to D), each on their own line followed by a period and then either '[True]' or '[False]' depending on if the choice is the
    correct one. Make sure only one answer is true. Send the response in the format of the following example:
    A) Apples. True
    B) Oranges. False
    C) Pears. False
    D) Grapes. False
    The last line should not contain any whitespace or characters.
    `;

    //console.log("GPT SEND", promptText);
    // Try Connecting to ChatGPT
    
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
    
        })

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature: 0.1, // Randomness
            messages: [
                {   // Let system know role and behaviour
                    "role": "system",
                    "content" : "You are a teacher's assistant."
                },
                {   // Question from the user
                    "role": "user",
                    "content": promptText,
                }
            ],
       
        });
        // Return GPT Response
        console.log("ChatGPT:", response.choices[0].message.content)
        if(!response.choices[0].message.content){
            return null;
        }
        else {
            return formatString(response.choices[0].message.content);
        }
        
    } catch {
        console.log("ERROR - ChatGPT connection failed.");
    }

}