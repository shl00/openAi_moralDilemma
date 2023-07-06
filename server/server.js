import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
/*import * as sqlite from 'sqlite3';
const sqlite3 = sqlite;*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//const sqlite3 = require('sqlite3').verbose();
var pg = require('pg');
//var conString ="postgres://jjcvxmos:5D9o-SZWVWJRb5a8VPaWojzwHJygUjQz@tyke.db.elephantsql.com/jjcvxmos";
var conString = process.env.URL;

var name = "";
var task = "";

dotenv.config();
let user =[] ;
let bot =[];
function getMessage(){
    var arrN =[];
    let a=0,b=0;
    for(let i = 0;a<user.length;i+=2 ){
        arrN[i]=(JSON.parse(user[a++]))
    }
    for(let i = 1;b<bot.length;i+=2 ){
        arrN[i]=(JSON.parse(bot[b++]))
    }
    return arrN;
}
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

app.post('/', async (req, res) => {
    try {
        //const prompt = await req.body.prompt.json();
        //const prompt = JSON.parse(req.body.prompt);
        user= JSON.parse(req.body.u);
        console.log(user)
        if(user.length >1){
         bot = JSON.parse(req.body.b);
        }
        name = req.body.na;
        task = req.body.ta
        /*const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        
        });*/
        let b = getMessage();
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [b],
        })
        
        res.status(200).send({
            //bot: response.data.choices[0].text
            bot: (completion.data.choices[0].message),
        })
        var client = new pg.Client(conString);
        client.connect(function (err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
        });
        console.log("Verbunden");

        const obj = completion.data.choices[0].message;
        const parsedData   = obj.content.trim();
        let sql = "INSERT INTO Prompt VALUES('" + req.body.prompt + "','" + parsedData + "','" + name + "','" + task + "');";
        console.log(sql);
        client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            // >> output: 2018-08-23T14:02:57.117Z
            client.end();
        });
    
    } catch (error) {
        console.log(error);
        console.log(getMessage())
        res.status(500).send({error});
    }


});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))