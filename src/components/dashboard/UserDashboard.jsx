"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Plus, LogOut, Edit, Trash2, ArrowLeft } from 'lucide-react';

import EditPredictionDialog from '@/components/admin/EditPredictionDialog';
import { DeletePredictionsApiCall, DeleteUserApiCall, getPredictionsApiCall, getUserApiCall } from '@/lib/apis';
import { useToast } from '../ui/use-toast';
import Cookies from 'js-cookie';
import AddUserModel from '../admin/AddUserModel';

const UserDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const auth = Cookies.get('isLogin');

        if (auth === 'true') {
            setIsAuthenticated(true);
            loadUserData();
        }
    }, []);

    const loadUserData = async () => {
        const userData = await getUserApiCall();
        setUsers(userData?.data || []);
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
        router.push('/admin');
    };

    const handleAddUser = (newUser) => {
        setUsers((prev) => [newUser, ...prev]);
    };

    const handleDeleteUser = (id) => {
        setUserIdToDelete(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        const res = await DeleteUserApiCall(userIdToDelete);

        if (res?.status === "Success") {
            const updatedUsers = users.filter((u) => u._id !== userIdToDelete);
            setUsers(updatedUsers);
            toast({
                title: "User Deleted ✅",
                description: res.message,
            });
        } else {
            toast({
                title: "Failed to Delete ❌",
                description: res?.error || "Something went wrong while deleting user.",
                variant: "destructive",
            });
        }

        setShowDeleteDialog(false);
    };

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b sm:py-0 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex sm:flex-row flex-col gap-y-3 justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">Users Management</h1>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleBackToDashboard} variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <Button onClick={handleLogout} variant="outline" size="sm">
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardHeader>
                        <div className="flex sm:flex-row flex-col gap-y-3 justify-between sm:items-center items-start">
                            <div>
                                <CardTitle>Users</CardTitle>
                                <CardDescription className="mt-2">Manage dashboard users</CardDescription>
                            </div>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No users found. Add a user to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users?.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {/* You can add edit functionality here if needed */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteUser(user._id)}
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

            <AddUserModel open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddUser} />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete the user.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UserDashboard;
