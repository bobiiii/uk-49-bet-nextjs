"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, LogOut, Edit, Trash2, Calendar, Clock, User, ExternalLink, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddNewsDialog from '@/components/admin/AddNewsDialog';
import EditNewsDialog from '@/components/admin/EditNewsDialog';
import { generateUniqueSlug } from '@/utils/slugify';
import Cookies from 'js-cookie';



const AdminNews = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = Cookies.get('isLogin');

    if (auth == 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadArticles = () => {
    if (typeof window !== 'undefined') {
      const savedArticles = window.localStorage.getItem('newsArticles');
      if (savedArticles) {
        setArticles(JSON.parse(savedArticles));
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('isLogin');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    router.push('/admin'); // Fixed
  };

  const handleAddArticle = (articleData) => {
    const slug = generateUniqueSlug(articleData.title, articles);
    const newArticle = {
      ...articleData,
      id: Date.now().toString(),
      slug,
      createdAt: new Date().toISOString(),
    };

    const updatedArticles = [...articles, newArticle];
    setArticles(updatedArticles);
    localStorage.setItem('newsArticles', JSON.stringify(updatedArticles));

    // Trigger event to notify News page of changes
    window.dispatchEvent(new CustomEvent('newsArticlesUpdated'));

    toast({
      title: 'Article Added',
      description: 'News article has been added successfully',
    });
  };

  const handleEditArticle = (id, updatedData) => {
    const updatedArticles = articles.map(article => {
      if (article.id === id) {
        // Generate new slug if title changed
        const slug = article.title !== updatedData.title
          ? generateUniqueSlug(updatedData.title, articles.filter(a => a.id !== id))
          : article.slug;
        return { ...article, ...updatedData, slug };
      }
      return article;
    });
    setArticles(updatedArticles);
    localStorage.setItem('newsArticles', JSON.stringify(updatedArticles));

    // Trigger event to notify News page of changes
    window.dispatchEvent(new CustomEvent('newsArticlesUpdated'));

    toast({
      title: 'Article Updated',
      description: 'News article has been updated successfully',
    });
  };

  const handleDeleteArticle = (id) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    setArticles(updatedArticles);
    localStorage.setItem('newsArticles', JSON.stringify(updatedArticles));

    // Trigger event to notify News page of changes
    window.dispatchEvent(new CustomEvent('newsArticlesUpdated'));

    toast({
      title: 'Article Deleted',
      description: 'News article has been removed successfully',
    });
  };



  const handleVisitNews = () => {
    window.open('/news', '_blank');
  };

  const openEditDialog = (article) => {
    setEditingArticle(article);
    setShowEditDialog(true);
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">News Manager</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleBackToDashboard} variant="outline" size="sm">
                Back to Dashboard
              </Button>
              <Button onClick={handleVisitNews} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View News Page
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.status === 'published').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.status === 'draft').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Articles</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => a.featured).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>News Articles Management</CardTitle>
                <CardDescription>Add, edit, and manage news articles</CardDescription>
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No articles found. Add your first article to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.date}</TableCell>
                        <TableCell>
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {article.featured && <Badge variant="destructive">Featured</Badge>}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddNewsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddArticle}
      />

      <EditNewsDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        article={editingArticle}
        onEdit={handleEditArticle}
      />
    </div>
  );
};

export default AdminNews;
