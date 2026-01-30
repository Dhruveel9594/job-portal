pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/Applications/Docker.app/Contents/Resources/bin:$PATH"
        ANSIBLE_HOST_KEY_CHECKING = "False"
    }

    tools {
        nodejs 'node-18'
    }

    stages {

        stage('Verify Workspace') {
            steps {
                sh '''
                    echo "=== Workspace ==="
                    pwd
                    ls -la
                    echo "=== Ansible Folder ==="
                    ls -la Ansible
                '''
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
                    /opt/homebrew/bin/ansible-playbook \
                      -i Ansible/inventory.ini \
                      Ansible/playbook.yml
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
            echo "✅ Deployment successful"
        }
        failure {
            echo "❌ Deployment failed"
        }
    }
}
