
<?php session_start()?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
<meta name="description" content="">
<link rel="stylesheet" href="../profile/profileDisplay.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
<div class="topmenu">
	<div class="menubar">
	  	<?php if (isset($_SESSION['logged_in'])) { ?>
	  	<div class="logout">
	  		<a href="../profile/profileLogout.php"><i class="fa fa-sign-out"></i> Logout</a>
	  	</div>
	  	<?php } 
	  	else { ?>
	  		<a id = "login"  href="../index.html"><i class="fa fa-sign-in"></i> Login</a>
	  	<?php } ?>
	  	<div class="user"><?php if (isset($_SESSION['username']))
	  		echo '<span class="welcome">Welcome   </span>'.$_SESSION['username']; ?>
	 	</div>
	</div>
</div>
</body>
</html>
