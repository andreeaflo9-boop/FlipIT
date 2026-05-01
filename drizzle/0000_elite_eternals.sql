CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name TEXT,
                       email VARCHAR(320) NOT NULL UNIQUE,
                       passwordHash VARCHAR(255) NOT NULL,
                       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                       updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);