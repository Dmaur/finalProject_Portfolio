pipeline {
    agent any
    
    environment {
        // Define credentials with the exact ID from Jenkins
        MONGODB_URI = credentials('MONGODB_URI')
    }
    
    stages {
        stage('Test Credentials') {
            steps {
                // Test if credential is properly loaded
                sh '''
                    echo "Testing credential injection..."
                    
                    if [ -z "$MONGODB_URI" ]; then
                        echo "ERROR: MONGODB_URI is empty or not defined"
                        exit 1
                    else
                        echo "MONGODB_URI exists and is not empty"
                        echo "First characters: $(echo $MONGODB_URI | cut -c1-12)..."
                        echo "Length: $(echo $MONGODB_URI | wc -c) characters"
                    fi
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