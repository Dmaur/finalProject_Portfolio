pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // This assumes you've configured NodeJS in Jenkins global tools
    }
    
    environment {
        // Environment variables
        MONGODB_URI = credentials('MONGO_URL') // This will be stored in Jenkins credentials
        MONGO_DB_NAME = 'dbProjects'
        MONGO_COLLECTION_PROJECTS = 'projects'
        VERCEL_TOKEN = credentials('vercel-token') // This will be stored in Jenkins credentials
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
        
        stage('Build') {
            steps {
                // Create .env file with environment variables for build
                sh '''
                    echo "MONGODB_URI=${MONGODB_URI}" > .env
                    echo "MONGO_DB_NAME=${MONGO_DB_NAME}" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=${MONGO_COLLECTION_PROJECTS}" >> .env
                '''
                
                // Build Next.js application
                sh 'npm run build'
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