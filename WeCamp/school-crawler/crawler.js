// school-crawler/crawler.js
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2');
const config = require('../config/config.json'); // config.json 파일 불러오기

// 환경 설정 불러오기
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// MySQL 연결 설정
const db = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database
});

// 크롤링 함수
async function crawlNotices() {
  const url = 'https://dgsw.dge.hs.kr/dgswh/na/ntt/selectNttList.do?mi=10091723&bbsId=10091723';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const notices = [];
    
    $('.notice-list li').each((index, element) => {
      const title = $(element).find('.title').text().trim();
      const date = $(element).find('.date').text().trim();
      notices.push({ title, date });
    });

    // 데이터 저장
    notices.forEach((notice) => {
      db.query('INSERT INTO notices (title, date) VALUES (?, ?)', [notice.title, notice.date], (err, result) => {
        if (err) {
          console.error('DB Insert Error:', err);
        } else {
          console.log('Inserted:', result.insertId);
        }
      });
    });
  } catch (error) {
    console.error('Crawling Error:', error);
  }
}

module.exports = {
  crawlNotices
};
