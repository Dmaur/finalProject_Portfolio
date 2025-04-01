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
        stage('Setup Environment') {
            steps {
                // Check if Node.js is available in the Docker container
                sh 'node -v || echo "Node.js not found, will use Jenkins tool installation"'
                sh 'npm -v || echo "npm not found, will use Jenkins tool installation"'
            }
        }
        
        stage('Checkout') {
            steps {
                // Checkout code from GitHub
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install all dependencies
                sh 'npm install'
            }
        }
        
        stage('Linting') {
            steps {
                // Run ESLint as specified in your package.json
                sh 'npm run lint'
            }
        }
        
        stage('Verify Env') {
            steps {
                sh '''
                    echo "Checking environment variables..."
                    
                    if [ -z "$MONGODB_URI" ]; then
                        echo "ERROR: MONGODB_URI is empty!"
                    else
                        echo "MONGODB_URI exists and is not empty"
                        echo "First 12 chars: $(echo $MONGODB_URI | cut -c1-12)"
                        echo "Length: $(echo $MONGODB_URI | wc -c) characters"
                    fi
                    
                    echo "MONGO_DB_NAME=$MONGO_DB_NAME"
                    echo "MONGO_COLLECTION_PROJECTS=$MONGO_COLLECTION_PROJECTS"
                    
                    # Create a test file to check how environment variables are being set
                    echo "MONGODB_URI=$MONGODB_URI" > test-env.txt
                    echo "Content of test-env.txt file:"
                    cat test-env.txt
                '''
            }
        }
        
        stage('Build') {
            steps {
                // Create .env file with environment variables for build
                sh '''
                    echo "Creating .env file..."
                    echo "MONGODB_URI=\"$MONGODB_URI\"" > .env
                    echo "MONGO_DB_NAME=\"$MONGO_DB_NAME\"" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=\"$MONGO_COLLECTION_PROJECTS\"" >> .env
                    
                    # Check .env file
                    echo "Content of .env file (masking sensitive info):"
                    cat .env | sed 's/MONGODB_URI=.*/MONGODB_URI=****/'
                '''
                
                // Create a debug file in the app to check MongoDB connection
                sh '''
                    # Create a temporary debug file
                    cat > debug-mongo.js << EOF
console.log('Debugging MongoDB connection...');
const { MongoClient } = require('mongodb');

// This should log the actual connection string for debugging
console.log('Connection string starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 12) : 'undefined');
console.log('Connection string length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);

// Check for quotes or other issues
console.log('Raw value:', JSON.stringify(process.env.MONGODB_URI));
EOF

                    # Run the debug file
                    echo "Running MongoDB connection debug script..."
                    node debug-mongo.js
                '''
                
                // Use env file for Next.js build with explicit loading
                sh '''
                    # Ensure Next.js loads the .env file
                    export $(cat .env | xargs)
                    
                    # Try building with different environment passing methods
                    NODE_OPTIONS="--max-old-space-size=4096" \
                    MONGODB_URI="$MONGODB_URI" \
                    MONGO_DB_NAME="$MONGO_DB_NAME" \
                    MONGO_COLLECTION_PROJECTS="$MONGO_COLLECTION_PROJECTS" \
                    npm run build
                '''
            }
        }
        
        stage('Deploy to Vercel') {
            when {
                branch 'main' // Only deploy when changes are on main branch
            }
            steps {
                // Install Vercel CLI in a way that works in Docker
                sh '''
                    # Try to install globally first, if it fails use local installation
                    npm install -g vercel || npm install vercel
                    
                    # Create a path to node_modules/.bin if using local installation
                    export PATH="$PATH:$(pwd)/node_modules/.bin"
                '''
                
                // Create a Vercel project configuration file with production settings
                sh '''
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
                '''
                
                // Deploy to Vercel using token with fallback to local installation
                sh '''
                    # Try global vercel first, fall back to local
                    vercel --token ${VERCEL_TOKEN} --prod --confirm || \
                    ./node_modules/.bin/vercel --token ${VERCEL_TOKEN} --prod --confirm
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully! Your Next.js portfolio has been deployed to Vercel.'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for more information.'
        }
        always {
            // Clean workspace after build
            cleanWs(cleanWhenNotBuilt: true,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    patterns: [[pattern: '.env', type: 'INCLUDE'],
                               [pattern: 'vercel.json', type: 'INCLUDE'],
                               [pattern: 'node_modules', type: 'INCLUDE']])
        }
    }
}