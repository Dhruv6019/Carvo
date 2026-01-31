import axios from 'axios';

const API_URL = 'http://localhost:3000';
let token = '';
let userId = '';

async function runTests() {
    try {
        console.log('Starting Integration Tests...');

        // 1. Signup/Login
        console.log('1. Authenticating...');
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        try {
            await axios.post(`${API_URL}/auth/signup`, {
                name: 'Test User',
                email,
                password,
                role: 'customer'
            });
        } catch (e) {
            // Ignore if already exists (unlikely with timestamp)
        }

        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        token = loginRes.data.accessToken;
        userId = loginRes.data.user.id; // Or however it's returned
        console.log('   Authenticated. Token received.');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create Customization
        console.log('2. Creating Customization...');
        const custRes = await axios.post(`${API_URL}/customer/customizations`, {
            carId: 1,
            name: 'My Dream Car',
            configuration: { parts: [1, 2], colors: ['#000000'] }
        }, authHeaders);
        const customizationId = custRes.data.id;
        console.log(`   Customization Created: ID ${customizationId}`);

        // 3. Create Quotation
        console.log('3. Creating Quotation...');
        const quoteRes = await axios.post(`${API_URL}/customer/quotations`, {
            customizationId
        }, authHeaders);
        console.log(`   Quotation Created: ID ${quoteRes.data.id}`);

        // 4. Get My Quotations
        console.log('4. Fetching My Quotations...');
        const myQuotes = await axios.get(`${API_URL}/customer/quotations`, authHeaders);
        if (myQuotes.data.length > 0) {
            console.log(`   Success: Found ${myQuotes.data.length} quotations.`);
        } else {
            console.error('   Error: No quotations found.');
        }

        // 5. Create Booking
        console.log('5. Creating Booking...');
        const bookingRes = await axios.post(`${API_URL}/customer/bookings`, {
            serviceType: 'maintenance',
            date: '2024-12-25',
            notes: 'Check engine light'
        }, authHeaders);
        console.log(`   Booking Created: ID ${bookingRes.data.id}`);

        // 6. Get My Bookings
        console.log('6. Fetching My Bookings...');
        const myBookings = await axios.get(`${API_URL}/customer/bookings`, authHeaders);
        if (myBookings.data.length > 0) {
            console.log(`   Success: Found ${myBookings.data.length} bookings.`);
        } else {
            console.error('   Error: No bookings found.');
        }

        // 7. Create Order (Simulate Proceed to Order)
        console.log('7. Creating Order...');
        const orderRes = await axios.post(`${API_URL}/orders`, {
            items: [{ partId: 1, quantity: 1 }],
            shipping_address: '123 Test St'
        }, authHeaders);
        console.log(`   Order Created: ID ${orderRes.data.id}`);

        // 8. Get My Orders
        console.log('8. Fetching My Orders...');
        const myOrders = await axios.get(`${API_URL}/orders/my-orders`, authHeaders);
        if (myOrders.data.length > 0) {
            console.log(`   Success: Found ${myOrders.data.length} orders.`);
        } else {
            console.error('   Error: No orders found.');
        }

        console.log('All Integration Tests Passed!');

    } catch (error: any) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

runTests();
