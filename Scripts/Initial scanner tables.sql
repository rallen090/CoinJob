CREATE SCHEMA coinjob AUTHORIZATION dbo;
GO

CREATE TABLE coinjob.subscribers
(
	emailAddress VARCHAR(255) NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	ip VARCHAR(55) NULL,
	countryCode VARCHAR(10) NULL,
	city VARCHAR(255) NULL,
	latitude DECIMAL(9,6) NULL,
	longitude DECIMAL(9,6) NULL,
	dateCreated DATETIMEOFFSET NOT NULL,
	unsubscribed BIT DEFAULT(0),
	CONSTRAINT pk_subscribers PRIMARY KEY(emailAddress)
);
GO

CREATE TABLE coinjob.ipLogs
(
	ip VARCHAR(55) NOT NULL,
	visits INT NOT NULL,
	dateInitial DATETIMEOFFSET NOT NULL,
	dateLatest DATETIMEOFFSET NOT NULL,
	countryCode VARCHAR(10) NULL,
	city VARCHAR(255) NULL,
	latitude DECIMAL(9,6) NULL,
	longitude DECIMAL(9,6) NULL,
	CONSTRAINT pk_ipLogs PRIMARY KEY(ip)
);
GO


select * from sys.tables