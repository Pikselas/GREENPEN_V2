CREATE TABLE GREEN_TAGS
(
	TAG VARCHAR(10) NOT NULL,
    PROJECT_CODE INT NOT NULL,
    PRIMARY KEY(TAG , PROJECT_CODE),
    FOREIGN KEY (PROJECT_CODE) REFERENCES GREEN_PROJECTS(CODE)
);