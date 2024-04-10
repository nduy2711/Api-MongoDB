const { query } = require("express");
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const url = "mongodb://localhost:27017";

const client = new MongoClient(url);
const dbName = 'orders';
const collectionName = 'order';

async function connectToMongoDB()
{
    try {
        await client.connect();
        //.log('Connect to MongoDB successfully !!!');
    } catch (err) {
        throw err;
    }    
}

const dbCollection = client.db(dbName).collection(collectionName);


async function closeMongoDBConnection() {
    if(client) {
        await client.close()
            .then(() => {
                console.log('Disconnected from MongoDB');
                process.exit(0);
            })
            .catch((error) => {
                console.error('Failed to disconnect from MongoDB', error);
                process.exit(1);
            })
    } else {
        process.exit(0)
    }
}

// Dữ liệu orders để thêm vào
const orders = [
    { "orderID": "OD20240021", "orderDate": "2024-02-13", "totalAmount": 220.00, "orderStatus": "Processing", "paymentMethod": "Credit Card", "image": "14.jpg" },
    { "orderID": "OD20240022", "orderDate": "2024-02-14", "totalAmount": 80.75, "orderStatus": "Pending", "paymentMethod": "Cash on Delivery", "image": "15.jpg" },
    // Thêm dữ liệu tiếp theo tại đây nếu cần
];


async function findDocuments(query) {
    const documents = await dbCollection.find(query).toArray();
    return documents;
}

async function findOrderList() {
    const documents = await dbCollection.find().toArray();
    return documents;
}

async function findOrder() {
    try {
        await client.connect();
        console.log('Connect to MongoDB successfully !!!')
        
        ordersCollection = client.db(dbName).collection(collectionName);
        
        //query all
        const Order = await ordersCollection.find().toArray();
        Order.forEach(order => {
            console.log('orderID:', order.orderID);
            console.log('name:', order.orderDate);
            console.log('totalAmount:', order.totalAmount);
            console.log('orderStatus:', order.orderStatus);
            console.log('paymentMethod:', order.paymentMethod);
            console.log('image:', order.image);
            console.log('----------------------------------');
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

async function addOrder(order) {
    try {
        await client.connect();
        console.log('Connect to MongoDB successfully !!!');

        // select collection
        ordersCollection = client.db(dbName).collection(collectionName);

        let maxId = 0;
        for (let i = 9; i < ordersCollection.length; i++) {
            const newId = orderID = parseInt(ordersCollection[i].orderID.substring(5));
            if(orderID > maxId) {
                maxId = orderID;
            }
        }

        const newId = 'OD2024' + String(maxId + 1).padStart(4, '0');
        return newId;
    } catch (err){
        console.error('Error', err);
    } finally {
        if(client) {
            await client.close();
            console.log('MongoDB connection closed')
        }
    }
}

async function addManyOrders(orders) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!!');
        const ordersCollection = client.db(dbName).collection(collectionName);

        // Thêm dữ liệu vào collection
        const result = await ordersCollection.insertMany(orders);
        console.log(`${result.insertedCount} orders inserted successfully.`);

    } catch (err) {
        console.error('Error: ', err);
    } finally {
        // Đóng kết nối
        await client.close();
    }
}

async function deleteOrder(orderID) {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully !!!');
        
        ordersCollection = client.db(dbName).collection(collectionName);
        
        const result = await ordersCollection.deleteOne({ orderID: orderID });
        
        if (result.deletedCount === 1) {
            console.log('Order with ID', orderID, 'deleted successfully');
        } else {
            console.log('Order with ID', orderID, 'not found');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

// deleteOrder("OD20240003")

async function updateOrder(orderID, updatedData) {
    try {
        await client.connect();
        console.log('Connected to MongoorderIDToUpdateDB successfully !!!');
        
        ordersCollection = client.db(dbName).collection(collectionName);
        
        const result = await ordersCollection.updateOne(
            { orderID: orderID },
            { $set: updatedData }
        );
        
        if (result.modifiedCount === 1) {
            console.log('Order with ID', orderID, 'updated successfully');
        } else {
            console.log('Order with ID', orderID, 'not found');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

async function updateManyOrders(key, updatedData) {
    try {
        await client.connect();
        console.log('Connect to MongoDB successfully!!!');
        
        // Select collection
        const ordersCollection = client.db(dbName).collection(collectionName);

        // Thực hiện cập nhật
        const update = await ordersCollection.updateMany(
            { orderStatus: { $regex: new RegExp(key, 'i') } }, // Điều kiện tìm kiếm
            { $set: { orderStatus: updatedData } } // Dữ liệu cập nhật
        );

        // Kiểm tra xem có bản ghi nào được cập nhật không
        if (update.modifiedCount === 0) {
            throw new Error('Order not found to update');
        }
        console.log('Order updated successfully!!!');
    } catch (err) {
        console.log('Error:', err);
    } finally {
        // Đảm bảo đóng kết nối sau khi hoàn thành
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
}

async function output(orders) {
    try {
        let tableRowsHTML = '';
        
        orders.forEach(order => {
            tableRowsHTML += `
                <tr>
                    <td>${order.orderID}</td>
                    <td>${order.orderDate}</td>
                    <td>$${order.totalAmount}</td>
                    <td>${order.orderStatus}</td>
                    <td>${order.paymentMethod}</td>
                    <td><img src="/images/${order.image}" alt="Order Image"></td>
                </tr>
            `;
        });

        return `
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
                    </tr>
                    ${tableRowsHTML}
                </table>
            </body>
            </html>
        `;
    } catch (error) {
        console.error('Error:', error);
        return 'Failed to generate order list';
    }
}

async function getOrderById(orderID) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully!!!');
        const ordersCollection = client.db(dbName).collection(collectionName);
        const query = { orderID: { $regex: orderID, $options: 'i' } };
        const editOrder = await ordersCollection.findOne(query);
        return editOrder;
    } catch (err) {
        console.error('Error in getOrderById:', err);
        throw err;
    } finally {
        await client.close();
    }
}

module.exports = {
    connectToMongoDB,
    closeMongoDBConnection,
    findDocuments,
    findOrder,
    addOrder,
    addManyOrders,
    deleteOrder,
    updateOrder,
    updateManyOrders,
    output,
    getOrderById,
    dbCollection,
    findOrderList,
}