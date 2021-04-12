const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema ({
    pizzaName: {
        type: String,
        required: true,
        // or required: 'Please provide a pizzaName!'
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        // or required: 'Please provide a createdBy name!'
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // the date will be formatted by dateFormat function in /utils/dateformat.js
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        // enum stands for enumerable - set of data that can be iterated over (like for loop)
        // this will prevent a use from adding a size that isn't listed in array ('super mega large')
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    },
    toppings: [],
    comments:[
        {
            // this references the objectId from the Comment model
            type: Schema.Types.ObjectId,
            // ref will tell Mongoose to search the Comment model for the ID
            ref: 'Comment'
        }
    ]
},
{
    // this tells the schema to use Mongoose virtuals and getters
    toJSON: {
        virtuals: true,
        getters: true
    },
    // id set to false because this is virtual that Mongoose returns and is not needed
    id: false
}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function (){
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema)


// export the pizza model
module.exports = Pizza ;