const tokenizer = require("./tokenizer");
const fs        = require("fs");

module.exports = function parse(file) {
    let fileString = fs.readFileSync("./" + file, "utf8");
    let lineSplit  = fileString.split("\n");

    let p = 0
    lineSplit.forEach((ln) => {
        tokenizer(ln, p);
        p++
    });
}