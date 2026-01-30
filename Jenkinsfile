pipeline {
    agent any

    environment {
        // REQUIRED for macOS + Homebrew + Docker Desktop
        PATH = "/opt/homebrew/bin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"

        DOCKER_BUILDKIT = "0"
        COMPOSE_DOCKER_CLI_BUILD = "0"
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

        stage('Verify Tools') {
            steps {
                sh '''
                    echo "=== PATH ==="
                    echo $PATH

                    echo "=== Versions ==="
                    node -v
                    npm -v
                    docker --version
                    docker compose version

                    echo "=== Ansible ==="
                    which ansible || true
                    which ansible-playbook || true
                    ansible-playbook --version || true
                '''
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh '''
                        npm install
                        npm audit fix || true
                    '''
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                    /opt/homebrew/bin/ansible-playbook \
                      -i Ansible/inventory.ini \
                      Ansible/playbooks/deploy.yml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    docker compose ps
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful"
        }
        failure {
            echo "❌ Deployment failed"
            sh 'docker compose logs || true'
        }
    }
}
