pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
        ANSIBLE_FORCE_COLOR = "true"
        DEPLOY_DIR = "${env.HOME}/job-portal-deploy"
    }

    tools {
        nodejs 'node-18'
    }

    stages {

        stage('Checkout Code') {
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
                        echo "Node version: $(node -v)"
                        echo "NPM version: $(npm -v)"
                        npm install
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_SCANNER = tool 'SonarScanner'
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        $SONAR_SCANNER/bin/sonar-scanner \
                        -Dsonar.projectKey=job-portal \
                        -Dsonar.projectName=Job-Portal \
                        -Dsonar.sources=backend,frontend \
                        -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
                    """
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                sh """
                    echo "Running Ansible Playbook..."
                    /opt/homebrew/bin/ansible-playbook \
                        -i Ansible/inventory.ini \
                        Ansible/playbook.yml \
                        --connection=local
                """
            }
        }

        stage('Verify Docker Deployment') {
            steps {
                sh """
                    echo "Checking Docker containers..."
                    docker compose -f $DEPLOY_DIR/docker-compose.yml ps
                """
            }
        }
    }

    post {
        success {
            echo "✅ Job Portal deployed successfully!"
        }
        failure {
            echo "❌ Deployment failed"
            sh "docker compose -f $DEPLOY_DIR/docker-compose.yml logs || true"
        }
    }
}
