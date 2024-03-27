const express = require('express')
const path = require('path')
const app = express()
const port = 3000

let orders = [
    { orderID: "OD20240001", orderDate: "2024-01-24", totalAmount: 150.50, orderStatus: "Processing", paymentMethod: "Credit Card", image: "a.jpg" },
    { orderID: "OD20240002", orderDate: "2024-01-25", totalAmount: 200.75, orderStatus: "Shipped", paymentMethod: "PayPal", image: "b.jpg"},
    { orderID: "OD20240003", orderDate: "2024-01-26", totalAmount: 75.00, orderStatus: "Delivered", paymentMethod: "Cash on Delivery", image: "c.jpg" },
    { orderID: "OD20240004", orderDate: "2024-01-27", totalAmount: 120.25, orderStatus: "Cancelled", paymentMethod: "Debit Card", image: "d.jpg" },
    { orderID: "OD20240005", orderDate: "2024-01-28", totalAmount: 90.80, orderStatus: "Pending", paymentMethod: "Bank Transfer", image: "e.jpg" },
    { orderID: "OD20240006", orderDate: "2024-01-29", totalAmount: 180.00, orderStatus: "Shipped", paymentMethod: "Google Pay", image: "f.jpg"},
    { orderID: "OD20240007", orderDate: "2024-01-30", totalAmount: 60.50, orderStatus: "Delivered", paymentMethod: "Credit Card", image: "g.jpg" },
    { orderID: "OD20240008", orderDate: "2024-01-31", totalAmount: 100.00, orderStatus: "Processing", paymentMethod: "PayPal", image: "1.jpg" },
    { orderID: "OD20240009", orderDate: "2024-02-01", totalAmount: 135.75, orderStatus: "Pending", paymentMethod: "Cash on Delivery", image: "2.jpg" },
    { orderID: "OD20240010", orderDate: "2024-02-02", totalAmount: 95.20, orderStatus: "Cancelled", paymentMethod: "Debit Card", image: "3.jpg" },
    { orderID: "OD20240011", orderDate: "2024-02-03", totalAmount: 120.00, orderStatus: "Shipped", paymentMethod: "Bank Transfer", image: "4.jpg" },
    { orderID: "OD20240012", orderDate: "2024-02-04", totalAmount: 85.50, orderStatus: "Delivered", paymentMethod: "Google Pay", image: "5.jpg" },
    { orderID: "OD20240013", orderDate: "2024-02-05", totalAmount: 170.25, orderStatus: "Processing", paymentMethod: "Credit Card", image: "6.jpg" },
    { orderID: "OD20240014", orderDate: "2024-02-06", totalAmount: 110.75, orderStatus: "Pending", paymentMethod: "Cash on Delivery", image: "8.jpg" },
    { orderID: "OD20240015", orderDate: "2024-02-07", totalAmount: 95.00, orderStatus: "Cancelled", paymentMethod: "PayPal", image: "9.jpg" },
    { orderID: "OD20240016", orderDate: "2024-02-08", totalAmount: 130.20, orderStatus: "Shipped", paymentMethod: "Debit Card", image: "10.jpg" },
    { orderID: "OD20240017", orderDate: "2024-02-09", totalAmount: 75.50, orderStatus: "Delivered", paymentMethod: "Bank Transfer", image: "11.png" },
    { orderID: "OD20240018", orderDate: "2024-02-10", totalAmount: 200.00, orderStatus: "Processing", paymentMethod: "Google Pay", image: "12.jpg" },
    { orderID: "OD20240019", orderDate: "2024-02-11", totalAmount: 150.75, orderStatus: "Pending", paymentMethod: "Credit Card", image: "13.jpg" },
    { orderID: "OD20240020", orderDate: "2024-02-12", totalAmount: 180.50, orderStatus: "Cancelled", paymentMethod: "Cash on Delivery", image: "7.jpg" }
] ;

function output() {
    let tableHtml = `
        <html>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <head>
                <title>Order List</title>
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
    `;

    orders.forEach(order => {
        tableHtml += `
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
    
    tableHtml += `
                </table>
            </body>
        </html>
    `;

    return tableHtml;
}

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

function add() {  
    const lastOrderID = orders[orders.length - 1].orderID;
    const newOrderID = 'ORDER' + String(parseInt(lastOrderID.substring(5)) + 1).padStart(5, '0');
        const newOrder = {orderID: newOrderID, orderDate: "2024-01-01", totalAmount: 199.25, orderStatus: "Cancelled", paymentMethod: "PayPal" , image: "1.jpg"};
        orders.push(newOrder);        
}

function deleteId(req, res) {
    const { orderID } = req.params;
    const index = orders.findIndex(order => order.orderID === orderID);
}

function searchOrders(searchValue) {
    const searchResult = orders.filter(order => order.orderID.startsWith(searchValue));
    return searchResult;
}


function addOrder(order) {
    orders.push(order);
}

module.exports = {
    orders,
    output,
    add,
    deleteId,
    searchOrders,
    addOrder,
}