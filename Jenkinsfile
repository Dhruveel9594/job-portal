pipeline {
    agent any

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
        success {
            echo 'Deployment Successful 🎉'
        }
        failure {
            echo 'Something went wrong ❌'
        }
    }
}