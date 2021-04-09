const { Pizza } = require('../models');

// the functions will go here as METHODS of pizzaController

const pizzaController = {
    // get all pizzas CALLBACK FUNCTION for GET /api/pizzas route
    // this uses Mongoose find() method
    getAllPizza(req, res) {
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err =>{
            console.log(err);
            res.json(400).json(err);
        });
    },

    // this is a METHOD
    // destructuring params from pizza request
    getPizzaById({params}, res) {
        Pizza.findOne({_id: params.id})
        .then(dbPizzaData => {
            // if not found send 404
            if(!dbPizzaData){
            res.status(404).json({message: "No pizza found with this id!"});
            return;
            }
            res.json(dbPizzaData)
        })
        .catch(err =>{
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create pizza as a POST /api/pizza
    // destructuring body from the express.js request object
    // {body} is the request in this callback function
 
    createPizza({ body }, res) {
        Pizza.create(body)
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
      },

    // update pizza by ID
    // {new:true} instructs Mongoose to return the new version of the document
    updatePizza({ params, body}, res){
        Pizza.findOneAndUpdate({_id: params.id} , body, {new: true})
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: "No pizza found with this id!"})
                return;
            }
            res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete Pizza
    deletePizza({params}, res) {
        Pizza.findOneAndDelete({_id: params.id})
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({message: "No pizza found with this id!"})
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = pizzaController;
