pipeline {
    agent any

    environment {
        COMPOSE_PROJECT = "job_portal"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Structure') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Backend Build') {
            steps {
                sh '''
                echo "Building backend..."
                cd backend
                npm install
                '''
            }
        }

        stage('Docker Deploy') {
            steps {
                sh '''
                echo "Starting Docker Compose..."
                docker-compose down || true
                docker-compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful 🎉"
        }
        failure {
            echo "Something went wrong ❌"
        }
    }
}