const express = require('express')
const path = require('path')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
const orderModule = require('./order')
const { orders } = require('./order');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mongoModule = require("./public/Javascript/mongoDB");

mongodbModule.connectToMongoDB()
    .then(() => {
        console.log('Connect to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        server.close();
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

app.get('/order', (req,res) =>
{
    html = orderModule.output()
    res.send(html)
})


app.post('/api/order', (req, res) => {
    const { orderDate, totalAmount, orderStatus, paymentMethod, image } = req.body;
    const lastOrderID = orders[orders.length - 1].orderID;
    const newOrderID = 'OD' + String(parseInt(lastOrderID.substring(2)) + 1).padStart(8, '0');
    const newOrder = { orderID: newOrderID, orderDate, totalAmount, orderStatus, paymentMethod, image, isNew: true }; // Add a new property 'isNew'
    orderModule.addOrder(newOrder);
    res.send(`Đã nhận dữ liệu thành công! ${newOrderID}. Bạn có thể xem dữ liệu mới <a href="/order">tại đây</a>`);
});

app.delete('/api/delete/:orderID', (req, res) => {
    const orderID = req.params.orderID;
    // Xóa đơn hàng với ID đã cho
    const orderIndex = orders.findIndex(order => order.orderID === orderID);
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        res.send(`Đã xóa đơn hàng có ID = ${orderID} thành công.`);
    } else {
        res.send(`Không tìm thấy đơn hàng có ID = ${orderID}.`);
    }
});


app.put("/api/orders/:orderID", (req, res) => {
    const orderIdToUpdate = req.params.orderID;
    const { orderDate, totalAmount, orderStatus, paymentMethod, image } = req.body;

    // Tìm và cập nhật đơn hàng có orderID cần cập nhật
    const indexToUpdate = orders.findIndex(order => order.orderID === orderIdToUpdate);
    if (indexToUpdate === -1) {
        res.statusCode = 400;
        res.json({ message: "Order not found" });
        return;
    }

    orders[indexToUpdate].orderDate = orderDate;
    orders[indexToUpdate].totalAmount = totalAmount;
    orders[indexToUpdate].orderStatus = orderStatus;
    orders[indexToUpdate].paymentMethod = paymentMethod;
    orders[indexToUpdate].image = image;

    res.json({ message: "Order updated successfully" });
});

app.get('/api/orders/:orderID', (req, res) => {
    const orderID = req.params.orderID;
    const foundOrder = orderModule.searchOrders(orderID);
    if (foundOrder) {
        res.json(foundOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))