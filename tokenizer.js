module.exports = (line, p) => {
    const utils = require("./utils")
    const lexer = require("./lexer");
  
    let raw = line;
    line = line.split("");
  
    // Token Types
    const types = {
      "compare": ["=="],
      "declare": "=",
      "assign": "let",
  
      // Data types
        "comment": "-",
        "string": ["\"", "'", "`"],
        "bool": ["true", "false"],
        "array": ["{", "}"],
        "json": ["<", ">"],
        "int": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."]
    };
  
    // Short term memory
    let tokens = [];
    let type = '';
    let memory = [];
    let commentLocation = Infinity;
    let alt;
  
    // Seperatron
    let trues = utils.indexOf(types.bool[0], raw);
    let falses = utils.indexOf(types.bool[1], raw);
    let define = utils.indexOf(types.assign, raw);
  
    line.forEach((token, i) => {
  
      // Strings
      if (type == '' && types.string.includes(token)) {
  
        alt = i;
        type = 'string';
  
      }
      else if (type == 'string' && !types.string.includes(token)) {

          memory.push(token);

      }
      else if (type == 'string' && types.string.includes(token)) {
  
        tokens.push({
          type: type,
          data: memory.join(""),
          location: alt,
          line: p
        })
        memory = []
        type = '';
  
      }
      else if (type == '' && types.int.includes(token)) {

          memory.push(token);

          alt = i;
          type = 'int';

      }
      else if (type == 'int' && types.int.includes(token) && line.length - 1 !== i) {

          memory.push(token);

      }
      else if (type == 'int' && !types.int.includes(token) || type == 'int' && line.length - 1 == i) {

          if (line.length - 1 == i) {

              memory.push(token);

          }

          tokens.push({
              type: type,
              data: memory.join(""),
              location: alt,
              line: p
          })
          memory = []
          type = '';

      }
  
      // Booleans
      if ((trues.filter(t => t == i).length !== 0 || falses.filter(t => t == i).length !== 0) && type == '') {
        let bool = falses.filter(t => t == i).length !== 0 ? "false" : "true";
        
        tokens.push({
          type: "bool",
          data: bool,
          location: i,
          line: p
        })
      }
  
      // Declaration
      if (type == '' && define.filter(tok => tok + (types.assign.length - 1) == i).length !== 0) {
        type = 'variable';
        memory = {
          name: "",
          i: i - (types.assign.length - 1)
        }
      }
      else if (type == 'variable' && memory.variableAddress == undefined && token !== types.declare && token !== " ") {
        memory = {
          name: memory.name + token,
          i: memory.i
        }
      }
      else if (type == 'variable' && memory.variableAddress == undefined && token == types.declare) {
        let distance = line[i + 1] == " " ? 2 : 1
  
        tokens.push({
          name: memory.name,
          variableAddress: i + distance,
          type: type,
          location: memory.i,
          line: p
        })
        type = '';
        memory = [];
      }
  
      // Comments
      if (type == '' && line[i - 1] == types.comment && token == types.comment) {
        commentLocation = i;
      }
  
    })
  
    tokens = tokens.filter(tok => tok.location < commentLocation) // Remove comments
  
    lexer(tokens);
  };