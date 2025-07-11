"use client";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Award, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

function News({ news }) {
    console.log('====================================');
    console.log('News Component Rendered', news);
    console.log('====================================');
  const [allArticles, setAllArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const articlesPerPage = 3;

  useEffect(() => {
    if (!Array.isArray(news)) return;

    const publishedArticles = news.filter(
      (article) => article.status?.toLowerCase() === "published"
    );

    setAllArticles(publishedArticles);
    setDisplayedArticles(publishedArticles.slice(0, articlesPerPage));
    setCurrentPage(1); // reset pagination if prop changes
  }, [news]);

  const loadMoreArticles = () => {
    setLoading(true);

    setTimeout(() => {
      const start = currentPage * articlesPerPage;
      const nextArticles = allArticles.slice(start, start + articlesPerPage);

      setDisplayedArticles((prev) => [...prev, ...nextArticles]);
      setCurrentPage((prev) => prev + 1);
      setLoading(false);
    }, 600);
  };

  const hasMoreArticles = currentPage * articlesPerPage < allArticles.length;

  const handleReadMore = (article) => {
    window.open(`/news/${article.slug || article.id}`, "_blank");
  };

  const latestResults = [23, 31, 38, 42, 45, 49];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            UK49s News & Updates
          </h1>
          <p className="text-xl text-gray-600">
            Stay informed with the latest lottery news, winner stories, and
            analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Article */}
            {displayedArticles
              .filter((article) => article.featured)
              .map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
                >
                  <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Award className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Featured Story</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <p>
                          {" "}
                          {new Date(article.date).toISOString().split("T")[0]}
                        </p>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{article.time}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>By {article.author}</span>
                      </div>
                      <Link href={`/news/${article.slug}`}>
                        <button
                          onClick={() => handleReadMore(article)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            {/* Regular Articles */}
            <div className="space-y-6">
              {displayedArticles
                .filter((article) => !article.featured)
                .map((article) => (
                  <div
                    key={article._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          article.category === "Analysis"
                            ? "bg-blue-100 text-blue-800"
                            : article.category === "Winner Stories"
                            ? "bg-green-100 text-green-800"
                            : article.category === "Technology"
                            ? "bg-purple-100 text-purple-800"
                            : article.category === "Tips"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.category}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(article.date).toISOString().split("T")[0]}
                        </span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{article.time}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>By {article.author}</span>
                      </div>
                                            <Link href={`/news/${article.slug}`}>
                      <button
                        onClick={() => handleReadMore(article)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More →
                      </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {/* Load More */}
            {hasMoreArticles && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreArticles}
                  disabled={loading}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More Articles (${Math.min(
                      articlesPerPage,
                      allArticles.length - displayedArticles.length
                    )} more)`
                  )}
                </button>
              </div>
            )}

            {!hasMoreArticles && displayedArticles.length > articlesPerPage && (
              <div className="text-center mt-8 text-gray-500">
                <p>No more articles to load</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest UK49s news, results, and analysis delivered to
                your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="bg-blue-400 text-white py-2 px-3 rounded text-sm hover:bg-blue-500 transition-colors">
                  Twitter
                </button>
                <button className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors">
                  YouTube
                </button>
                <button className="bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors">
                  Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default News;
