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
                        npm audit fix || true
                    '''
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                  ansible-playbook \
                  -i Ansible/inventory.ini \
                  Ansible/playbooks/deploy.yml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        failure {
            echo "Deployment failed ❌"
        }
        success {
            echo "Deployment successful via Ansible ✅"
        }
    }
}
