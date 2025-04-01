pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
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
                // Check Node.js version
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
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Create Environment File') {
            steps {
                sh '''
                    echo "Creating .env file for the build..."
                    echo "MONGODB_URI=$MONGODB_URI" > .env
                    echo "MONGO_DB_NAME=$MONGO_DB_NAME" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=$MONGO_COLLECTION_PROJECTS" >> .env
                    
                    echo ".env file created (showing non-sensitive parts):"
                    grep -v "MONGODB_URI" .env
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "Starting build process..."
                    
                    # Export environment variables and run build
                    export $(grep -v '^#' .env | xargs)
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
                    npm install -g vercel || npm install vercel
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
                    echo "Deploying to Vercel..."
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
            cleanWs(cleanWhenNotBuilt: true,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    patterns: [[pattern: '.env', type: 'INCLUDE'],
                               [pattern: 'vercel.json', type: 'INCLUDE'],
                               [pattern: 'node_modules', type: 'INCLUDE']])
        }
    }
}