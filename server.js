const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Configurar PayPal
const environment = new paypal.core.SandboxEnvironment(
    'AZWAbPr7gqCiZBqbyNupbKBj3JVx5JYNGop92mXnAVYZXu5qmccSjObBjRnSNkoJSGU-39Y_4CLuXPMW',
    'ELMc1YCDl_ufl5odGIOH6L_HiVHdatcieJdab9s427JiiKI_DVhEYydzp2sES1EFKVPPhhRt9rkg3jMh'
);
const client = new paypal.core.PayPalHttpClient(environment);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/create-order', async (req, res) => {
    const { cardNumber, expiryDate, cvv } = req.body;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'EUR',
                value: '100.00', // Aquí especificas el monto real
            },
            payee: {
                email_address: 'tu-correo-paypal@example.com' // Tu correo de PayPal
            }
        }],
        payment_source: {
            card: {
                number: cardNumber,
                expiry_month: expiryDate.split('/')[0],
                expiry_year: '20' + expiryDate.split('/')[1],
                cvv: cvv,
                type: 'visa' // Puedes cambiar esto a 'mastercard', 'amex', etc.
            }
        }
    });

    try {
        const order = await client.execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});