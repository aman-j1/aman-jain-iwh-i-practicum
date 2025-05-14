const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY; // Your HubSpot API Key
const objectType = process.env.CUSTOM_OBJECT_TYPE; // or use '2-44734443'

// ✅ ROUTE 1 - Homepage: list pets
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}?properties=name&properties=bio&properties=species`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const pets = resp.data.results;
        res.render('contact', { title: 'Pet List', pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).send('Failed to load pets');
    }
});

// ✅ ROUTE 2 - Show form (for adding or updating a pet)
app.get('/form', (req, res) => {
    res.render('form', { title: 'Add or Update Pet' });
});

// ✅ ROUTE 3 - Handle form submission (for creating or updating a pet)
app.post('/form', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newPet = {
        properties: {
            name: req.body.name,
            bio: req.body.bio,
            species: req.body.species
        }
    };

    try {
        await axios.post(url, newPet, { headers });
        res.redirect('/'); // Redirect back to the homepage after submitting the form
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).send('Failed to create pet');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
