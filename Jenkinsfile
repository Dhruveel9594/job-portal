pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
        DOCKER_BUILDKIT = "1"
        COMPOSE_DOCKER_CLI_BUILD = "1"
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
                        npm audit fix || true
                    '''
                }
            }
        }

        stage('Docker Deploy') {
            steps {
                script {
                    sh '''
                        docker compose down || true
                        docker compose up -d --build --remove-orphans
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {
        failure {
            echo "Something went wrong ❌"
            sh 'docker compose logs || true'
        }
        success {
            echo "Deployment successful ✅"
        }
    }
}