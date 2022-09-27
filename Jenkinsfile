pipeline {
    agent {
        label 'ridley'
    }

    stages {
        stage("Clonando Repositório") {
            steps {
                git branch: "main",
                url: "https://github.com/Davi-Coelho/twitch-bot-template.git",
                credentialsId: "b040de5d-8699-4f43-90ac-2c3a0fd2aa61"
            }
        }

        stage("Subindo Containers") {
            steps {
                sh "docker compose up"
            }
        }
    }
}