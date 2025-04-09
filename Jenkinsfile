pipeline {
    agent any
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        GH_TOKEN = credentials('github-status-token')
        GITHUB_REPO = "Dmaur/finalProject_Portfolio"
        CONTEXT_NAME = "jenkins-portfolio-check"
        MONGO_URL = credentials('MONGODB_URI')
        MONGO_DB_NAME = "dbProjects"
        MONGO_COLLECTION_PROJECTS = "projects"
    }
    
    stages {
        stage('Debug') {
            steps {
                // Print build information for debugging
                sh 'echo "Jenkins job: ${JOB_NAME} #${BUILD_NUMBER}"'
                sh 'echo "Branch: ${BRANCH_NAME}"'
                sh 'echo "GIT_COMMIT: ${GIT_COMMIT}"'
                
                // Get more git information
                sh 'git log -1'
                sh 'git branch'
                
                // Check GitHub token permissions 
                sh '''
                    # Test GitHub token by making a simple API call
                    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    https://api.github.com/rate_limit)
                    
                    echo "GitHub API test status code: ${STATUS_CODE}"
                    
                    # Get current statuses for this commit
                    echo "Current GitHub statuses for this commit:"
                    curl -s \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    https://api.github.com/repos/${GITHUB_REPO}/statuses/${GIT_COMMIT} | grep -E '"context"|"state"'
                '''
            }
        }
        
        stage('Notify Start') {
            steps {
                // Explicitly get the commit SHA to ensure it's correct
                script {
                    // Use git command to get current commit SHA
                    env.CURRENT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    echo "Current commit SHA: ${CURRENT_COMMIT}"
                    
                    // Set pending status with better error handling
                    def statusCmd = """
                        curl -v -X POST \\
                        -H "Authorization: token ${GH_TOKEN}" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        -H "Content-Type: application/json" \\
                        https://api.github.com/repos/${GITHUB_REPO}/statuses/${CURRENT_COMMIT} \\
                        -d '{"state": "pending", "context": "${CONTEXT_NAME}", "description": "Build in progress...", "target_url": "${BUILD_URL}"}'
                    """
                    
                    def response = sh(script: statusCmd, returnStdout: true).trim()
                    echo "GitHub API response: ${response}"
                }
                
                echo "GitHub notified: Build started"
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup & Dependencies') {
            parallel {
                stage('Node Setup') {
                    steps {
                        sh 'node -v'
                        sh 'npm -v'
                    }
                }
                
                stage('Install Dependencies') {
                    steps {
                        sh 'npm ci'
                    }
                }
                
                stage('Setup Environment') {
                    steps {
                         // Create .env file without echoing credentials
                        withCredentials([string(credentialsId: 'MONGODB_URI', variable: 'MONGODB_URI')]) {
                            sh '''
                                # Write to .env file without echoing to console
                                cat > .env << EOL
MONGO_URL=${MONGODB_URI}
MONGO_DB_NAME=${MONGO_DB_NAME}
MONGO_COLLECTION_PROJECTS=${MONGO_COLLECTION_PROJECTS}
EOL
                
                                # Copy to .env.local for Next.js
                                cp .env .env.local
                
                                # Confirm files were created without showing contents
                                echo "Environment files created successfully"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('Lint') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            sh 'npm run lint'
                        }
                    }
                }
                
                stage('Tests') {
                    steps {
                        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'junit-reports/*.xml'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Quality Gate') {
            steps {
                script {
                    // Check if previous stages have failed
                    if (currentBuild.result == 'UNSTABLE') {
                        error "Quality checks failed. See previous stage logs for details."
                    } else {
                        echo "All quality checks have passed! Vercel can safely deploy."
                    }
                }
            }
        }
        
        // Added Report Success stage
        stage('Report Success') {
            steps {
                script {
                    def statusCmd = """
                        curl -v -X POST \\
                        -H "Authorization: token ${GH_TOKEN}" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        -H "Content-Type: application/json" \\
                        https://api.github.com/repos/${GITHUB_REPO}/statuses/${CURRENT_COMMIT} \\
                        -d '{"state": "success", "context": "${CONTEXT_NAME}", "description": "Build succeeded", "target_url": "${BUILD_URL}"}'
                    """
                    
                    sh(script: statusCmd)
                    
                    // Verify the status was set
                    sh """
                        echo "Verifying status update:"
                        curl -s \\
                        -H "Authorization: token ${GH_TOKEN}" \\
                        -H "Accept: application/vnd.github.v3+json" \\
                        https://api.github.com/repos/${GITHUB_REPO}/statuses/${CURRENT_COMMIT} | grep -E '"context"|"state"'
                    """
                }
                echo "GitHub notified: Build succeeded"
            }
        }
    }
    
    post {
        success {
            script {
                // Small delay to ensure previous status updates have been processed
                sh "sleep 2"
                
                def statusCmd = """
                    curl -X POST \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    -H "Content-Type: application/json" \\
                    https://api.github.com/repos/${GITHUB_REPO}/statuses/${CURRENT_COMMIT} \\
                    -d '{"state": "success", "context": "${CONTEXT_NAME}", "description": "Build succeeded (post)", "target_url": "${BUILD_URL}"}'
                """
                
                sh(script: statusCmd)
                echo "GitHub notified: Build succeeded"
            }
        }
        
        failure {
            script {
                def statusCmd = """
                    curl -X POST \\
                    -H "Authorization: token ${GH_TOKEN}" \\
                    -H "Accept: application/vnd.github.v3+json" \\
                    -H "Content-Type: application/json" \\
                    https://api.github.com/repos/${GITHUB_REPO}/statuses/${CURRENT_COMMIT} \\
                    -d '{"state": "failure", "context": "${CONTEXT_NAME}", "description": "Build failed", "target_url": "${BUILD_URL}"}'
                """
                
                sh(script: statusCmd)
                echo "GitHub API failure response sent"
            }
        }
        
        always {
            cleanWs()
        }
    }
}