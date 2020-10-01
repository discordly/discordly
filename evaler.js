module.exports = (tokens) => {
    // Tokens

    /*
        Token Format: (Might change later to make it look better)
        [{
            "type": "string",
            "line": 2,
            "parent": 1 || null, // this is the function/variable that it is the argument for
            "token": "Hello world!",
        },
        {
            "type": "function",
            "id": 1,
            "line": 1,
            "children": [tokens] // these will be evaluated on their own
        },
        {
            "type": "variable",
            "line": 2,
            "parent": 1,
            "name": "bob",
            "children": [tokens] // evaluates code that defines the variable
        }]
    */

    //gtg ok
}