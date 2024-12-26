const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ember_blog'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get('/api/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      return res.status(500).json({ errors: [{ detail: 'Internal server error' }] });
    }
    const posts = results.map(post => ({
      type: 'post',
      id: post.id.toString(),
      attributes: {
        title: post.title,
        content: post.content,
      },
    }));
    res.json({
      data: posts,
    });
  });
});


app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ errors: [{ detail: 'Internal server error' }] });
    }
    if (result.length === 0) {
      return res.status(404).json({ errors: [{ detail: 'Post not found' }] });
    }
    const post = result[0];
    const normalizedPost = {
      data: {
        type: 'post',
        id: post.id.toString(),
        attributes: {
          title: post.title,
          content: post.content,
        },
      },
    };
    res.json(normalizedPost);
  });
});



app.post('/api/posts', (req, res) => {
  const { title, content } = req.body.data.attributes;
  
  db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) return res.status(500).send(err);
    const response = {
      data: {
        id: result.insertId.toString(),
        type: 'posts',
        attributes: {
          title,
          content
        }
      }
    };
    res.status(201).json(response);
  });
});

app.patch('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body.data.attributes;
  if (!title && !content) {
    return res.status(400).json({ errors: [{ detail: 'No fields to update provided' }] });
  }
  const updates = [];
  const values = [];
  if (title) {
    updates.push('title = ?');
    values.push(title);
  }
  if (content) {
    updates.push('content = ?');
    values.push(content);
  }
  values.push(id);
  const query = `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`;
  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ errors: [{ detail: 'Internal server error' }] });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ errors: [{ detail: 'Post not found' }] });
    }
    res.json({ data: { id, attributes: { title, content } } });
  });
});


app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete the post' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  });
});


app.get('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM comments WHERE post_id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    const response = {
      data: results.map(comment => ({
        id: comment.id.toString(),
        type: 'comments',
        attributes: {
          text: comment.text
        },
        relationships: {
          post: {
            data: { id: comment.post_id.toString(), type: 'posts' }
          }
        }
      }))
    };
    res.json(response);
  });
});


app.post('/api/comments', (req, res) => {
  const { text, post_id } = req.body;
  db.query('INSERT INTO comments (text, post_id) VALUES (?, ?)', [text, post_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, text, post_id });
  });
});

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;  
  db.query('DELETE FROM comments WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "OK" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
