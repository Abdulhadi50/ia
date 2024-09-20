const express = require('express');
const bodyParser = require('body-parser');
const Spaceremit = require('./spaceremit/spaceremit_plugin.js'); // Import Spaceremit class from Spaceremit.js

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pay-form.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const payment_id = req.body.SP_payment_code;
        const acceptable_data = {
            currency: 'USD',
            original_amount: 1,
            status_tag: ['A', 'B', 'D', 'E', 'F']
        };

        const spaceremit = new Spaceremit();
        const response = await spaceremit.check_payment(payment_id, acceptable_data);

        if (response) {
            const payment_details = spaceremit.data_return;
            // Process payment details
            console.log(payment_details);
            res.send(payment_details); // Respond with payment details
        } else {
            console.error(spaceremit.data_return);
            res.status(400).send(spaceremit.data_return); // Respond with error message
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Respond with generic error message
    }
});

// Handle callbacks from Spaceremit API
app.post('/spaceremit-callback', async (req, res) => {
    try {
        const request_data = req.body;
        
        // Check if the JSON data is valid
        if (request_data !== null) {
            const acceptable_data = {}; // Define your acceptable data
            
            const spaceremit = new Spaceremit();
            const response = await spaceremit.check_payment(request_data.data.id, acceptable_data);
            
            if (response) {
                const spaceremit_payment_data = spaceremit.data_return;
                // Process spaceremit payment data
                console.log(spaceremit_payment_data);
                res.sendStatus(200); // Respond with success status
            } else {
                console.error(spaceremit.data_return);
                res.sendStatus(400); // Respond with error status
            }
        } else {
            console.error('Invalid JSON data');
            res.sendStatus(400); // Respond with error status
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Respond with generic error status
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
