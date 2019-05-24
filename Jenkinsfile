def _mvnOpts = "-V -U -B -e -Dmaven.test.failure.ignore"
def _mvnOptsSkipTests = "-DskipTests=true ${_mvnOpts}"
def _mvnSpotBugsOpts = "-Dspotbugs.effort=Min -Dspotbugs.fork=false -Dspotbugs.threshold=High -Dorg.xml.sax.driver=com.sun.org.apache.xerces.internal.parsers.SAXParser ${_mvnOpts}"

def projectProperties = [[
    $class: 'BuildDiscarderProperty',
    strategy: [$class: 'LogRotator', numToKeepStr: '7']
]]
properties(projectProperties)

def SUCCESS = hudson.model.Result.SUCCESS.toString()
currentBuild.result = SUCCESS

try {
    
    stage("Checkout") {
        node {
            echo "NODE_NAME = ${env.NODE_NAME}"
            checkout scm
            stash name: 'sources', includes: 'pom.xml,*.json,src/'
        }
    }

    parallel build: {
        stage("Build") {
            node {
                echo "NODE_NAME = ${env.NODE_NAME}"
                deleteDir()
                unstash 'sources'
                executeMvnCmd(".", "help:effective-settings ${_mvnOpts}")
                try {
                    if("master" == env.BRANCH_NAME) {
                           withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {                                                               
                            executeMvnCmd(".", "clean install site ${_mvnOpts} -P compress")
                        } 
                    }
                    else if(env.BRANCH_NAME.startsWith("PR-")) {
                        withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                            executeMvnCmd(".", "clean install ${_mvnOptsSkipTests}")
                        }    
                    }
                    else {
                        withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                            executeMvnCmd(".", "clean install site ${_mvnOpts} -P compress")
                        }
                    }
                }catch(Exception e) {
                    currentBuild.result = 'FAILED: build'
                    throw e
                }finally {
                    if(!env.BRANCH_NAME.startsWith("PR-")) {
                        publishMavenReports()
                    }                    
                }  
            }
        }
    },
    sonar: {
        stage("Sonar") {
            if("master" == env.BRANCH_NAME) {
                node {
                    echo "NODE_NAME = ${env.NODE_NAME}"
                    deleteDir()
                    unstash 'sources'
                    try {
                        withSonarQubeEnv('SQ2') {
                            withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                                executeMvnCmd(".", "clean package spotbugs:spotbugs pmd:pmd checkstyle:checkstyle sonar:sonar")
                            }    
                        }                                       
                    }catch(Exception e) {
                        currentBuild.result = 'FAILED: sonar'
                        throw e
                    } 
                }
            }
            else {
                echo "Skip Sonar: ${env.BUILD_ID} on ${env.JENKINS_URL} for branch ${env.BRANCH_NAME}"
            }
        }
    },
    jdk10: {
        stage("JDK 10") {
            echo 'Not implemented yet!'                      
        }
    },
    jdk11: {
        stage("JDK 11") {
            echo 'Not implemented yet!'                      
        }        
    }  
    
    if(currentBuild.result == 'SUCCESS' || currentBuild.result == 'UNSTABLE') {
        stage("Deploy Artifacts") {
            if("master" == env.BRANCH_NAME) {
                node {
                    echo "NODE_NAME = ${env.NODE_NAME}"
                    deleteDir()
                    unstash 'sources'
                    withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                        executeMvnCmd(".", "clean deploy -Dbuild.number=${env.BUILD_NUMBER} -Dbuild.tag=${env.BUILD_TAG} -Dbuild.timestamp=\'${env.BUILD_TIMESTAMP}\' -DdeployAtEnd ${_mvnOptsSkipTests} -P compress")
                    }                
                }
            }
        }
    }      
}catch(Exception e) {
    currentBuild.result = 'FAILED: deploys'
    throw e
} finally {
    def buildStatus = currentBuild.result
    def buildNotSuccess =  !SUCCESS.equals(buildStatus)
    def lastBuildNotSuccess = !SUCCESS.equals(currentBuild.previousBuild?.result)

    if(buildNotSuccess || lastBuildNotSuccess) {

        stage('Notifiy') {
            node {
                echo "NODE_NAME = ${env.NODE_NAME}"
                final def RECIPIENTS = [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider'],
                                        [$class: 'CulpritsRecipientProvider'], [$class: 'UpstreamComitterRecipientProvider']]

                def subject = "${buildStatus}: Build ${env.JOB_NAME} #${env.BUILD_NUMBER} status is now ${buildStatus}"
                def details = """The build status changed to ${buildStatus}. For details see ${env.BUILD_URL}"""

                echo "Subject: ${subject}"
                echo "Message: ${details}"

                emailext (
                    subject: subject,
                    body: details,
                    recipientProviders: RECIPIENTS
                )
            }
        }
    }
}

def publishMavenReports() {
    publishHTML (target: [
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'target/site',
        reportFiles: 'index.html',
        reportName: "WebFOCUS Maven Reports"
    ])        
}


def executeMvnCmd(projectName, cmd) {
    withMaven(
        // Maven installation declared in the Jenkins "Global Tool Configuration"
        maven: 'M3',
        // Maven settings.xml file defined with the Jenkins Config File Provider Plugin
        // Maven settings and global settings can also be defined in Jenkins Global Tools Configuration
        mavenSettingsConfig: 'webfocus-maven-settings',
        mavenLocalRepo: '.repository') {  
            if("." == projectName) {
                if (isUnix()) {
                    sh "mvn ${cmd}"
                } else {
                    bat "mvn ${cmd}"
                }
            }
            else {
                dir(projectName) {
                    if (isUnix()) {
                        sh "mvn ${cmd}"
                    } else {
                        bat "mvn ${cmd}"
                    }
                }
            }
        }
}

