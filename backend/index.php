<?php
require 'Slim/Slim.php';

$app = new Slim();

#$app->get('/index', 'test');
$app->get('/', 'getJobs');
//$app->get('/:id', 'getJobDesc');
$app->post('/', 'addJob');
$app->put('/', 'updateJob');
$app->delete('/','deleteJob');

$app->run();

function test() {
	try { 
		$db = connect();
	}
	catch (PDOException $e){
		echo $e->getMessage();
	}
	echo 'hello world';
}
/*
function getJobDesc($id) {
	$sql = "SELECT description FROM jobs WHERE id=:id";
        try {
                $db = connect();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $desc = $stmt->fetchObject();
                $db = null;
                echo json_encode($desc);
        }catch(PDOException $e) {
                echo '{"error":'. $e->getMessage() .'}';
        }
}*/

function error($err_str) {
    global $app;
    $app->halt(200, '{"error": "' . $err_str . '"}');
}

function retrieve_member_id($credentials) {
    $consumer_secret = 'a9WMu9e95gFmfKmR';

    $credentials = json_decode($credentials);

    // validate signature
    if ($credentials->signature_version == 1) {
        if ($credentials->signature_order && is_array($credentials->signature_order)) {
            $base_string = '';
            // build base string from values ordered by signature_order
            foreach ($credentials->signature_order as $key) {
                if (isset($credentials->$key)) {
                    $base_string .= $credentials->$key;
                } else {
                    print "missing signature parameter: $key";
                }
            }
            // hex encode an HMAC-SHA1 string
            $signature =  base64_encode(hash_hmac('sha1', $base_string, $consumer_secret, true));
            // check if our signature matches the cookie's
            if ($signature != $credentials->signature) {
                return error("signature validation failed");
            }
        } else {
            return error("signature order missing");
        }
    } else {
        return error("unknown cookie version");
    }

	return $credentials->member_id;
}

function getJobs() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = retrieve_member_id($app->getCookie('linkedin_oauth_l3bpklmxvfcp'));
	$sql = "SELECT * FROM jobs WHERE user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("token", $token);
		$stmt->execute();
		$jobs = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{';
        echo '"jobs":' . json_encode($jobs);
        echo '}';
	}catch(PDOException $e) {
		echo '{"error":'. $e->getMessage() .'}';
	}
}

function addJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = retrieve_member_id($app->getCookie('linkedin_oauth_l3bpklmxvfcp'));
	
	$job = json_decode($request->getBody());
	if (checkJob($job->url, $token)) {
		echo '{"error":"The job already exists."}';
		return;
	}
	$sql = "INSERT INTO jobs (user_token, url, title, company, description) VALUES (:token, :url, :title, :company, :desc)";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("token", $token);
		$stmt->bindParam("url", $job->url);
		$stmt->bindParam("title", $job->title);
		$stmt->bindParam("company", $job->company);
		$stmt->bindParam("desc", $job->description);
		$stmt->execute();
		$job->id = $db->lastInsertId();
		$db = null;
		echo json_encode($job);
	} catch(PDOException $e) {
		echo '{"error":'. $e->getMessage() .'}';
	}
}


function checkJob($url, $token) {
        $sql = "SELECT * FROM jobs WHERE url=:url AND user_token=:token";
        try {
                $db = connect();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("token", $token);
                $stmt->bindParam("url", $url);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if (!empty($result)) {
                        return true;
                } else {
                        return false;
                }
        } catch(PDOException $e) {
                echo '{"error":'. $e->getMessage() .'}';
        }
        return false;
}


function updateJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = retrieve_member_id($app->getCookie('linkedin_oauth_l3bpklmxvfcp'));

	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":"Job doesn\'t exist or you are not authorized."}';
		return;
	}
	$sql = "UPDATE jobs SET title=:title, company=:company, description=:desc WHERE id=:id AND user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $job->id);
		$stmt->bindParam("token", $token);
		//$stmt->bindParam("url", $job->url);
		$stmt->bindParam("title", $job->title);
		$stmt->bindParam("company", $job->company);
		$stmt->bindParam("desc", $job->description);
		$stmt->execute();
		$db = null;
		echo json_encode($job);
	}catch(PDOException $e) {
		echo '{"error":'. $e->getMessage() .'}';
	}
}


function deleteJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = retrieve_member_id($app->getCookie('linkedin_oauth_l3bpklmxvfcp'));
	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":"Job doesn\'t exist or you are not authorized."}';
		return;
	}
	$sql = "DELETE FROM jobs WHERE id=:id AND user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $job->id);
		$stmt->bindParam("token", $token);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":'. $e->getMessage() .'}';
	}
}

function verify($token, $id) {
        $sql = "SELECT * FROM jobs WHERE id=:id AND user_token=:token";
        try {
                $db = connect();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("token", $token);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (!empty($result)) {
			return true;
		} else {
			return false;
		}
        } catch(PDOException $e) {
		echo '{"error":'. $e->getMessage() .'}';
        }
	return false;
}


function connect() {
	$dbhost="localhost";
	$dbuser="jobsavr";
	$dbpass="mozilla_oakwood";
	$dbname="jobsavr";
	/*
	$dbuser="cranecon_jobsavr";
	$dbname="cranecon_jobsavr";
	$dbpass="cee-j6AH3quu";*/
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
