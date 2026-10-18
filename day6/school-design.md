# School Database Design

## 1. Overview

This database stores information about students, courses, and student enrolments. It contains three tables: `students`, `courses`, and `enrolments`. The database is designed to reduce unnecessary data duplication and maintain accurate relationships between students and courses.

## 2. Students Table

The `students` table stores information about each student.

* `student_id`: The primary key that uniquely identifies each student.
* `name`: The student's name. It cannot be NULL.
* `email`: The student's email address. It cannot be NULL and must be unique.

The primary key identifies each student, while the UNIQUE constraint on email prevents two students from sharing the same email address.

## 3. Courses Table

The `courses` table stores information about the courses offered by the school.

* `course_id`: The primary key that uniquely identifies each course.
* `course_name`: The course name. It cannot be NULL and must be unique.

Keeping courses in a separate table avoids repeating course details in every enrolment record.

## 4. Enrolments Table

The `enrolments` table connects students to courses and records their grades.

* `enrolment_id`: The primary key that uniquely identifies each enrolment.
* `student_id`: A foreign key referencing `students.student_id`.
* `course_id`: A foreign key referencing `courses.course_id`.
* `grade`: The student's grade for the course. It may be NULL if a grade has not yet been assigned.

The foreign keys help maintain referential integrity by ensuring that enrolments reference existing students and courses when foreign-key enforcement is enabled.

The combination of `student_id` and `course_id` has a UNIQUE constraint. This prevents the same student from enrolling in the same course more than once.

## 5. Relationships Between the Tables

### Students and Enrolments: One-to-Many

One student can have multiple enrolment records, but each enrolment belongs to one student. This is a one-to-many relationship.

### Courses and Enrolments: One-to-Many

One course can have multiple enrolment records, but each enrolment refers to one course. This is also a one-to-many relationship.

### Students and Courses: Many-to-Many

A student can enrol in multiple courses, and each course can have multiple students. This is a many-to-many relationship.

A join table, `enrolments`, is needed to implement this relationship in a relational database. It connects students and courses through their IDs and stores additional information, such as the grade. It also allows the database to prevent duplicate enrolments for the same student and course.

## 6. Recommended Index

I would add an index on `enrolments(course_id)` if the database grows.

This index can improve queries that find students enrolled in a particular course and queries that count enrolments per course. It can also help joins that use `course_id`.

The UNIQUE constraint on `(student_id, course_id)` already creates an index in SQLite that begins with `student_id`, so a separate index on `student_id` alone is generally unnecessary for this design.

An additional index requires storage and can add overhead to inserts and updates, so its usefulness should be considered alongside the database's size and query patterns.

## 7. SQL or NoSQL?

I would choose SQL for this school database because the data has clear relationships and requires reliable constraints. Students, courses, and enrolments fit naturally into relational tables, while primary keys, foreign keys, and UNIQUE constraints help maintain data integrity. SQL also supports JOIN operations, grouping, and counting, which are useful for generating course lists and enrolment reports. A NoSQL database could be appropriate for systems with highly flexible or document-oriented data requirements, but SQLite is a practical choice for this assignment because it supports the relational structure and queries we need.
