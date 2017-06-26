CREATE SCHEMA coinjob AUTHORIZATION dbo;
GO

CREATE TABLE coinjob.subscribers
(
	emailAddress VARCHAR(255) NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	ip VARCHAR(15) NULL,
	dateCreated DATETIMEOFFSET NOT NULL,
	unsubscribed DATETIMEOFFSET BIT DEFAULT(0),
	CONSTRAINT pk_subscribers PRIMARY KEY(emailAddress)
);
GO

CREATE TABLE coinjob.ipLogs
(
	ip VARCHAR(15) NOT NULL,
	visits INT NOT NULL,
	dateInitial DATETIMEOFFSET NOT NULL,
	dateLatest DATETIMEOFFSET NOT NULL,
	countryCode VARCHAR(10) NULL,
	city VARCHAR(255) NULL,
	latitude INT NULL,
	longitude INT NULL,
	CONSTRAINT pk_subscribers PRIMARY KEY(ip)
);
GO