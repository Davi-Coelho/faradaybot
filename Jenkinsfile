pipeline {
    agent {
        label 'ridley'
    }

    environment {
        DOCKER_USER = 'davicoelho'
        BOT_NAME = 'faradaybot'
    }

    stages {
        stage("Cleaning workspace") {
            steps {
                cleanWs()
                checkout scm
                echo 'Building $JOB_NAME...'
            }
        }
        stage("Cloning git") {
            steps {
                git branch: "main",
                url: "https://github.com/Davi-Coelho/faradaybot.git",
                credentialsId: "b040de5d-8699-4f43-90ac-2c3a0fd2aa61"
            }
        }

        stage("Copying .env file") {
            steps {
                withCredentials([file(credentialsId: "bot-env-file", variable: "envFile")]) {
                    sh 'cp $envFile $WORKSPACE'
                }
            }
        }

        stage("Stopping containers") {
            steps {
                sh "docker compose down"
            }
        }

        stage("Cleaning old images") {
            steps {
                script {
                    try {
                        sh 'docker rmi $DOCKER_USER/$BOT_NAME:latest'
                    } catch(Exception e) {
                        print("Error: " + e)
                    }
                }
                echo currentBuild.result
            }
        }
        stage("Running containers") {
            steps {
                sh "docker compose up -d --build"
            }
        }
    }
}