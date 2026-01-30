pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
        COMPOSE_DOCKER_CLI_BUILD = "0"
        DOCKER_BUILDKIT = "0"
    }

    tools {
        nodejs 'node-18'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project Structure') {
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
                    docker system prune -f
                    docker compose up -d --build
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo "✅ Job Portal deployed successfully!"
        }
        failure {
            echo "❌ Deployment failed"
            sh 'docker compose logs || true'
        }
    }
}
