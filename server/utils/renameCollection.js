const mongoose = require('mongoose');
require('dotenv').config();

async function renameCollection() {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // 2. Get the DB instance
        const db = mongoose.connection.db;

        // 3. List all collections to verify
        const collections = await db.listCollections().toArray();
        console.log('Current collections:', collections.map(c => c.name));

        // 4. Check if products exists and phones doesn't
        if (collections.some(c => c.name === 'products')) {
            if (!collections.some(c => c.name === 'phones')) {
                // 5. Rename the collection
                await db.collection('products').rename('phones');
                console.log('Successfully renamed collection from "products" to "phones"');

                // 6. Update all references in orders (if needed)
                await db.collection('orders').updateMany(
                    {},
                    [{
                        $set: {
                            "orderItems": {
                                $map: {
                                    input: "$orderItems",
                                    as: "item",
                                    in: {
                                        phone: "$$item.product", // Convert product ref to phone ref
                                        quantity: "$$item.quantity",
                                        price: "$$item.price"
                                    }
                                }
                            }
                        }
                    }]
                );
                console.log('Updated order references');
            } else {
                console.log('"phones" collection already exists');
            }
        } else {
            console.log('"products" collection not found');
        }
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

renameCollection();