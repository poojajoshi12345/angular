def _mvnOpts = "-V -U -B -e -Dmaven.test.failure.ignore"
def _mvnOptsSkipTests = "-DskipTests=true ${_mvnOpts}"
def _mvnSpotBugsOpts = "-Dspotbugs.effort=Min -Dspotbugs.fork=false -Dspotbugs.threshold=High -Dorg.xml.sax.driver=com.sun.org.apache.xerces.internal.parsers.SAXParser ${_mvnOpts}"

def projectProperties = [[
    $class: 'BuildDiscarderProperty',
    strategy: [$class: 'LogRotator', daysToKeepStr: '5', numToKeepStr: env.BRANCH_NAME=='master'? '5':'1', artifactNumToKeepStr: '1']
]]
properties(projectProperties)

def SUCCESS = hudson.model.Result.SUCCESS.toString()
currentBuild.result = SUCCESS

try {
    
    stage("Checkout") {
        node {
            echo "NODE_NAME = ${env.NODE_NAME}"
            checkout scm
            stash name: 'sources', includes: 'pom.xml,*.js,*.json,src/'
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
                            executeMvnCmd(".", "clean install site ${_mvnOpts} -P compile-css-javascript")
                        } 
                    }
                    else if(env.BRANCH_NAME.startsWith("PR-")) {
                        withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                            executeMvnCmd(".", "clean install ${_mvnOptsSkipTests}")
                        }    
                    }
                    else {
                        withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                            executeMvnCmd(".", "clean install site ${_mvnOpts} -P compile-css-javascript")
                        }
                    }
                }catch(Exception e) {
                    currentBuild.result = 'FAILED: build'
                    throw e
                }finally {
                    if(!env.BRANCH_NAME.startsWith("PR-")) {
                        publishMavenReports()
                    }                    
                    
                    cleanWs cleanWhenFailure: false, notFailBuild: true
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
                    finally {
                         cleanWs cleanWhenFailure: false, notFailBuild: true
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
                    
                    try {
                        withEnv(["JAVA_HOME=${ tool 'JDK8' }"]) {
                            executeMvnCmd(".", "clean deploy -Dwf.build.number=${env.BUILD_NUMBER} -Dwf.build.tag=${env.BUILD_TAG} -Dwf.build.timestamp=${currentBuild.startTimeInMillis} -DdeployAtEnd ${_mvnOptsSkipTests} -P compile-css-javascript")
                        }   
                    }
                    finally {
                        cleanWs cleanWhenFailure: false, notFailBuild: true
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
 
                echo "Subject: ${subject}"
                
                emailext (
	            	mimeType: 'text/html',
	                subject: subject,
	                body: '''${SCRIPT, template="groovy-html.template"}''',
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

