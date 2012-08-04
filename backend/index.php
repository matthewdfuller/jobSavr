<?php
require 'Slim/Slim.php';

$app = new Slim();

#$app->get('/index', 'test');
$app->get('/', 'getJobs');
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

function getJobs() {
	global $app;
	$request = Slim::getInstance()->request();
	$auth_cookie = json_decode($app->getCookie('linkedin_oauth_l3bpklmxvfcp'));
    $user_id = $auth_cookie->member_id;
	$sql = "SELECT * FROM jobs WHERE user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("token", $user_id);
		$stmt->execute();
		$jobs = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{';
        echo 'jobs:' . json_encode($jobs) . ',';
        echo '}';
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function addJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = $app->getCookie('token');
	$job = json_decode($request->getBody());
	if (checkJob($job->url, $token)) {
		echo '{"error":{"text":"The job already exists."}}';
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
		echo '{"error":{"text":'. $e->getMessage() .'}}';
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
                echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
        return false;
}


function updateJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = $app->getCookie('token');
	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":{"text": "Job doesn\'t exist or you are not authorized."}}';
		return;
	}
	$sql = "UPDATE jobs SET url=:url, title=:title, company=:company, description=:desc WHERE id=:id AND user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $job->id);
		$stmt->bindParam("token", $token);
		$stmt->bindParam("url", $job->url);
		$stmt->bindParam("title", $job->title);
		$stmt->bindParam("company", $job->company);
		$stmt->bindParam("desc", $job->description);
		$stmt->execute();
		$db = null;
		echo json_encode($job);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function deleteJob() {
	global $app;
	$request = Slim::getInstance()->request();
	$token = $app->getCookie('token');
	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":{"text": "Job doesn\'t exist or you are not authorized."}}';
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
		echo '{"error":{"text":'. $e->getMessage() .'}}';
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
		echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
	return false;
}


function connect() {
	$dbhost="localhost";
	$dbuser="cranecon_jobsavr";
	$dbpass="cee-j6AH3quu";
	$dbname="cranecon_jobsavr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
