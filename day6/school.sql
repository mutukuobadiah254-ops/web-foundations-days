-- ==========================================
-- DAY 6 ASSIGNMENT: A SCHOOL DATABASE
-- ==========================================

-- Enable foreign-key enforcement in SQLite.
PRAGMA foreign_keys = ON;

-- Remove existing tables if they exist.
-- Drop enrolments first because it references
-- students and courses.

DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- ==========================================
-- 1. CREATE THE STUDENTS TABLE
-- ==========================================

CREATE TABLE students (
student_id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE
);

-- ==========================================
-- 2. CREATE THE COURSES TABLE
-- ==========================================

CREATE TABLE courses (
course_id INTEGER PRIMARY KEY,
course_name TEXT NOT NULL UNIQUE
);

-- ==========================================
-- 3. CREATE THE ENROLMENTS TABLE
-- ==========================================

CREATE TABLE enrolments (
enrolment_id INTEGER PRIMARY KEY,
student_id INTEGER NOT NULL,
course_id INTEGER NOT NULL,
grade TEXT,

```
FOREIGN KEY (student_id)
    REFERENCES students(student_id),

FOREIGN KEY (course_id)
    REFERENCES courses(course_id),

UNIQUE (student_id, course_id)
```

);
-- ==========================================
-- 4. INSERT SAMPLE STUDENTS
-- ==========================================

INSERT INTO students (name, email)
VALUES
('Alice Johnson', '[alice@example.com](mailto:alice@example.com)'),
('Brian Smith', '[brian@example.com](mailto:brian@example.com)'),
('Carol Davis', '[carol@example.com](mailto:carol@example.com)'),
('David Wilson', '[david@example.com](mailto:david@example.com)'),
('Emma Brown', '[emma@example.com](mailto:emma@example.com)');
-- ==========================================
-- 5. INSERT SAMPLE COURSES
-- ==========================================

INSERT INTO courses (course_name)
VALUES
    ('Mathematics'),
    ('Computer Science'),
    ('Biology');
    -- ==========================================
-- 6. INSERT SAMPLE ENROLMENTS
-- ==========================================

INSERT INTO enrolments (student_id, course_id, grade)
VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'A'),
(3, 3, 'B'),
(5, 1, 'A');
-- ==========================================
-- QUERY 1: ALL COURSES FOR ONE STUDENT
-- ==========================================

SELECT
    students.name,
    courses.course_name,
    enrolments.grade
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Alice Johnson'
ORDER BY courses.course_name;
-- ==========================================
-- QUERY 2: ALL STUDENTS ON ONE COURSE
-- ==========================================

SELECT
    courses.course_name,
    students.name,
    enrolments.grade
FROM courses
JOIN enrolments
    ON courses.course_id = enrolments.course_id
JOIN students
    ON enrolments.student_id = students.student_id
WHERE courses.course_name = 'Mathematics'
ORDER BY students.name;
-- ==========================================
-- QUERY 3: NUMBER OF STUDENTS PER COURSE
-- ==========================================

SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY
    courses.course_id,
    courses.course_name
ORDER BY courses.course_name;
-- ==========================================
-- QUERY 4: STUDENTS WITH NO ENROLMENTS
-- ==========================================

SELECT
    students.student_id,
    students.name,
    students.email
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL
ORDER BY students.name;
-- ==========================================
-- QUERY 5: UPDATE ONE ENROLMENT'S GRADE
-- ==========================================

UPDATE enrolments
SET grade = 'A'
WHERE student_id = (
    SELECT student_id
    FROM students
    WHERE name = 'Alice Johnson'
)
AND course_id = (
    SELECT course_id
    FROM courses
    WHERE course_name = 'Computer Science'
);

-- Verify the updated grade.

SELECT
    students.name,
    courses.course_name,
    enrolments.grade
FROM enrolments
JOIN students
    ON enrolments.student_id = students.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Alice Johnson'
AND courses.course_name = 'Computer Science';