const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
    {
        // set custom ID for replies 
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type:String,
            trim: true,
            required:true
        },
        writtenBy: {
            type:String,
            required: true
        },
        createdAt: {
            type:Date,
            default: Date.now,
            // this is using getter to change format of date created at
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters:true
        }
    }
);

const CommentSchema = new Schema({
    writtenBy: {
        type: String,
        required: true
    },
    commentBody: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // this will add an array for the replies
    replies: [ReplySchema]

},
{
     // this tells the schema to use Mongoose virtuals and getters
    toJSON: {
        // adding virutals will get the reply count
        virtuals:true,
        getters:true
    },
    id:false
}
);
// get total count of replies on retrieval
CommentSchema.virtual('replyCount').get(function(){
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);



module.exports = Comment;