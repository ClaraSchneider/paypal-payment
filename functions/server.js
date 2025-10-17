const paypal = require('@paypal/checkout-server-sdk');

// Configurar PayPal
const environment = new paypal.core.SandboxEnvironment(
    'AZWAbPr7gqCiZBqbyNupbKBj3JVx5JYNGop92mXnAVYZXu5qmccSjObBjRnSNkoJSGU-39Y_4CLuXPMW',
    'ELMc1YCDl_ufl5odGIOH6L_HiVHdatcieJdab9s427JiiKI_DVhEYydzp2sES1EFKVPPhhRt9rkg3jMh'
);
const client = new paypal.core.PayPalHttpClient(environment);

exports.handler = async (event, context) => {
    const { cardNumber, expiryDate, cvv } = JSON.parse(event.body);
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
                email_address: 'claramartinezzzz47@gmail.com' // Tu correo de PayPal
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
        return {
            statusCode: 200,
            body: JSON.stringify({ id: order.result.id })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};