import mongoose from "mongoose";

/* DB entry of Thread Has
    text of thread
    author, which is a reference to a user Object id
    community (not required)
    creation date
    parentID - if it is a comment
    children - if it has children threads
    questions - if it has a quiz
*/
const threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
       type: Date,
       default: Date.now, 
    },
    // If Comment
    parentId :{
        type: String,
    },
    // One Thread can have multiple (hence array) children
    // threads are Threads references themselve
    /*  This is because Threads can be multi level
    EX: 
        Thread Original
            -> Thread Comment 1
            -> Thread Comment 2
                > Thread Comment 2.1
     */
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    /* Quiz will be array of questions
        Each Question has a title
        And 4 options in the form of 
        {'questionText' , true/false}
    */
    quiz: [
        {
            // Each Quiz Item has a question
            question: {
                type: String,
            },
            // and a list of options
            //  each option has the text
            //  and whether or not its true
            options: [
                {
                    text: {
                        type: String
                    },
                    isCorrect : {
                        type: Boolean,
                    }

                }
            ]
        }
    ]
});

// Create Thread
const Thread = mongoose.models.Thread || mongoose.model('Thread',threadSchema);

export default Thread;