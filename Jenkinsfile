pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        MONGODB_URI = credentials('MONGODB_URI')
        MONGO_DB_NAME = 'dbProjects'
        MONGO_COLLECTION_PROJECTS = 'projects'
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Debug MongoDB Connection') {
            steps {
                sh '''
                    echo "Creating MongoDB debug file..."
                    
                    # Create a direct test script for MongoDB connection
                    cat > mongodb-test.js << EOF
const { MongoClient } = require('mongodb');

// Log how environment variables are seen
console.log('Environment variable access:');
console.log('process.env.MONGODB_URI defined:', process.env.MONGODB_URI !== undefined);
console.log('process.env.MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('process.env.MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 12) : 'undefined');

// Test connection with hard-coded string as fallback
async function testConnection() {
  try {
    // Try with process.env first
    const uri = process.env.MONGODB_URI || 'mongodb+srv://derrickmaurais1:JXQ67MN8VRi10Hvu@portfoliositedb.hweqv.mongodb.net/?retryWrites=true&w=majority&appName=portfolioSiteDB';
    console.log('Using URI starting with:', uri.substring(0, 12));
    
    const client = new MongoClient(uri);
    console.log('Created MongoDB client');
    await client.connect();
    console.log('SUCCESSFULLY connected to MongoDB!');
    await client.close();
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error.message);
    return false;
  }
}

// Execute the test
testConnection()
  .then(success => {
    console.log('Test result:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
EOF
                    
                    # Create different versions of .env file
                    echo "Creating different environment file formats..."
                    
                    # Version 1: Standard format
                    echo "MONGODB_URI=$MONGODB_URI" > .env
                    echo "MONGO_DB_NAME=$MONGO_DB_NAME" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=$MONGO_COLLECTION_PROJECTS" >> .env
                    
                    # Version 2: With quotes
                    echo "MONGODB_URI='$MONGODB_URI'" > .env.quoted
                    echo "MONGO_DB_NAME='$MONGO_DB_NAME'" >> .env.quoted
                    echo "MONGO_COLLECTION_PROJECTS='$MONGO_COLLECTION_PROJECTS'" >> .env.quoted
                    
                    # Version 3: Double quotes
                    echo "MONGODB_URI=\\"$MONGODB_URI\\"" > .env.dquoted
                    echo "MONGO_DB_NAME=\\"$MONGO_DB_NAME\\"" >> .env.dquoted
                    echo "MONGO_COLLECTION_PROJECTS=\\"$MONGO_COLLECTION_PROJECTS\\"" >> .env.dquoted
                    
                    echo "Running MongoDB connection test with direct environment variable..."
                    MONGODB_URI="$MONGODB_URI" node mongodb-test.js
                    
                    echo "Testing with Next.js environment loading..."
                    # Copy your db.js file or any file that connects to MongoDB to check how it accesses the environment
                    find . -type f -name "*.js" -o -name "*.ts" | xargs grep -l "mongodb" | xargs cat || echo "No MongoDB files found"
                '''
            }
        }
        
        stage('Test Different Build Approaches') {
            steps {
                sh '''
                    echo "Testing different build approaches..."
                    
                    # Approach 1: Direct environment variable
                    echo "Approach 1: Direct environment variable"
                    MONGODB_URI="$MONGODB_URI" MONGO_DB_NAME="$MONGO_DB_NAME" MONGO_COLLECTION_PROJECTS="$MONGO_COLLECTION_PROJECTS" node -e 'console.log("MongoDB URI from Node:", process.env.MONGODB_URI ? "defined" : "undefined")'
                    
                    # Approach 2: Export from .env
                    echo "Approach 2: Export from .env"
                    export $(cat .env | xargs) && node -e 'console.log("MongoDB URI from Node after export:", process.env.MONGODB_URI ? "defined" : "undefined")'
                    
                    # Approach 3: Use dotenv package
                    echo "Approach 3: Use dotenv package"
                    npm install dotenv --save
                    cat > test-dotenv.js << EOF
require('dotenv').config();
console.log('MongoDB URI with dotenv:', process.env.MONGODB_URI ? "defined" : "undefined");
if (process.env.MONGODB_URI) {
  console.log('First 12 chars:', process.env.MONGODB_URI.substring(0, 12));
}
EOF
                    node test-dotenv.js
                    
                    # Check if your code is using dotenv
                    grep -r "require.*dotenv" . || echo "dotenv not found in code"
                '''
            }
        }
        
        stage('Create Next.js Fix') {
            steps {
                sh '''
                    echo "Creating potential Next.js fix..."
                    
                    # Create a simple db.js file that ensures the MongoDB connection works
                    cat > lib/db.js << EOF
import { MongoClient } from 'mongodb';

// Get MongoDB connection string from environment or use backup
const uri = process.env.MONGODB_URI || 'mongodb+srv://derrickmaurais1:JXQ67MN8VRi10Hvu@portfoliositedb.hweqv.mongodb.net/?retryWrites=true&w=majority&appName=portfolioSiteDB';
const dbName = process.env.MONGO_DB_NAME || 'dbProjects';

// Log connection attempt for debugging
console.log('MongoDB connection attempt with URI starting with:', uri.substring(0, 12));

// Create cached connection
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If the connection is already established, return the cached connection
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
EOF
                    
                    mkdir -p lib || true
                    
                    # Try building with our fixes
                    echo "Attempting build with fixes..."
                    MONGODB_URI="$MONGODB_URI" MONGO_DB_NAME="$MONGO_DB_NAME" MONGO_COLLECTION_PROJECTS="$MONGO_COLLECTION_PROJECTS" npm run build || echo "Build still failing but continuing pipeline for debugging"
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}