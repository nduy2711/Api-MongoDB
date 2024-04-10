const express = require('express')
const path = require('path')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
const orderModule = require('./order')
//const { orders } = require('./order');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const querystring = require('querystring')

const mongodbModule = require("./public/Javascript/mongoDB");


mongodbModule.connectToMongoDB()
    .then(() => {
        console.log('Connect to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        server.close();
    });


const server = app.listen(3000, () => {
    console.log('Sever is running on port 3000');
});

//Listen on shutdown server event(Ctrl+C...)
process.on('SIGINT', () => {
    mongodbModule.closeMongoDBConnection()
});

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname)));
app.use(express.static('pages'));

// Câu 1
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/order', async (req,res) =>
{
    try {
        const orders = await mongodbModule.findOrderList();
        const html = orderModule.output(orders);
        res.send(html) 
    } catch(err) {
        console.error('Failed to fetch documents', err);
        res.status(500).send('Failed to fetch documents');
    }
})

app.post('/createManyOrders', async (req, res) => {
    const order = req.body;
    console.log(order);
    mongodbModule.addManyOrders(order);
    const message  = `${order.length} orders created successfully!`
    res.json({message: message})
    //res.send(`Thêm thành công ${req.body.name}! Bạn có thể xem lại danh sách <a href=/order>tại đây</a>`)
});

app.get('/read',async (req, res) => {
    const paymentMethod = req.query.paymentMethod;
    const minPrice = req.query.minPrice; // Thêm tham số minPrice và maxPrice
    const maxPrice = req.query.maxPrice;
    const query = {};

    if (paymentMethod) {
        query.paymentMethod = {$regex: paymentMethod, $options: 'i'}
    }

    // Thêm điều kiện tìm kiếm theo khoản giá thấp nhất và giá cao nhất
    if (minPrice) {
        query.totalAmount = {$gte: parseFloat(minPrice)};
    }
    
    if (minPrice && maxPrice) {
        query.totalAmount = {$gte: parseFloat(minPrice), $lte: parseFloat(maxPrice)};
    } else if (minPrice) {
        query.totalAmount = {$lte: parseFloat(minPrice)};
    } else if (maxPrice) {
        query.totalAmount = {$gte: parseFloat(maxPrice)};
    }

    try {
        const searchResult = await mongodbModule.findDocuments(query);
        const tableRowsHTML = searchResult.map(order => {
            return `
                <tr>
                    <td>${order.orderID}</td>
                    <td>${order.orderDate}</td>
                    <td>$${order.totalAmount}</td>
                    <td>${order.orderStatus}</td>
                    <td>${order.paymentMethod}</td>
                    <td><img src="/public/images/${order.image}" alt="" style="max-width: 100px;"></td>
                    <td><a href = "update.html" >Edit<a></td>
                </tr>
            `;
        }).join('');
    
        res.send(`
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: #fff;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    }
                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                    }
                    th {
                        background-color: #007bff;
                        color: #fff;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                    .back-icon {
                        text-align: left;
                        margin-bottom: 20px;
                    }
                    .back-icon a {
                        text-decoration: none;
                        color: #000000;
                        font-size: 24px;
                    }
                </style>
            </head>
            <body>
                <div class="back-icon">
                    <a href="index.html"><i class="fas fa-arrow-left"></i> Back to Home</a>
                </div>
                <h1 style="text-align: center;">Order List</h1>                
                <table border="1">
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Order Status</th>
                        <th>Payment Method</th>
                        <th>Image</th>
                        <th href="update.html" >Action</th>
                    </tr>
                    <tbody>
                        ${tableRowsHTML}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to search orders');
    }    
})

app.get('/read/for/update', async (req, res) => {
    const orderID = req.query.orderID;
    const query = { orderID: { $regex: orderID, $options: 'i' } };
    
    try {
        const ordersCollection = mongodbModule.dbCollection;
        const editOrder = await ordersCollection.findOne(query);

        const queryParams = querystring.stringify(editOrder);
        res.redirect(`/pages/update.html?${queryParams}`);
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
});

app.put('/update', async (req, res) => {
    try {
        const newOrder = req.body;
        const orderID = newOrder.orderID;

        const ordersCollection = mongodbModule.dbCollection;
        await ordersCollection.updateOne({ orderID: orderID }, {
            $set: {
                orderDate: newOrder.orderDate,
                totalAmount: newOrder.totalAmount,
                orderStatus: newOrder.orderStatus,
                paymentMethod: newOrder.paymentMethod
            }
        });

        const content = `Order ID = ${newOrder.orderID} updated successfully !!!`;
        res.json({ message: content }); // Response to fetch()
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
});

// app.delete('/api/delete/:orderID', (req, res) => {
//     const orderID = req.params.orderID;
//     // Xóa đơn hàng với ID đã cho
//     const orderIndex = orders.findIndex(order => order.orderID === orderID);
//     if (orderIndex !== -1) {
//         orders.splice(orderIndex, 1);
//         res.send(`Đã xóa đơn hàng có ID = ${orderID} thành công.`);
//     } else {
//         res.send(`Không tìm thấy đơn hàng có ID = ${orderID}.`);
//     }
// });


// app.put("/api/orders/:orderID", (req, res) => {
//     const orderIdToUpdate = req.params.orderID;
//     const { orderDate, totalAmount, orderStatus, paymentMethod, image } = req.body;

//     // Tìm và cập nhật đơn hàng có orderID cần cập nhật
//     const indexToUpdate = orders.findIndex(order => order.orderID === orderIdToUpdate);
//     if (indexToUpdate === -1) {
//         res.statusCode = 400;
//         res.json({ message: "Order not found" });
//         return;
//     }

//     orders[indexToUpdate].orderDate = orderDate;
//     orders[indexToUpdate].totalAmount = totalAmount;
//     orders[indexToUpdate].orderStatus = orderStatus;
//     orders[indexToUpdate].paymentMethod = paymentMethod;
//     orders[indexToUpdate].image = image;

//     res.json({ message: "Order updated successfully" });
// });

// app.get('/api/orders/:orderID', (req, res) => {
//     const orderID = req.params.orderID;
//     const foundOrder = orderModule.searchOrders(orderID);
//     if (foundOrder) {
//         res.json(foundOrder);
//     } else {
//         res.status(404).json({ message: 'Order not found' });
//     }

