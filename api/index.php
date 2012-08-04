<?php
require 'Slim/Slim.php';

$app = new Slim();

#$app->get('/index', 'getJobs');
$app->get('/index', 'test');
$app->post('/index', 'addJob');
$app->put('/index', 'updateJob');
$app->delete('/index','deleteJob');

$app->run();

function test() {
	echo 'hello world';
}

function getJobs() {
	$request = Slim::getInstance()->request();
	$token = $request->getCookie('token');
	$sql = "SELECT * FROM jobs WHERE user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("token", $token);
		$stmt->execute();
		$jobs = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"jobs":' . json_encode($jobs) . '}';
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function addJob() {
	echo 'hello';
	$request = Slim::getInstance()->request();
	$token = $request->getCookie('token');
	$job = json_decode($request->getBody());
	print 'hello';
	$sql = "INSERT INTO jobs (user_token, url, title, company) VALUES (:token, :url, :title, :company)";
	print $sql;
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("token", $token);
		$stmt->bindParam("url", $job->url);
		$stmt->bindParam("title", $job->title);
		$stmt->bindParam("company", $job->company);
		$stmt->execute();
		$db = null;
		$job->id = $db->lastInsertId();
		echo json_encode($job);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	echo 'finish\n';
}


function updateJob() {
	$request = Slim::getInstance()->request();
	$token = $request->getCookie('token');
	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":{"text": You are not authorized.}}';
		return;
	}
	$sql = "UPDATE jobs SET url=:url, title=:title, company=:company WHERE id=:id AND user_token=:token";
	try {
		$db = connect();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $job->id);
		$stmt->bindParam("token", $token);
		$stmt->bindParam("url", $job->url);
		$stmt->bindParam("title", $job->title);
		$stmt->bindParam("company", $job->company);
		$stmt->execute();
		$db = null;
		echo json_encode($job);
	}catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function deleteJob() {
	$request = Slim::getInstance()->request();
	$token = $request->getCookie('token');
	$job = json_decode($request->getBody());
	if (!verify($token, $job->id)) {
		echo '{"error":{"text": You are not authorized.}}';
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

function verify($id, $token) {
        $sql = "SELECT * FROM jobs WHERE id=:id AND user_token=:token";
        try {
                $db = connect();
                $stmt = $db->prepare($sql);
                $stmt->bindParam("token", $token);
                $stmt->bindParam("id", $id);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
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
	$dbuser="root";
	$dbpass="mozilla_oakwood";
	$dbname="jobsavr";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
