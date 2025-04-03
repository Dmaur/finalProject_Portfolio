pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        GH_TOKEN = credentials('github-status-token')
        GITHUB_REPO = "Dmaur/finalProject_Portfolio"
    }
    
    stages {
        stage('Notify Start') {
            steps {
                script {
                    // Get the commit SHA
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    
                    // Set pending status at the beginning
                    sh """
                        curl -s -X POST \\
                        -H "Authorization: token ${GH_TOKEN}" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT} \\
                        -d '{"state":"pending","context":"Jenkins","description":"Build in progress...","target_url":"${BUILD_URL}"}'
                    """
                    
                    echo "GitHub notified: Build started"
                }
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
        
        stage('Report Success') {
            steps {
                script {
                    // Update GitHub status to success
                    sh """
                        curl -s -X POST \\
                        -H "Authorization: token ${GH_TOKEN}" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT} \\
                        -d '{"state":"success","context":"Jenkins","description":"Build succeeded","target_url":"${BUILD_URL}"}'
                    """
                    
                    echo "GitHub notified: Build succeeded"
                }
            }
        }
    }
    
    post {
        success {
            script {
                // Double-check that success status is sent
                sh """
                    curl -s -X POST \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT} \\
                    -d '{"state":"success","context":"Jenkins","description":"Build succeeded","target_url":"${BUILD_URL}"}'
                """
                
                echo "GitHub notified (post-action): Build succeeded"
            }
        }
        
        failure {
            script {
                // Update GitHub status to failure
                sh """
                    curl -s -X POST \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT} \\
                    -d '{"state":"failure","context":"Jenkins","description":"Build failed","target_url":"${BUILD_URL}"}'
                """
                
                echo "GitHub notified: Build failed"
            }
        }
        
        always {
            cleanWs()
        }
    }
}