CREATE TABLE GREEN_USERS 
    (
		USERID INT AUTO_INCREMENT,
        USERNAME VARCHAR(10) NOT NULL,
        PASSWORD VARCHAR(200) NOT NULL,
        PRIMARY KEY(USERID,USERNAME)
    );