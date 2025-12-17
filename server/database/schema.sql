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

-- Skill table
CREATE TABLE IF NOT EXISTS Skill (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL,
    skill_type ENUM('Technical', 'Soft') NOT NULL
);

-- Student Skill table
CREATE TABLE IF NOT EXISTS student_skill (
    student_skill_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_level INT DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_skill (student_id, skill_id)
);

-- Interest table
CREATE TABLE IF NOT EXISTS Interest (
    interest_id INT PRIMARY KEY AUTO_INCREMENT,
    interest_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- Student Career Interests table
CREATE TABLE IF NOT EXISTS student_career_interests (
    student_interest_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    interest_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES Interest(interest_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_interest (student_id, interest_id)
);

-- Career Options table
CREATE TABLE IF NOT EXISTS career_options (
    career_id INT PRIMARY KEY AUTO_INCREMENT,
    career_name VARCHAR(100) NOT NULL,
    required_skills TEXT, -- Storing the list of skills here (comma separated)
    description TEXT
);

