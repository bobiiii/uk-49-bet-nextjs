import React, { useState, useEffect } from 'react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { updatePredictionApiCall } from '@/lib/apis';
import { useToast } from '../ui/use-toast';

const predictionSchema = z.object({
    date: z.date({ required_error: 'Date is required' }),
    drawType: z.enum(['Lunchtime', 'Teatime'], {
        required_error: 'Draw type is required',
    }),
    numbers: z.array(z.number()).length(3, 'Exactly 3 numbers required'),
    confidence: z.number().min(1).max(100),
    status: z.enum(['Active', 'Completed']),
});

export default function EditPredictionDialog({ open, onOpenChange, prediction, onEdit }) {

    const [numberInputs, setNumberInputs] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(predictionSchema),
        defaultValues: {
            date: new Date(),
            drawType: '',
            numbers: [],
            confidence: 0,
            status: '',
        },
    });

    useEffect(() => {
        if (prediction) {
            form.setValue('date', new Date(prediction.date));
            form.setValue('drawType', prediction.drawType);
            form.setValue('numbers', prediction.numbers);
            form.setValue('confidence', prediction.confidenceLevel);
            form.setValue('status', prediction.status);

            // Set number inputs
            const inputs = ['', '', ''];
            prediction.numbers.forEach((num, index) => {
                if (index < 3) inputs[index] = num.toString();
            });
            setNumberInputs(inputs);
        }
    }, [prediction, form]);


    const handleNumberChange = (index, value) => {
        const newInputs = [...numberInputs];
        newInputs[index] = value;
        setNumberInputs(newInputs);

        const numbers = newInputs
            .map((input) => parseInt(input))
            .filter((num) => !isNaN(num) && num >= 1 && num <= 49);

        form.setValue('numbers', numbers);
    };


    const { toast } = useToast()

    const onSubmit = async (data) => {
        if (!prediction) return;
        setIsLoading(true)
        const formattedData = {
            date: format(data.date, 'yyyy-MM-dd'),
            drawType: data.drawType,
            numbers: data.numbers,
            confidence: data.confidence,
            status: data.status,
        };


        const res = await updatePredictionApiCall(formattedData, prediction._id)
        if (res?.status === "Success") {
            setIsLoading(false)
            const updatedData = res?.data
            onEdit(prediction._id, updatedData);
            toast({
                title: "Prediction Updated ✅",
                description: `${res?.message}`,
                variant: "default",
                duration: 3000,
            });
            onOpenChange(false);
            form.reset();
            setNumberInputs(['', '', '']);

        } else {
            setIsLoading(true)
            toast({
                title: "Failed to Update ❌",
                description: res?.message || "Something went wrong while updating Prediction.",
                variant: "destructive",
                duration: 3000,
            });
        }

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Prediction</DialogTitle>
                    <DialogDescription>
                        Update prediction for UK49s lottery draws (3 numbers required)
                    </DialogDescription>
                </DialogHeader>

                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date < new Date('1900-01-01')}
                                                initialFocus
                                                className="p-3 pointer-events-auto"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="drawType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Draw Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select draw type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Lunchtime">Lunchtime</SelectItem>
                                            <SelectItem value="Teatime">Teatime</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label>Numbers (1-49) - All 3 required</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {numberInputs.map((value, index) => (
                                    <Input
                                        key={index}
                                        type="number"
                                        min="1"
                                        max="49"
                                        value={value}
                                        onChange={(e) => handleNumberChange(index, e.target.value)}
                                        placeholder={`#${index + 1}`}
                                        className="text-center"
                                        required
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500">Enter exactly 3 numbers between 1 and 49</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="confidence"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confidence Level (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="100"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">{isLoading ? "Updating" : "Update Prediction"} </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
