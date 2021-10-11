CREATE TABLE GREEN_PROJECTS
(
  CODE INT AUTO_INCREMENT,
  NAME VARCHAR(100) NOT NULL,
  POSTER VARCHAR(200) NOT NULL,
  UPDATED DATETIME NOT NULL,
  AUTHORID INT NOT NULL,
  PRIMARY KEY(CODE),
  FOREIGN KEY (AUTHORID) REFERENCES green_users(USERID) 
);