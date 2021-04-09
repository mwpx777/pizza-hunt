const { Pizza, Comment } = require('../models');

const commentController = {
    // add comment to Pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                // getting pizza info
                return Pizza.findOneAndUpdate(
                    // getting pizzaId
                    { _id: params.pizzaId },
                    // pushing commentId to pizza we are updating with comment as array
                    // $push is built in MongoDB functionality
                    { $push: { comments: _id } },
                    // rewriting pizza info
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));

    },

    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(400).json({ message: 'No comment found with this id!' })
                }
                return Pizza.findOneAndUpdate(
                    // gets pizzaId
                    { _id: params.pizzaId},
                    // pulls the comment from pizza as commentId
                    {$pull: {comments: params.commentId}},
                    // rewrites pizza data
                    {new: true}
                    );
            })
            .then(dbPizzaData => {
                if(!dbPizzaData){
                    res.status(400).json({message: 'No pizza fount with this id!'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }

};


module.exports = commentController;