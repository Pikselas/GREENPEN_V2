CREATE TABLE PROJECT_ACCESS
(
  CODE INT,
  USERID INT,
  FOREIGN KEY(CODE) REFERENCES GREEN_PROJECTS(CODE),
  FOREIGN KEY (USERID) REFERENCES GREEN_USERS(USERID)
)
