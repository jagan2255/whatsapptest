const express = require("express");
const app = express();
const twilio = require('twilio');
const cors=require("cors");


require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;


const accountSid = process.env.AccountSID;
const authToken = process.env.AuthToken;
const client = twilio(accountSid, authToken);

// console.log(authToken)


app.get("/" , (req,res)=>{
    res.send(`Server Running on ${PORT}`)
})

var config={
  verifytoken : "EAAIlHSI1aqsBABfjZCmGY1Inl2JZAkTN9XsfzvPZAJIa9wxvyDolnyfCBdvQpeMwcMpMzErHRNimQ52cXoFJkMX1tSsuF83mpzjEzRPc0kL0ZAfwUU3MIfTGhmNOGQZBkmt5b827y71kDTjTjXLjVILgasZAz1UV4bWe8l6dOHmYuOZAEuLZCqP4I3iE5FWRPMhoZA2xoNLfekAZDZD"
}

app.get("/messaging-webhook", (req, res) => {
  
  console.log(req.query)

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === config.verifytoken) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });


app.post("/whatsappapi" , (req,res)=>{

  console.log(req.body)
 
    res.send('hub.challenge');

})



app.get('/add-catalogs', async (req, res) => {
    try {
        console.log(authToken)
        const catalogData = [
            { name: 'Catalog 1', description: 'Description of Catalog 1', imageUrl: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=75' },
            { name: 'Catalog 2', description: 'Description of Catalog 2', imageUrl: 'https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=75' },
          ];
          
          for (let i = 0; i < catalogData.length; i++) {
            const { name, description, imageUrl } = catalogData[i];
            await client.request({
              method: 'POST',
              uri: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/WhatsApp/Catalogs`,
              auth: { user: accountSid, pass: authToken },
              form: { 'Template': { 'Name': name, 'MediaUrl': imageUrl, 'Description': description } }
            });
        }
      res.status(200).json({ message: 'Sucess' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error' });
    }
  });

app.get("/getdata" , (req,res)=>{

    client
    .request({
      method: 'GET',
      uri: `https://api.twilio.com/v1/Catalog/Services/${accountSid}/Items`,
    })
    .then(response => {
      const items = response.body;
      console.log(`Found ${items.length} catalog items`);
      res.send(`Found ${items.length} catalog items`)
    })
    .catch(error => console.error(error));

})


app.post('/whatsapp', (req, res) => {
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    var message = req.body.Body;
    const sender = req.body.ProfileName;
    message = message.toLowerCase()
console.log(message)

const commands = {
  'hi': 'Hello there!',
  'how are you': 'I am doing well, thank you. How can I assist you?',
  'what is your name': 'My name is WhatsApp Bot. How can I assist you today?',
  'help': 'I can help you with a variety of tasks. Please tell me what you need assistance with.',
  'bye': 'Goodbye!'
}

if (message in commands) {
  twiml.message(commands[message]);
}

   else if(message ==="time"){
        let date = new Date(); 
        let dateAndTime = date. toLocaleString();

        twiml.message(`Hi ${sender} time is ${dateAndTime}`);
    }

    else if (message === 'start') {
      twiml.message(`Please choose an option:\n1. Time\n2. Date\n3. Place\n4. Offers`);
       
    }
    else if (message === '1') {
      let date = new Date(); 
      let dateAndTime = date. toLocaleString();

      twiml.message(`Hi ${sender} time is ${dateAndTime}`);
      
    }
      else if (message === '2') {

      twiml.message(`Date details: March 20, 2023`);
    }
  
    else if (message === '3') {

      twiml.message(`Place:India`);

    }
      else if (message === '4') {

      twiml.message(`Offers details: Buy one, get one free`);

      }else{
      twiml.message(`Sorry please use right commands or type start`);
    }

    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
  
    
    });



  
  app.get('/send', (req, res) => {
   
  
    const to = "whatsapp:+918075917693";
    const message = "Your appointment is coming up on July 21 at 3PM";
  
    client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: to
    })
    .then(message => {
      res.send(`Message sent to ${messageto}`);
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
  });



  app.post('/whatsappss', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body.trim();
  
    if (body === 'start') {
      const message = {
        body: 'Welcome! Please choose an option:',
        from: 'whatsapp:+14155238886',  
        to: from,                        
        quick_reply: {
          type: 'options',
          options: [
            {
              "label": "Time",
              "value": "time",
              "payload": "time"
            },
            {
              "label": "Date",
              "value": "date",
              "payload": "date"
            },
            {
              "label": "Place",
              "value": "place",
              "payload": "place"
            },
            {
              "label": "Offers",
              "value": "offers",
              "payload": "offers"
            }
          ]
        }
      };
      client.messages.create(message)
        .then(() => {
          res.send();
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Something went wrong.');
        });
    }
  
    else if (['time', 'date', 'place', 'offers'].includes(body)) {
      let response = '';
  
      switch (body) {
        case 'time':
          response = 'Our business hours are Monday-Friday, 9am-5pm.';
          break;
        case 'date':
          response = 'We are open year-round, except for major holidays.';
          break;
        case 'place':
          response = 'Our address is 123 Main St, Anytown, USA.';
          break;
        case 'offers':
          response = 'Check out our website for the latest offers and promotions.';
          break;
      }
  
      const message = {
        body: response,
        from: 'whatsapp:+14155238886', 
        to: from                          
      };
      client.messages.create(message)
        .then(() => {
          res.send();
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Something went wrong.');
        });
    }
  
    else {
      const message = {
        body: 'Sorry, I don\'t understand. Please type "start" to see the options.',
        from: 'whatsapp:+14155238886',  
        to: from                          
      };
      client.messages.create(message)
        .then(() => {
          res.send();
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Something went wrong.');
        });
    }
  });
  
  
  
app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`)
})