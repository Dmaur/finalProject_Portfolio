pipeline {
    agent any
    
    stages {
        stage('Check Available Credentials') {
            steps {
                sh '''
                    echo "Checking environment variables..."
                    env | sort
                    
                    echo ""
                    echo "Testing with different credential IDs..."
                    
                    # Try to create files with different credential IDs to see which one works
                    # These will show up as masked in the logs if they exist
                    echo "Testing MONGODB_URI credential..."
                    echo "$MONGODB_URI" > test1.txt || echo "Failed to access MONGODB_URI"
                    
                    echo "Testing MONGODB_URL credential..."
                    echo "$MONGODB_URL" > test2.txt || echo "Failed to access MONGODB_URL"
                    
                    echo "Testing mongodb-atlas-uri credential..."
                    echo "$mongodb_atlas_uri" > test3.txt || echo "Failed to access mongodb-atlas-uri"
                    
                    echo ""
                    echo "Done testing credentials"
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