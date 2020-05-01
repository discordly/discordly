#!/usr/bin/env node

// Discord.ly programming language!!

const fs    = require("fs");
const parse = require("./parser")

let err = new EvalError("Could not parse: \"bot\" file does not exists!")

const botExists = fs.existsSync("./bot");
if (!botExists) {
    throw err;
}

const bot   = fs.readFileSync("./bot", "utf8");
const main  = bot.split("\n")[0].replace("\r","")
const token = bot.split("\n")[1]

err = new EvalError("Could not parse: Main file does not exist!")
const mainExists = fs.existsSync(`./${main}`);
if (!mainExists) {
    throw err;
}

// mmmm myes parse that shit good
parse(`./${main}`);