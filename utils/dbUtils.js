import { MongoClient } from 'mongodb';
import pkg from 'mssql';
const { ConnectionPool } = pkg;

// SQL Server Configuration
export const sqlConfig = {
  user: process.env.SQL_USER || 'execUser',
  password: process.env.SQL_PASSWORD || 'ZLj8n7Th8jRQ',
  server: process.env.SQL_HOST || '192.168.88.21',
  port: process.env.SQL_PORT || 1433,
  database: process.env.SQL_DATABASE || 'XOLOGDB',
  options: {
    encrypt: false, // For Azure
    trustServerCertificate: true // For local dev
  },
  connectionTimeout: 60000, // 60 seconds
  requestTimeout: 300000 // 5 minutes
};

// MongoDB Configuration
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://192.168.88.22:27017',
  dbName: process.env.MONGODB_DB || 'xologdb'
};

const mongoClient = new MongoClient(mongoConfig.uri);
const dbName = mongoConfig.dbName;

// Execute SQL Stored Procedure and return JSON
async function executeStoredProc(procedureName, params = {}) { 
  // Validate SQL configuration only during runtime
  if (!process.env.SQL_USER || !process.env.SQL_PASSWORD || !process.env.SQL_HOST || !process.env.SQL_DATABASE) {
    throw new Error('Missing required SQL Server environment variables');
  }

  let pool = null;

  try {
    pool = await new ConnectionPool(sqlConfig).connect();
    
    const request = pool.request();

    // Add parameters dynamically
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.query(`EXEC ${procedureName}`);

    if (!result.recordset || result.recordset.length === 0) {
      console.warn(`⚠️  Stored procedure ${procedureName} returned empty recordset`);
      return [];
    }

    const jsonColumn = Object.keys(result.recordset[0])[0];
    const jsonResult = result.recordset[0][jsonColumn];
    
    if (jsonResult === undefined || jsonResult === null) {
      console.warn(`⚠️  Procedure ${procedureName} returned undefined or null JSON`);
      return [];
    }

    // Parse the JSON string and ensure we return an array
    try {
      const parsedResult = JSON.parse(jsonResult);

      // Ensure we always return an array, even if the result is a single object
      const finalResult = Array.isArray(parsedResult) ? parsedResult : [parsedResult];
      return finalResult;

    } catch (parseError) {
      console.error(`❌ Error parsing JSON from ${procedureName}:`, parseError);
      console.error(`Raw JSON result:`, jsonResult);
      throw new Error(`Failed to parse JSON result from ${procedureName}: ${parseError}`);
    }
  } catch (error) {
    console.error(`❌ Error in executeStoredProc for ${procedureName}:`, error);
    throw error;
  } finally {
    // Close the pool if it exists
    if (pool) {
      await pool.close();
    }
  }
}

// Save JSON data to MongoDB
async function saveToMongoDB(collectionName, data, skipDeleteJobStatus = false) {
  try {
    // Validate data before proceeding
    if (!Array.isArray(data)) {
      throw new Error(`Expected array of documents, got: ${typeof data}`);
    }
    if (data.length === 0) {
      return;
    }
    
  // Validate MongoDB connection
    if (!mongoClient) {
      throw new Error('MongoClient is not initialized');
    }
    
    // Connect to MongoDB with retry
    let isConnected = false;
    const maxRetries = 3;
    let retryCount = 0;
    
    while (!isConnected && retryCount < maxRetries) {
      try {
        await mongoClient.connect();
        isConnected = true;

      } catch (connectError) {
        retryCount++;
        console.error(`Failed to connect to MongoDB (attempt ${retryCount}/${maxRetries}):`, connectError);
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    // Get database and collection
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    
    // Clear existing collection with retry
    let clearSuccess = false;
    retryCount = 0;
    
    while (!clearSuccess && retryCount < maxRetries) {
      try {
        if (skipDeleteJobStatus) {
          console.log("Skip Deleting Collection Name:", collectionName);
          collectionName = "jobstatus";
        }else{
        await collection.deleteMany({});
        console.log("Deleting Collection Name:", collectionName);
      }
        //console.log(`Cleared collection ${collectionName}:`, {
        //  deletedCount: deleteResult.deletedCount,
        //  acknowledged: deleteResult.acknowledged
        //});
        clearSuccess = true;
      } catch (deleteError) {
        retryCount++;
        console.error(`Failed to clear collection (attempt ${retryCount}/${maxRetries}):`, deleteError);
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to clear collection ${collectionName} after ${maxRetries} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    // Normalize data: only keep plain objects as documents
    const docs = data.filter((item) => {
      const isValid = item !== null && typeof item === 'object' && !Array.isArray(item);
      if (!isValid) {
        console.log(`❌ Filtered out invalid item: type=${typeof item}, isNull=${item === null}, isArray=${Array.isArray(item)}`);
      }
      return isValid;
    });
        
    if (docs.length === 0) {
      console.warn(`⚠️  No valid document objects to insert for collection ${collectionName}. Original items: ${data.length}`);
      console.warn(`Sample of filtered data:`, data.slice(0, 3));
      return;
    }
    
    // Insert new documents with retry
    let insertSuccess = false;
    retryCount = 0;
    
    while (!insertSuccess && retryCount < maxRetries) {
      try {
        const insertResult = await collection.insertMany(docs);
        insertSuccess = true;
      } catch (insertError) {
        retryCount++;
        console.error(`❌ Failed to insert documents (attempt ${retryCount}/${maxRetries}):`, insertError);
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to insert documents into ${collectionName} after ${maxRetries} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

  } catch (error) {
    console.error(`Error in saveToMongoDB for collection ${collectionName}:`, error);
    throw error;
  } finally {
    try {
      if (mongoClient) {
        await mongoClient.close();
      }
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

async function updateJobStatuses() {
  try {    
    const client = await mongoClient.connect();
    const db = client.db(dbName);
    const collection = db.collection('jobstatus');

    await collection.updateMany(
      { Ata: { $type: "string" } },
      [
        {
          $set: {
            Ata: { $dateFromString: { dateString: "$Ata" } }
          }
        }
      ]
    );

  } catch (error) {
    console.error("Error updating job statuses:", error);
    throw error;
  }
}

export { executeStoredProc, saveToMongoDB, updateJobStatuses };
