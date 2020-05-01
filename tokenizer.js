module.exports = (line, p) => {
    const lexer = require("./lexer")

    line = line.split("");
    
    // detect initialization tokens
    let currentType  = null;
    let tokens       = [];
    let grabToken    = "";
    let i            = 0;
    let functionName = ""
    let functionId = 0;

    line.forEach((token) => {
        if (currentType == null) {
            if (token == "[" || (token == " " && line[i - 1] == ",")) {

                currentType = "Argument";

                let e = 1;

                while ((line[i - e] !== " " || line[i - e] !== undefined) && e !== null) {
                    functionName += line[i - e]
                    

                    if (line[i - e - 1] == " " || line[i - e - 1] == undefined) {
                        e = null;

                        functionName = functionName.split("").reverse().join("").split("[")[0]
                    } else {
                        e++
                    }
                }

            } else if (token == "\"" || token == "'" || token == "`") {

                currentType = "String_" + token;

            }
        } else {
            if (currentType == "Argument" && token == "]" || (token == "," && !(grabToken[0] + grabToken[grabToken.length - 1] == "\"\"" || grabToken[0] + grabToken[grabToken.length - 1] == "''" || grabToken[0] + grabToken[grabToken.length - 1] == "``"))) {

                let typeOfArg = (grabToken[0] + grabToken[grabToken.length - 1] == "\"\"" || grabToken[0] + grabToken[grabToken.length - 1] == "''" || grabToken[0] + grabToken[grabToken.length - 1] == "``") ? "String" : !isNaN(grabToken) && (grabToken !== true && grabToken !== false) ? "Int" : "Float"
                
                if (typeOfArg == "String") {
                    let tempToken = grabToken.split("")
                    tempToken.splice(0, 1)
                    tempToken.splice(tempToken.length - 1, 1)

                    tokens.push({"Type":"Argument", "Data": tempToken.join(""), "Function": functionName, "ArgumentType": typeOfArg, "Line": p});
                } else {
                    tokens.push({"Type":"Argument", "Data": grabToken, "Function": functionName, "ArgumentType": typeOfArg, "Line": p});
                }
                

                currentType = null;
                grabToken   = "";

            } else if (currentType == "String_" + token) {

                tokens.push({"Type":"String", "Data": grabToken, "Line": p});

                currentType = null;
                grabToken   = "";


            } else {
                grabToken += token;
            }
        }
        i++


    })

    lexer(tokens);
};