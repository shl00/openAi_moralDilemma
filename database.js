var pg = require('pg');
var conString = "postgres://chatbot_data_user:8gsPtweIx6zN8enHPuBGq5wGMr0rGxSK@dpg-ci6pdv18g3nfucc98p0g-a.frankfurt-postgres.render.com/chatbot_data?ssl=true";

    var client = new pg.Client(conString)
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
    });
    console.log("Verbunden!")
    
    //const sql = "SELECT* FROM PROMPT;"
    let a = "Test";
    let b = a;
    let c = b;
    let sql = "INSERT INTO Prompt VALUES('"+a+"','"+b+"','"+a+"','" +a+"');";
    client.query(sql, function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        else{
            console.log(result.rows);
        }
        client.end();
      });
  

