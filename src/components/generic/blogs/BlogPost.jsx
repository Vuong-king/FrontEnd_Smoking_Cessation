import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, Filter, Heart, MessageCircle, Share2, BookOpen } from 'lucide-react';
import ColourfulText from '../../ui/ColourfulText';

// Data extracted from original component (in real project, this would be imported from separate file)
const categories = ['All', 'Health Tips', 'Success Stories', 'Expert Advice', 'Community', 'Research'];

const blogPosts = [

  {
    id: 1,
    title: "10 Proven Strategies to Overcome Smoking Cravings",
    excerpt: "Discover effective techniques that thousands have used to successfully manage and overcome nicotine cravings during their quit journey.",
    author: "Dr. Sarah Johnson",
    date: "2024-06-05",
    readTime: "5 min read",
    category: "Health Tips",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 124,
    comments: 18,
    featured: true
  },
  {
    id: 2,
    title: "From 2 Packs a Day to Smoke-Free: Mark's Journey",
    excerpt: "Read how Mark transformed his life after 20 years of smoking, including the challenges he faced and strategies that worked for him.",
    author: "Mark Rodriguez",
    date: "2024-06-03",
    readTime: "8 min read",
    category: "Success Stories",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 89,
    comments: 25,
    featured: false
  },
  {
    id: 3,
    title: "The Science Behind Nicotine Addiction",
    excerpt: "Understanding the neurological and psychological aspects of nicotine addiction can help you develop better strategies for quitting.",
    author: "Dr. Emily Chen",
    date: "2024-06-01",
    readTime: "12 min read",
    category: "Research",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 156,
    comments: 32,
    featured: false
  },
  {
    id: 4,
    title: "Building Your Support Network",
    excerpt: "Learn how to create a strong support system that will help you stay motivated and accountable throughout your quit smoking journey.",
    author: "Lisa Thompson",
    date: "2024-05-30",
    readTime: "6 min read",
    category: "Community",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 92,
    comments: 14,
    featured: false
  },
  {
    id: 5,
    title: "Nutrition Tips for Your Quit Journey",
    excerpt: "Discover how proper nutrition can help manage withdrawal symptoms and prevent weight gain during your smoke-free transition.",
    author: "Dr. Michael Park",
    date: "2024-05-28",
    readTime: "7 min read",
    category: "Health Tips",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 78,
    comments: 11,
    featured: false
  },
  {
    id: 6,
    title: "Expert Q&A: Common Quit Smoking Questions",
    excerpt: "Our panel of experts answers the most frequently asked questions about quitting smoking, withdrawal, and staying smoke-free.",
    author: "Expert Panel",
    date: "2024-05-25",
    readTime: "10 min read",
    category: "Expert Advice",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VFgS1jaiqM-zT8vPWTMxqsQ7nZYN1frN5A&s",
    likes: 203,
    comments: 45,
    featured: true
  }
];

// Data processing functions (extracted from inline logic for better organization)
const filterPosts = (posts, category, searchTerm) => {
  return posts.filter(post => {
    const matchesCategory = category === 'All' || post.category === category;
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
};

const getFeaturedPosts = (posts) => {
  return posts.filter(post => post.featured);
};

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Use the extracted functions with blogPosts data
  const filteredPosts = filterPosts(blogPosts, selectedCategory, searchTerm);
  const featuredPosts = getFeaturedPosts(blogPosts);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              <ColourfulText text="Our Blog"/> 
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Expert insights, success stories, and practical tips to support your smoke-free journey
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-yellow-400" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 hover:text-blue-400 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <User className="w-4 h-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Our Latest Articles
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get expert tips, success stories, and motivation delivered directly to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;