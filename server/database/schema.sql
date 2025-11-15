-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS career_guidance;
USE career_guidance;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student table
CREATE TABLE IF NOT EXISTS Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cgpa DECIMAL(4, 2),
    graduation_year YEAR,
    department VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Academic record table
CREATE TABLE IF NOT EXISTS academic_record (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    term_name VARCHAR(100) NOT NULL,
    gpa DECIMAL(4, 2),
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE
);

-- Record courses table
CREATE TABLE IF NOT EXISTS record_courses (
    record_course_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT,
    course_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (record_id) REFERENCES academic_record(record_id) ON DELETE CASCADE
);

