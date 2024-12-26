CREATE DATABASE ember_blog;

USE ember_blog;

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

INSERT INTO posts (title, content) VALUES
('Ember.js Basics', 'Learn the basics of Ember.js framework with hands-on examples.'),
('Advanced Ember.js', 'Dive deeper into Ember.js with advanced patterns and techniques.'),
('Building REST APIs', 'A comprehensive guide to building REST APIs using Express.js and MySQL.'),
('JavaScript Tips', 'Top 10 JavaScript tips and tricks for developers.');

INSERT INTO comments (text, post_id) VALUES
('Great post! I learned a lot.', 1),
('Can you provide more examples?', 1),
('This is very helpful, thanks!', 2),
('Looking forward to more posts like this.', 2),
('Clear and concise, well done.', 3),
('What about error handling? Could you cover that?', 3),
('Super useful tips!', 4),
('This saved me a lot of time, thank you!', 4);

