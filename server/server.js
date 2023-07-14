import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

var pg = require('pg');
var conString = process.env.URL;

var name = "";
var task = "";

dotenv.config();


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
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


    name = req.body.na;
    task = req.body.ta;
    const nachrichten = req.body.h;

    /// Antwort von chatGPT
    let completion;
    try {
        /*const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        
        });*/

        // Anfrage an chatGPT senden
        completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: nachrichten
        });
        //console.log(completion);

        // Antwort an Client senden
        res.status(200).send({
            //bot: response.data.choices[0].text
            bot: (completion.data.choices[0].message),
        });

    } catch (error) {
        console.log("Anfragen Fehler");
        console.log(error);
        res.status(500).send({ error });
        return; // todo DB Part unabhängig von Antwort machen
    }

    try {
        // DB verbinden
        var client = new pg.Client(conString);
        client.connect(function (err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
        });
        console.log("Verbunden");

        // Nachricht in DB speichern
        const obj = completion.data.choices[0].message;
        const parsedData = obj.content.trim();
        let sql = "INSERT INTO Prompt VALUES('" + req.body.prompt + "','" + parsedData + "','" + name + "','" + task + "');";
        console.log(sql);
        /*client.query(sql, function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            // >> output: 2018-08-23T14:02:57.117Z
            client.end();
        });*/

    } catch (error) {
        console.log("DB Fehler");
        console.log(error);
        //res.status(500).send({ error });
    }


});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'))