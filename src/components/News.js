import React, { useEffect, useState } from 'react';
import './News.css';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=356b3faf54614b35a5778cd3e451dd22');
        const data = await response.json();
        setArticles(data.articles.slice(0, 4)); // Limit to 4 news items
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading news: {error.message}</p>;

  return (
    <div className="news">
      <h2>Latest Tech News</h2>
      <ul>
        {articles.map((article, index) => (
          <li key={index} className="news-item">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <h3>{article.title.length > 40 ? `${article.title.substring(0, 40)}...` : article.title}</h3>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;