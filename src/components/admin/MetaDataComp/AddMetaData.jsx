"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addMetaDataApiCall } from "@/lib/apis";
import { useToast } from "@/components/ui/use-toast";

export function AddMetaData({ setIsAddMetaData, selectedPage }) {
    const type = selectedPage?.path
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        entityType: type,
        title: "",
        description: "",
        keywords: "",
        canonical: "",
        ogTitle: "",
        ogDescription: "",
        ogImageId: "",
        ogImageAlt: "",
    });



    const { toast } = useToast();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const metaData = {
            ...form,
            keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        };

        const res = await addMetaDataApiCall(metaData, type);
       
        if (res?.status === 'Success') {
            setIsLoading(false);
            toast({
                title: "MetaData Added ✅",
                description: `${selectedPage?.label} page metadata added successfully.`,
                variant: "default",
                duration: 3000,
            });
            setIsAddMetaData(false)
        } else {
            toast({
                title: "Failed to Add ❌",
                description: res?.error || "Something went wrong while adding metadata.",
                variant: "destructive",
                duration: 3000,
            });
            setIsLoading(false);
        }

    };

    return (
        <div className="w-full max-w-4xl mx-auto sm::py-4 py-4 sm:px-4 px-0">
            <h2 className="text-xl font-semibold mb-4">Add {selectedPage?.label} Meta Data</h2>
            <form
                onSubmit={handleSubmit}
                className="w-full"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="grid gap-2">
                        <Label htmlFor="title">Meta Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Title..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                            id="keywords"
                            name="keywords"
                            value={form.keywords}
                            onChange={handleChange}
                            placeholder="e.g. draw, uk49s"
                        />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="description">Meta Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="canonical">Canonical URL</Label>
                        <Input
                            id="canonical"
                            name="canonical"
                            value={form.canonical}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ogTitle">Graph Title</Label>
                        <Input
                            id="ogTitle"
                            name="ogTitle"
                            value={form.ogTitle}
                            onChange={handleChange}
                            placeholder="OpenGraph Title"
                        />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="ogDescription">Graph Description</Label>
                        <Textarea
                            id="ogDescription"
                            name="ogDescription"
                            value={form.ogDescription}
                            onChange={handleChange}
                            placeholder="OpenGraph Description..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ogImageId">Graph Image </Label>
                        <Input
                            id="ogImageId"
                            name="ogImageId"
                            value={form.ogImageId}
                            onChange={handleChange}
                            placeholder="Image Feature will be added later"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ogImageAlt">Graph Image Alt</Label>
                        <Input
                            id="ogImageAlt"
                            name="ogImageAlt"
                            value={form.ogImageAlt}
                            onChange={handleChange}
                            placeholder="Alt text"
                        />
                    </div>

                </div>

                <div className="w-full flex sm:flex-row flex-col  justify-end items-end me-auto gap-3 mt-6">

                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setIsAddMetaData(false)}>Cancel </Button>
                    <Button
                        className="w-full"
                        type="submit"> {isLoading ? "Adding..." : "Add MetaData"}</Button>
                </div>
            </form>
        </div>
    );
}
