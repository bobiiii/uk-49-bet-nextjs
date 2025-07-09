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
import { Plus, LogOut, Edit, Trash2, Calendar, Clock, ArrowLeft } from 'lucide-react';

import AddPredictionDialog from '@/components/admin/AddPredictionDialog';
import EditPredictionDialog from '@/components/admin/EditPredictionDialog';
import { DeletePredictionsApiCall, getPredictionsApiCall } from '@/lib/apis';
import { useToast } from '../ui/use-toast';
import Cookies from 'js-cookie';

const PredictionsAdmin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingPrediction, setEditingPrediction] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [predictionId, setPredictionId] = useState(0);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const auth = Cookies.get('isLogin');

        if (auth == 'true') {
            setIsAuthenticated(true);
            loadPredictions();
        }
    }, []);

    const loadPredictions = async () => {

        const data = await getPredictionsApiCall()
        setPredictions(data?.data || [])

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

    const handleAddPrediction = (prediction) => {
        // setPredictions(prev => [...prev, prediction]);
        // const newPrediction = {
        //     ...prediction,
        //     id: Date.now().toString(),
        //     createdAt: new Date().toISOString(),
        // };

        // const updatedPredictions = [...predictions, newPrediction];
        // setPredictions(updatedPredictions);

        // localStorage.setItem('adminPredictions', JSON.stringify(updatedPredictions));

        // toast({
        //     title: 'Prediction Added',
        //     description: 'New prediction has been added successfully',
        // });
    };

    const handleEditPrediction = (id, updatedData) => {
        const updatedPredictions = predictions.map(p =>
            p._id === id ? { ...p, ...updatedData } : p
        );

        setPredictions(updatedPredictions);
    };

    const handleDeletePrediction = (id) => {
        setShowDeleteDialog(true)
        setPredictionId(id)




        // const updatedPredictions = predictions.filter(p => p.id !== id);
        // setPredictions(updatedPredictions);
        // localStorage.setItem('adminPredictions', JSON.stringify(updatedPredictions));

        // toast({
        //     title: 'Prediction Deleted',
        //     description: 'Prediction has been removed successfully',
        // });
    };

    const handleConfirmDelete = async () => {

        const res = await DeletePredictionsApiCall(predictionId)

        if (res?.status === "Success") {
            const updatedPredictions = predictions?.filter(item => item?._id !== predictionId)
            setPredictions(updatedPredictions)
            toast({
                title: "Prediction Deleted ✅",
                description: `${res?.message}`,
                variant: "default",
                duration: 3000,
            });

        } else {
            toast({
                title: "Failed to Delete ❌",
                description: res?.message || "Something went wrong while Deleting Prediction.",
                variant: "destructive",
                duration: 3000,
            });
        }
    }

    const openEditDialog = (prediction) => {
        setEditingPrediction(prediction);
        setShowEditDialog(true);
    };

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b sm:py-0 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex sm:flex-row flex-col gap-y-3 justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Predictions Management</h1>
                        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{predictions?.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {predictions?.filter(p => p.status === 'Active')?.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lunchtime Predictions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {predictions?.filter(p => p.drawType === 'Lunchtime')?.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Teatime Predictions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {predictions?.filter(p => p.drawType === 'Teatime')?.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex sm:flex-row flex-col gap-y-3 justify-between sm:items-center items-start">
                            <div>
                                <CardTitle>Predictions Management</CardTitle>
                                <CardDescription className='mt-2'>Manage UK49s predictions for both draws (3 numbers each)</CardDescription>
                            </div>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Prediction
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {predictions?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No predictions found. Add your first prediction to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Draw Type</TableHead>
                                            <TableHead>Numbers</TableHead>
                                            <TableHead>Confidence</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {predictions?.map((prediction) => (
                                            <TableRow key={prediction._id}>
                                                <TableCell>{prediction.date.split('T')[0]}</TableCell>
                                                <TableCell className="capitalize">{prediction.drawType}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {prediction.numbers.map((num, index) => (
                                                            <span key={index} className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-full">
                                                                {num}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{prediction.confidenceLevel}%</TableCell>
                                                <TableCell>
                                                    <Badge variant={prediction.status === 'active' ? 'default' : 'secondary'}>
                                                        {prediction.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(prediction)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeletePrediction(prediction._id)}
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

            <AddPredictionDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddPrediction} setPredictions={setPredictions} />
            <EditPredictionDialog open={showEditDialog} onOpenChange={setShowEditDialog} prediction={editingPrediction} onEdit={handleEditPrediction} />

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete Prediction.
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

export default PredictionsAdmin;
