pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // This assumes you've configured NodeJS in Jenkins global tools
    }
    
    environment {
        // Environment variables
        MONGODB_URI = credentials('MONGODB_URI')
        MONGO_DB_NAME = 'dbProjects'
        MONGO_COLLECTION_PROJECTS = 'projects'
        VERCEL_TOKEN = credentials('vercel-token')
    }
    
    stages {
        stage('Setup') {
            steps {
                // Check if Node.js is available
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
        
        stage('Test MongoDB Connection') {
            steps {
                // Create MongoDB test file
                sh '''
                    cat > mongodb-test.js << EOF
const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 12) + '...' : 'undefined');
  
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is undefined or empty');
    process.exit(1);
  }
  
  try {
    // Remove any quotes that might be wrapping the URL
    const cleanUri = process.env.MONGODB_URI.replace(/^["'](.*)["']$/, '$1');
    console.log('Cleaned URI starts with:', cleanUri.substring(0, 12) + '...');
    
    const client = new MongoClient(cleanUri);
    await client.connect();
    console.log('MongoDB connection successful!');
    await client.close();
    console.log('Connection test completed successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

testConnection().catch(console.error);
EOF
                '''
                
                // Run MongoDB test with the environment variable
                sh '''
                    echo "Creating .env file for testing..."
                    echo "MONGODB_URI=$MONGODB_URI" > .env
                    echo "MONGO_DB_NAME=$MONGO_DB_NAME" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=$MONGO_COLLECTION_PROJECTS" >> .env
                    
                    echo "Testing MongoDB connection directly..."
                    MONGODB_URI="$MONGODB_URI" node mongodb-test.js
                '''
            }
        }
        
        stage('Build With MongoDB Debug') {
            steps {
                // Create a .env file with quotes around values to handle special characters
                sh '''
                    echo "Creating .env file for build..."
                    echo "MONGODB_URI='$MONGODB_URI'" > .env
                    echo "MONGO_DB_NAME='$MONGO_DB_NAME'" >> .env
                    echo "MONGO_COLLECTION_PROJECTS='$MONGO_COLLECTION_PROJECTS'" >> .env
                    
                    # Source the .env file to ensure variables are in the environment
                    export $(grep -v '^#' .env | xargs -d '\n')
                    
                    # Build with explicit environment variables
                    MONGODB_URI='$MONGODB_URI' MONGO_DB_NAME='$MONGO_DB_NAME' MONGO_COLLECTION_PROJECTS='$MONGO_COLLECTION_PROJECTS' npm run build
                '''
            }
        }
        
        stage('Deploy to Vercel') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    npm install -g vercel || npm install vercel
                    export PATH="$PATH:$(pwd)/node_modules/.bin"
                    
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
                    
                    vercel --token ${VERCEL_TOKEN} --prod --confirm || ./node_modules/.bin/vercel --token ${VERCEL_TOKEN} --prod --confirm
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