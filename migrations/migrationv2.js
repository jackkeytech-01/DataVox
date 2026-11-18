
require('dotenv').config({
  path: require('path').resolve(__dirname, '../config.env')
});
const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust path if necessary

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI_ON);

    console.log('Connected to MongoDB.');
    console.log('Starting migration to schema version 2...');

    const defaultStoreFields = [
      {
        title: 'Name',
        holder: 'Product Name',
        unit: '',
        show: true
      },
      {
        title: 'ID',
        holder: 'Product ID',
        unit: '',
        show: true
      },
      {
        title: 'Quantity',
        holder: 'Quantity',
        unit: 'pcs',
        show: true
      },
      {
        title: 'Whole Price',
        holder: 'Product Whole Price',
        unit: 'TZS',
        show: true
      },
      {
        title: 'Whole From',
        holder: 'Whole Price from',
        unit: 'pcs',
        show: true
      },
      {
        title: 'Running Alert',
        holder: 'e.g. 10',
        unit: 'pcs',
        show: true
      },
      {
        title: 'Retail Price',
        holder: 'e.g. 1000',
        unit: 'TZS',
        show: true
      }
    ];

    const result = await User.collection.updateMany(
      {},
      [
        {
          $set: {
            phone: {
              $ifNull: ['$phone', '']
            },

            isFreezed: {
              $ifNull: ['$isFreezed', false]
            },

            sockets: {
              $ifNull: ['$sockets', []]
            },

            'store_security.isLocked': {
              $ifNull: ['$store_security.isLocked', false]
            },

            'store_security.adminOnly': {
              $ifNull: ['$store_security.adminOnly', false]
            },

            store_fields: {
              $cond: [
                {
                  $or: [
                    { $eq: [{ $type: '$store_fields' }, 'missing'] },
                    { $eq: ['$store_fields', null] },
                    {
                      $and: [
                        { $isArray: '$store_fields' },
                        { $eq: [{ $size: '$store_fields' }, 0] }
                      ]
                    }
                  ]
                },
                { $literal: defaultStoreFields },
                '$store_fields'
              ]
            },

            bin: {
              $ifNull: ['$bin', []]
            },

            schemaVersion: {
              $max: [
                { $ifNull: ['$schemaVersion', 0] },
                2
              ]
            }
          }
        }
      ]
    );

    console.log('Migration completed successfully!');
    console.log('Matched users:', result.matchedCount);
    console.log('Modified users:', result.modifiedCount);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
}

migrateUsers();
