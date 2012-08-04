<?php
/**
 * Step 1: Require the Slim PHP 5 Framework
 *
 * If using the default file layout, the `Slim/` directory
 * will already be on your include path. If you move the `Slim/`
 * directory elsewhere, ensure that it is added to your include path
 * or update this file path as needed.
 */
require 'Slim/Slim.php';

/**
 * Step 2: Instantiate the Slim application
 *
 * Here we instantiate the Slim application with its default settings.
 * However, we could also pass a key-value array of settings.
 * Refer to the online documentation for available settings.
 */
$app = new Slim();

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function. If you are using PHP < 5.3, the
 * second argument should be any variable that returns `true` for
 * `is_callable()`. An example GET route for PHP < 5.3 is:
 *
 * $app = new Slim();
 * $app->get('/hello/:name', 'myFunction');
 * function myFunction($name) { echo "Hello, $name"; }
 *
 * The routes below work with PHP >= 5.3.
 */

//GET route
$app->get('/', function () {
    $template = <<<EOT
<!DOCTYPE html>
    <html>
        <body>
                Hello, World!
        </body>
    </html>
EOT;
    echo $template;
});

//POST route
/* $app->post('/post', function () { */
/*     echo 'This is a POST route'; */
/* }); */

//PUT route
$app->put('/job', 'addJob');

//DELETE route
/* $app->delete('/delete', function () { */
/*     echo 'This is a DELETE route'; */
/* }); */

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This is responsible for executing
 * the Slim application using the settings and routes defined above.
 */
$app->run();


function addJob() {
  $request = Slim::getInstance()->request();
  $job = json_decode($request->getBody());
  echo $job;
}

function connectDB() {
  $services_json = json_decode(getenv("VCAP_SERVICES"),true);
  $mysql_config = $services_json["mysql-5.1"][0]["credentials"];

  $username = $mysql_config["username"];
  $password = $mysql_config["password"];
  $hostname = $mysql_config["hostname"];
  $port = $mysql_config["port"];
  $db = $mysql_config["name"];

  $link = mysql_connect("$hostname:$port", $username, $password);
  $db_selected = mysql_select_db($db, $link);
}