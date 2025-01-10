const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data for development
const mockPosts = Array.from({ length: 100 }, (_, i) => ({
  type: ['Reel', 'Carousel', 'Static'][Math.floor(Math.random() * 3)],
  date: new Date(2024, 0, Math.floor(i / 3) + 1),
  likes: Math.floor(Math.random() * 1000) + 100,
  shares: Math.floor(Math.random() * 200) + 50,
  comments: Math.floor(Math.random() * 100) + 10
}));

app.get('/api/distribution', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredPosts = mockPosts.filter(post => 
    post.date >= startDate && post.date <= endDate
  );
  
  const distribution = filteredPosts.reduce((acc, post) => {
    acc[post.type] = (acc[post.type] || 0) + 1;
    return acc;
  }, {});
  
  const result = Object.entries(distribution).map(([name, value]) => ({
    name,
    value
  }));
  
  res.json(result);
});

app.get('/api/engagement', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredPosts = mockPosts.filter(post => 
    post.date >= startDate && post.date <= endDate
  );
  
  const engagement = filteredPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = { total: 0, count: 0 };
    }
    acc[post.type].total += post.likes + post.shares + post.comments;
    acc[post.type].count += 1;
    return acc;
  }, {});
  
  const result = Object.entries(engagement).map(([type, data]) => ({
    type,
    value: data.total / data.count
  }));
  
  res.json(result);
});

app.get('/api/total-engagement', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredPosts = mockPosts.filter(post => 
    post.date >= startDate && post.date <= endDate
  );
  
  const total = filteredPosts.reduce((acc, post) => ({
    likes: acc.likes + post.likes,
    shares: acc.shares + post.shares,
    comments: acc.comments + post.comments
  }), { likes: 0, shares: 0, comments: 0 });
  
  res.json(total);
});

app.get('/api/performance', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredPosts = mockPosts.filter(post => 
    post.date >= startDate && post.date <= endDate
  );
  
  const performance = filteredPosts.reduce((acc, post) => {
    const dateStr = post.date.toISOString().split('T')[0];
    if (!acc[dateStr]) {
      acc[dateStr] = { likes: 0, shares: 0, comments: 0 };
    }
    acc[dateStr].likes += post.likes;
    acc[dateStr].shares += post.shares;
    acc[dateStr].comments += post.comments;
    return acc;
  }, {});
  
  const result = Object.entries(performance).map(([date, data]) => ({
    date: new Date(date),
    ...data
  })).sort((a, b) => a.date - b.date);
  
  res.json(result);
});

app.get('/api/comparison', (req, res) => {
  const { start, end } = req.query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const filteredPosts = mockPosts.filter(post => 
    post.date >= startDate && post.date <= endDate
  );
  
  const comparison = filteredPosts.reduce((acc, post) => {
    if (!acc[post.type]) {
      acc[post.type] = { likes: 0, shares: 0, comments: 0, count: 0 };
    }
    acc[post.type].likes += post.likes;
    acc[post.type].shares += post.shares;
    acc[post.type].comments += post.comments;
    acc[post.type].count += 1;
    return acc;
  }, {});
  
  const result = Object.entries(comparison).map(([type, data]) => ({
    type,
    likes: data.likes / data.count,
    shares: data.shares / data.count,
    comments: data.comments / data.count
  }));
  
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});