"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '../ui/use-toast';
import { addUserApiCall } from '@/lib/apis';

const userSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),

    password: z
        .string({ required_error: 'Password is required' })
        .min(3, 'Password must be at least 3 characters long'),
});

export default function AddUserModel({ open, onOpenChange, onAdd, setPrediction }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);

        const res = await addUserApiCall(data)
        if (res?.status === "Success") {

            toast({
                title: "User Added ✅",
                description: `${res.message}`,
                variant: "default",
                duration: 3000,
            });
            setIsLoading(false);
            onAdd && onAdd(data);
            onOpenChange(false);
            form.reset();

        } else {
            setIsLoading(false);
            toast({
                title: "Failed to Add ❌",
                description: `${res.error}`,
                variant: "destructive",
                duration: 3000,
            })
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] max-w-[92%]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user by providing email and password
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="user@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{isLoading ? "Adding..." : "Add User"}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
