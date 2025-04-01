pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        MONGODB_URI = credentials('MONGODB_URI')
        MONGO_DB_NAME = 'dbProjects'
        MONGO_COLLECTION_PROJECTS = 'projects'
        VERCEL_TOKEN = credentials('vercel-token')
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
        
        stage('Prepare Next.js Environment') {
            steps {
                sh '''
                    echo "Setting up Next.js environment files..."
                    
                    # Create .env.local file - Next.js prefers this for local environment variables
                    echo "MONGODB_URI=$MONGODB_URI" > .env.local
                    echo "MONGO_DB_NAME=$MONGO_DB_NAME" >> .env.local
                    echo "MONGO_COLLECTION_PROJECTS=$MONGO_COLLECTION_PROJECTS" >> .env.local
                    
                    # Also create regular .env file for compatibility
                    cp .env.local .env
                    
                    # Create next.config.js with environment variables explicitly set
                    cat > next.config.mjs << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: '${MONGODB_URI}',
    MONGO_DB_NAME: '${MONGO_DB_NAME}',
    MONGO_COLLECTION_PROJECTS: '${MONGO_COLLECTION_PROJECTS}'
  }
};

export default nextConfig;
EOF
                    
                    echo "Environment files prepared"
                '''
            }
        }
        
        stage('Create Database Utility') {
            steps {
                sh '''
                    echo "Creating database utility file..."
                    
                    # Create directory structure if needed
                    mkdir -p lib
                    
                    # Create a db.js utility file for MongoDB connections
                    cat > lib/db.js << EOF
import { MongoClient } from 'mongodb';

// Get MongoDB connection string from Next.js config or environment
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGO_DB_NAME || 'dbProjects';

// For debugging
console.log('MongoDB connection environment check:');
console.log('MONGODB_URI defined:', !!process.env.MONGODB_URI);
console.log('MONGO_DB_NAME:', process.env.MONGO_DB_NAME);

// Validate connection string
if (!uri) {
  throw new Error('Please define MONGODB_URI environment variable');
}

// Connection caching
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Example function to get projects
export async function getProjects() {
  const { db } = await connectToDatabase();
  return db.collection('projects').find({}).toArray();
}
EOF
                    
                    echo "Database utility file created"
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "Starting Next.js build process..."
                    
                    # Build with environment variables explicitly set
                    MONGODB_URI="$MONGODB_URI" \
                    MONGO_DB_NAME="$MONGO_DB_NAME" \
                    MONGO_COLLECTION_PROJECTS="$MONGO_COLLECTION_PROJECTS" \
                    NODE_OPTIONS="--max-old-space-size=4096" \
                    npm run build
                '''
            }
        }
        
        stage('Deploy to Vercel') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    echo "Setting up Vercel deployment..."
                    
                    # Install Vercel CLI
                    npm install vercel
                    export PATH="$PATH:$(pwd)/node_modules/.bin"
                    
                    # Create Vercel config
                    cat > vercel.json << EOF
                    {
                        "version": 2,
                        "builds": [
                            {
                                "src": "package.json",
                                "use": "@vercel/next"
                            }
                        ],
                        "env": {
                            "MONGODB_URI": "${MONGODB_URI}",
                            "MONGO_DB_NAME": "${MONGO_DB_NAME}",
                            "MONGO_COLLECTION_PROJECTS": "${MONGO_COLLECTION_PROJECTS}"
                        }
                    }
                    EOF
                    
                    # Deploy to Vercel
                    ./node_modules/.bin/vercel --token ${VERCEL_TOKEN} --prod --confirm || echo "Vercel deployment failed but continuing pipeline"
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for more information.'
        }
        always {
            cleanWs()
        }
    }
}