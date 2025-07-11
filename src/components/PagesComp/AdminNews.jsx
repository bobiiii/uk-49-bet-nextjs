"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, LogOut, Edit, Trash2, Calendar, Clock, Eye } from 'lucide-react';
import AddNewsDialog from '@/components/admin/AddNewsDialog';
import EditNewsDialog from '@/components/admin/EditNewsDialog';
import Cookies from 'js-cookie';
import { DeleteNewsApiCall, getNewsApiCall } from '@/lib/apis';
import NewsConfirmDeleteDialog from '../admin/NewsConfirmDeleteDialog';
import { useToast } from '../ui/use-toast';

const AdminNews = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [updateID, setUpdateID] = useState(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = Cookies.get('isLogin');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadArticles(); // 🔄 Load from backend
    }
  }, []);

  // 🟢 Fetch articles from API
  const loadArticles = async () => {
    const res = await getNewsApiCall()
    const data = res?.data
    setArticles(data || []);

  };

  const handleLogout = () => {
    Cookies.remove('isLogin');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    router.push('/login');
  };

  const handleBackToDashboard = () => router.push('/admin');

  // ✅ After successful add, refresh list
  const handleAddArticle = async (articleData) => {
    // try {
    // const res = await getNewsApiCall()
    // const data = res?.data
    // if (data.status === 'Success') {
    //   toast({ title: 'Added', description: 'News added successfully' });
    loadArticles(); // refresh
    //   } else throw new Error(data.message);
    // } catch (err) {
    //   toast({ title: 'Error', description: err.message, variant: 'destructive' });
    // }
  };

  const handleEditArticle = async (id, updatedData) => {

    setUpdateID(id)

    // try {
    //   const res = await fetch(`/api/news/${id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(updatedData),
    //   });
    //   const data = await res.json();
    //   if (data.status === 'Success') {
    //     toast({ title: 'Updated', description: 'Article updated' });
    //     loadArticles();
    //   } else throw new Error(data.message);
    // } catch (err) {
    //   toast({ title: 'Error', description: err.message, variant: 'destructive' });
    // }
  };


  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await handleDeleteArticle(deleteTargetId);
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  };


  const handleDeleteArticle = async (id) => {

    const res = await DeleteNewsApiCall(id)
    if (res.status === 'Success') {
      toast({
        title: "News Deleted ✅",
        description: `${res?.message}`,
        variant: "default",
        duration: 3000,
      });

      loadArticles();
    } else {
      toast({
        title: "Failed to Delete ❌",
        description: res?.error || "Something went wrong while Deleting News.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const openEditDialog = (id, article) => {
    setEditingArticle(article)
      ;
    setUpdateID(id)
    setShowEditDialog(true);
  };

  const handleVisitNews = () => window.open('/news', '_blank');

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
              <Button onClick={handleBackToDashboard} variant="outline" size="sm">Back to Dashboard</Button>
              <Button onClick={handleVisitNews} variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" />View News Page</Button>
              <Button onClick={handleLogout} variant="outline" size="sm"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Articles" icon={<Calendar />} value={articles.length} />
          <StatCard title="Published" icon={<Clock />} value={articles.filter(a => a.status === 'Published').length} />
          <StatCard title="Draft Articles" icon={<Calendar />} value={articles.filter(a => a.status === 'Draft').length} />
          <StatCard title="Featured Articles" icon={<Calendar />} value={articles.filter(a => a.featured).length} />
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
              <div className="text-center py-8 text-gray-500">No articles found. Add your first article to get started.</div>
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
                      <TableRow key={article._id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell><Badge variant="outline">{article.category}</Badge></TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.date?.split("T")[0]}</TableCell>
                        <TableCell><Badge variant={article.status === 'Published' ? 'default' : 'secondary'}>{article.status}</Badge></TableCell>
                        <TableCell>{article.featured && <Badge variant="destructive">Featured</Badge>}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              openEditDialog(article?._id, article)
                            }}><Edit className="h-4 w-4" /></Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDeleteTargetId(article._id);
                                setShowDeleteDialog(true);
                              }}
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
      <AddNewsDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddArticle} />
      <EditNewsDialog open={showEditDialog} onOpenChange={setShowEditDialog} article={editingArticle} onEdit={handleEditArticle} updateID={updateID} handleAddArticle={handleAddArticle} />
      <NewsConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default AdminNews;

const StatCard = ({ title, icon, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);
