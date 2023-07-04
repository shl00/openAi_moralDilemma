
import { Configuration, OpenAIApi } from 'openai';
/*import * as sqlite from 'sqlite3';
const sqlite3 = sqlite;*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//const sqlite3 = require('sqlite3').verbose();

//var conString ="postgres://jjcvxmos:5D9o-SZWVWJRb5a8VPaWojzwHJygUjQz@tyke.db.elephantsql.com/jjcvxmos";
var conString = process.env.URL;

var name = "";
var task = "";




const configuration = new Configuration({
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);
var prompt = JSON.parse(JSON.stringify("{role: 'user', content: 'hi'},"));
console.log(prompt);
var user =["hi","ich bin sahil", "wie heiße ich?"];
var bot = ["hallo, wie kann ich helfen?","hi sahil"];
function getMessage(){
    var arrN =[];
    let a=0,b=0;
    for(let i = 0;a<user.length;i+=2 ){
        arrN[i]=({role: 'user', content: user[a++]})
    }
    for(let i = 1;b<bot.length;i+=2 ){
        arrN[i]=({role: 'assistant', content: bot[b++]})
    }
    return arrN;
}
console.log( getMessage())
try {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: 
         
            getMessage()
        
    })

    console.log(completion.data.choices[0].message.content)
} catch (error) {
    console.log(error)
}
