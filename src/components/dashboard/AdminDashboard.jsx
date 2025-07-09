"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { LogOut, User, ExternalLink, FileText, CheckCircle, Newspaper, Home, Archive, History, TrendingUp, BarChart3, Calculator, BookOpen, Info, HelpCircle, Phone, Shield, Type, SquarePlus, SquarePen } from 'lucide-react';
import UserProfileDialog from './UserProfileDialog';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import TextLogoDialog from './TextLogoDialog';
import Cookies from 'js-cookie';
import { AddMetaData } from '../admin/MetaDataComp/AddMetaData';
import { UpdateMetaData } from '../admin/MetaDataComp/UpdateMetaData';
import { deleteMetaDataApiCall, getMetaData } from '@/lib/apis';
import Link from 'next/link';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pageMetaData, setPageMetaData] = useState(null);
    const [isAddMetaData, setIsAddMetaData] = useState(false);
    const [isUpdateMetaData, setIsUpdateMetaData] = useState(false);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [showMetaDialog, setShowMetaDialog] = useState(false);
    const [showTextLogoDialog, setShowTextLogoDialog] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [pageToDelete, setPageToDelete] = useState(null);


    const navigate = useRouter();
    const { toast } = useToast();

    const sitePages = [
        { path: 'home', label: 'Homepage', icon: Home },
        { path: 'results', label: 'Results', icon: Archive },
        { path: 'history', label: 'History', icon: History },
        { path: 'predictions', label: 'Predictions', icon: TrendingUp },
        { path: 'statistics', label: 'Statistics', icon: BarChart3 },
        { path: 'hot-balls', label: 'Hot Balls', icon: TrendingUp },
        { path: 'cold-balls', label: 'Cold Balls', icon: BarChart3 },
        { path: 'overdue-balls', label: 'Overdue Balls', icon: TrendingUp },
        { path: 'tools', label: 'Tools', icon: Calculator },
        { path: 'guide', label: 'How to Play', icon: BookOpen },
        { path: 'news', label: 'News', icon: Newspaper },
        { path: 'about', label: 'About Us', icon: Info },
        { path: 'faq', label: 'FAQ', icon: HelpCircle },
        { path: 'contact', label: 'Contact', icon: Phone },
        { path: 'privacy', label: 'Privacy Policy', icon: Shield },
    ];




    useEffect(() => {
        const auth = Cookies.get('isLogin');

        if (auth == 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('isLogin');
        toast({
            title: 'Logged Out',
            description: 'You have been logged out successfully',
        });
        navigate?.push('/login');
    };

    const handleVisitWebsite = () => {
        window.open('/', '_blank');
    };

    const handleManageAdsTxt = () => {
        navigate?.push('/admin/ads-txt');
    };

    const handleManageGoogleVerification = () => {
        navigate?.push('/admin/google-verification');
    };

    const handleManageNews = () => {
        navigate?.push('/admin/news');
    };

    const handleManagePredictions = () => {
        navigate?.push('/admin/predictions');
    };
    const handleUser = () => {
        navigate?.push('/admin/users');
    };

    const handleManagePageMeta = (page) => {

        setSelectedPage(page);
        setShowMetaDialog(true);
    };

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }




    const handleUpdateMetaData = async (page) => {
        setSelectedPage(page);

        try {
            const SingleMetaData = await getMetaData(page.path);

            if (SingleMetaData) {
                setPageMetaData(SingleMetaData?.data);
                setIsUpdateMetaData(true);
            } else {
                toast({
                    title: "Meta Not Found",
                    description: "No existing metadata found for this page.",
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to fetch metadata.",
                variant: "destructive",
            });
        }
    }


    const handleDelete = async (page) => {

        try {
            const res = await getMetaData(page.path);
            if (res?.data?._id) {
                setPageToDelete({ ...page, _id: res.data._id });
                setShowDeleteDialog(true);
            } else {
                toast({
                    title: "Not Found",
                    description: "No metadata found for this page.",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Could not fetch metadata.",
                variant: "destructive",
            });
        }
    }


    const confirmDelete = async () => {
        try {
            const res = await deleteMetaDataApiCall(pageToDelete._id);
            if (res?.status === "Success") {
                toast({
                    title: "Deleted ✅",
                    description: `${pageToDelete.label} metadata deleted successfully.`,
                });
            } else {
                toast({
                    title: "Failed ❌",
                    description: res?.error || "Failed to delete metadata.",
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "An error occurred during deletion.",
                variant: "destructive",
            });
        } finally {
            setShowDeleteDialog(false);
            setPageToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex sm:flex-row flex-col gap-y-3 justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleVisitWebsite} variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Website
                            </Button>
                            <Button onClick={() => setShowProfileDialog(true)} variant="outline" size="sm">
                                <User className="h-4 w-4 mr-2" />
                                Profile
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
                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Access frequently used admin features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button onClick={handleManagePredictions} className="h-auto p-6 flex flex-col items-center gap-2">
                                <TrendingUp className="h-8 w-8" />
                                <span>Manage Predictions</span>
                            </Button>
                            <Button onClick={handleManageNews} variant="outline" className="h-auto p-6 flex flex-col items-center gap-2">
                                <Newspaper className="h-8 w-8" />
                                <span>Manage News</span>
                            </Button>
                            <Button onClick={handleManageAdsTxt} variant="outline" className="h-auto p-6 flex flex-col items-center gap-2">
                                <FileText className="h-8 w-8" />
                                <span>Ads.txt</span>
                            </Button>
                            <Button onClick={handleManageGoogleVerification} variant="outline" className="h-auto p-6 flex flex-col items-center gap-2">
                                <CheckCircle className="h-8 w-8" />
                                <span>Google Verification</span>
                            </Button>
                            <Button onClick={() => setShowTextLogoDialog(true)} variant="outline" className="h-auto p-6 flex flex-col items-center gap-2">
                                <Type className="h-8 w-8" />
                                <span>Text Logo</span>
                            </Button>

                            <Button
                                onClick={handleUser}
                                variant="outline" className="h-auto p-6 flex flex-col items-center gap-2">
                                <User className="h-8 w-8" />
                                <span>Users</span>
                            </Button>

                        </div>
                    </CardContent>
                </Card>

                {/* Site Management Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Site Management</CardTitle>
                        <CardDescription>Manage meta information for all website pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAddMetaData ? (
                            <>
                                <AddMetaData setIsAddMetaData={setIsAddMetaData} selectedPage={selectedPage} />
                            </>
                        ) : isUpdateMetaData ? (
                            <>

                                <UpdateMetaData setIsUpdateMetaData={setIsUpdateMetaData} selectedPage={selectedPage} pageMetaData={pageMetaData} />
                            </>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sitePages.map((page) => {
                                    const Icon = page.icon;
                                    return (
                                        <div key={page.path} className="border rounded-lg p-4 bg-white">
                                            <div className="flex items-center mb-3">
                                                <Icon className="h-5 w-5 text-blue-600 mr-2" />
                                                <span className="font-medium text-gray-900">{page.label}</span>
                                            </div>
                                            <div className='flex flex-row justify-center gap-x-2'>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPage(page);
                                                        setIsAddMetaData(true);
                                                    }}
                                                    className="w-max "
                                                >
                                                    <SquarePlus size={32} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUpdateMetaData(page)}
                                                    className="w-max"
                                                >
                                                    <SquarePen size={32} />
                                                </Button>
                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(page)}
                                                    className="w-full"
                                                >
                                                    Delete MetaData
                                                </Button> */}

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>

                </Card>
            </div>

            {/* Dialogs */}
            <UserProfileDialog
                open={showProfileDialog}
                onOpenChange={setShowProfileDialog}
            />
            {/* 
            <MetaDataDialog
                open={showMetaDialog}
                onOpenChange={setShowMetaDialog}
                page={selectedPage}
            /> */}

            <TextLogoDialog
                open={showTextLogoDialog}
                onOpenChange={setShowTextLogoDialog}
            />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete metadata for <strong>{pageToDelete?.label}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
};

export default AdminDashboard;
