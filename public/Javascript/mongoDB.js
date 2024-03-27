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
        console.log('Connect to MongoDB successfully !!!');
    } catch (err) {
        console.error('Error: ',err);
    } finally{
        if(client){
            await client.connect();
            console.log('MongoDB connection closed');
        }
    }
}

connectToMongoDB()

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

// Dữ liệu orders để thêm vào
const orders = [
    { "orderID": "OD20240021", "orderDate": "2024-02-13", "totalAmount": 220.00, "orderStatus": "Processing", "paymentMethod": "Credit Card", "image": "14.jpg" },
    { "orderID": "OD20240022", "orderDate": "2024-02-14", "totalAmount": 80.75, "orderStatus": "Pending", "paymentMethod": "Cash on Delivery", "image": "15.jpg" },
    // Thêm dữ liệu tiếp theo tại đây nếu cần
];

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

updateManyOrders("Deliver", "Success");

findOrder()