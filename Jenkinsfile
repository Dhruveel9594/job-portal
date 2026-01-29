pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
    }

    tools {
        nodejs 'node-18'
    }

    stages {

        stage('Verify Structure') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh '''
                        node -v
                        npm -v
                        npm install
                    '''
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose up -d --build
                '''
            }
        }
    }

    post {
        failure {
            echo "Something went wrong ❌"
        }
        success {
            echo "Deployment successful ✅"
        }
    }
}