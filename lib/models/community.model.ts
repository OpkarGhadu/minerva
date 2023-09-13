import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    id: {type: String , required: true},
    username: {type: String, required: true, unique:true},
    name: {type:String, required: true},
    image: String,
    bio: String,
    createdBy : {   // createdBy will be reference to a User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Meaning one user can have many references to 
    // threads stored in the DB
    threads : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        },
    ],
    members: [  // Array of User References
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]

});


const Community = mongoose.models.Community || mongoose.model('Community',communitySchema);

export default Community;