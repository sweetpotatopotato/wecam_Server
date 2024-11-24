const express = require('express');
const mysql = require('mysql2');
const config = require('../config/config.json');

const app = express();
const port = 3000;

// 환경 설정
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// MySQL 연결 설정
const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// 공지사항 데이터 조회 API
app.get('/api/notices', (req, res) => {
  db.query('SELECT * FROM notices ORDER BY date DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
