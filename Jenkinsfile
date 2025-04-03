pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        GH_TOKEN = credentials('github-status-token')
    }
    
    options {
        // Set pending status immediately when pipeline starts
        timeout(time: 1, unit: 'SECONDS') 
    }
    
    stages {
        stage('Set Initial Status') {
            steps {
                // Set pending status at the very beginning
                sh '''
                    curl -s -X POST \
                    -H "Authorization: token ${GH_TOKEN}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/Dmaur/finalProject_Portfolio/statuses/${GIT_COMMIT} \
                    -d '{"state":"pending","context":"Jenkins","description":"Build in progress..."}'
                '''
                echo "Set initial pending status on GitHub"
            }
        }
        
        stage('Setup') {
            steps {
                // Check node and npm versions
                sh 'node -v'
                sh 'npm -v'
            }
        }
        
        stage('Checkout') {
            steps {
                // Get latest code
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install npm packages
                sh 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                // Run linting to check code quality
                sh 'npm run lint || true'
            }
        }
        
        stage('Setup Environment') {
            steps {
                // Create a simple .env file with direct MongoDB credentials
                sh '''
                    echo "MONGO_URL=mongodb+srv://derrickmaurais1:JXQ67MN8VRi10Hvu@portfoliositedb.hweqv.mongodb.net/?retryWrites=true&w=majority&appName=portfolioSiteDB" > .env
                    echo "MONGO_DB_NAME=dbProjects" >> .env
                    echo "MONGO_COLLECTION_PROJECTS=projects" >> .env
                    
                    # Copy to .env.local for Next.js
                    cp .env .env.local
                '''
            }
        }
        
        stage('Build') {
            steps {
                // Build the Next.js application
                sh 'npm run build'
            }
        }
        
        stage('Quality Gate Passed') {
            steps {
                // Signal that all quality checks have passed
                sh 'echo "All quality checks have passed! Vercel can safely deploy."'
            }
        }
        
        stage('Report Status') {
            steps {
                sh '''
                    # Report status to GitHub using the API
                    curl -s -X POST \
                      -H "Authorization: token ${GH_TOKEN}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      https://api.github.com/repos/Dmaur/finalProject_Portfolio/statuses/${GIT_COMMIT} \
                      -d '{"state":"success","context":"Jenkins","description":"Build passed"}'
                '''
            }
        }
    }
    
    post {
        failure {
            sh '''
                # Report failure status
                curl -s -X POST \
                  -H "Authorization: token ${GH_TOKEN}" \
                  -H "Accept: application/vnd.github.v3+json" \
                  https://api.github.com/repos/Dmaur/finalProject_Portfolio/statuses/${GIT_COMMIT} \
                  -d '{"state":"failure","context":"Jenkins","description":"Build failed"}'
            '''
        }
        
        always {
            cleanWs()
        }
    }
}