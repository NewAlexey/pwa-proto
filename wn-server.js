import express from "express";
import cors from "cors";
import webpush from "web-push";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const app = express();
app.use(cors());

const port = process.env.PORT || 5004
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/dist")); // anything you ask from the root is coming from the /public

const publicVapidKey = "BGNotAAxKxGS33hFvdBXLveK20Gb7K9piatPIQaajucJHLYmtZcGeh7LIKtm0wVeleenEpMrBR57yhRYvKQ7j0Q";
const privateVapidKey = "qTw2gCkxt7p6LhjGAcseqKs-UpaetosP2vSXLIzizRA";

webpush.setVapidDetails(
    'mailto:hehe@ne-hehe.com',  // you can change it in your project or else everyone blames me for your notifications!
    publicVapidKey,  // Public key first
    privateVapidKey,  // Private key second
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

let tokenlist = []; // keep trick of all the browser payloads as "tokens"

app.post('/newbrowser',function(req,res){
    const token = req.body.token;
    const isSafari = (req.headers['user-agent'].indexOf("Safari") > 0);
    const auth = req.body.auth;
    const endpoint = req.body.endpoint;
    tokenlist.push({ token, auth, isSafari, endpoint });
    console.log("adding token: "+ token + " with auth: " + auth + " and notification url:" + endpoint);
    res.json({success:true});
});


app.get('/notify',function(req,res) {
    const options = {
        TTL: 24 * 60 * 60,
        vapidDetails: {
            subject: 'mailto:hehe@ne-hehe.com',
            publicKey: publicVapidKey,
            privateKey: privateVapidKey
        }
    };
    const payload = JSON.stringify({ title: "FloridaJS Notifications are amazing", body: "And this event was well worth the money I spent on donations!" });
    
    for (let i= 0; i < tokenlist.length; i++) {
        // Code here.
        let pushSubscription = {
            "endpoint":tokenlist[i].endpoint,
            "keys": {
                "p256dh":tokenlist[i].token,
                "auth": tokenlist[i].auth
            } // end keys
        }; // end pushSubscription
        
        try {
            webpush.sendNotification(pushSubscription,payload); // ,options);
            console.log(`Notification #${i} sent successful!`);
        } catch(ex) {
            console.error(`error in sendNotification #${i})`,ex);
        }
    }
    
    console.log(tokenlist.length + " notification sent");
    
    res.send( tokenlist.length + " notification sent");
    
});


app.listen(port,function() { console.log("started on port " + port); });
