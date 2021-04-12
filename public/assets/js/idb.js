// this js file handles the indexedDB connection 


// create variable to hold db connection
let db;

// establish a connection to IndexedDB called 'pizza_hunt' and set to version 1
// this acts as event listener
// event listener is created when connection opened to the database using indexedDB.open
// the 2 variables are the name of the DB followed by the version of the database
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes(nonexistent to version 1 etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create an object store(table) called 'new_pizza', set it to have an auto incrementing primary key
    db.createObjectStore('new_pizza', {autoincrement: true});
}

// upon a successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneeded), or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to API
    if(navigator.onLine){
        uploadPizza();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new pizza and there is no internet connection
function saveRecord(record){
    // open a new transaction with the database with read and write permissions
    // a transaction is temporary connection to the database
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    // access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    // add record to your store with the add method
    pizzaObjectStore.add(record);
};

function uploadPizza(){
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
    // upon successfull getAll() execution, run this function
    getAll.onsuccess= function(){
        // if there was info in indexedDB store, send it to the API server
        if(getAll.result.length>0){
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in the store
                pizzaObjectStore.clear();

                alert('All saved pizzas have been submitted!')
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

// listen for app coming back online to run uploadPizza function to post the stored data to the new_pizza database
window.addEventListener('online', uploadPizza);