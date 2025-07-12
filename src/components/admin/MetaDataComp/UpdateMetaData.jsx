"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { updateMetaDataApiCall } from "@/lib/apis";

export function UpdateMetaData({ setIsUpdateMetaData, selectedPage, pageMetaData }) {
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


    useEffect(() => {
        if (pageMetaData) {
            setForm({
                entityType: type,
                title: pageMetaData.title || "",
                description: pageMetaData.description || "",
                keywords: (pageMetaData.keywords || []).join(", "),
                canonical: pageMetaData.canonical || "",
                ogTitle: pageMetaData.ogTitle || "",
                ogDescription: pageMetaData.ogDescription || "",
                ogImage: pageMetaData.ogImage || "",
                ogImageAlt: pageMetaData.ogImageAlt || "",
            });
        }
    }, [pageMetaData, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const { toast } = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const metaData = {
            ...form,
            keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        };
        console.log("metaData", metaData);

        const res = await updateMetaDataApiCall(metaData, type, pageMetaData?._id);
        if (res?.status === 'Success') {
            setIsLoading(false);
            toast({
                title: "MetaData Updated ✅",
                description: `${selectedPage?.label} page metadata Updated successfully.`,
                variant: "default",
                duration: 3000,
            });
            setIsUpdateMetaData(false)
        } else {
            toast({
                title: "Failed to Update ❌",
                description: res?.error || "Something went wrong while updating metadata.",
                variant: "destructive",
                duration: 3000,
            });
            setIsLoading(false);
        }

    };

    return (
        <div className="w-full max-w-4xl mx-auto sm::py-4 py-4 sm:px-4 px-0">
            <h2 className="text-xl font-semibold mb-4">Updated {selectedPage?.label} Meta Data</h2>
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

                    {/* <div className="grid gap-2">
                        <Label htmlFor="ogImageId">Graph Image ID</Label>
                        <Input
                            id="ogImageId"
                            name="ogImageId"
                            value={form.ogImageId}
                            onChange={handleChange}
                            placeholder="Image ID or URL"
                        />
                    </div> */}


                    <div className="grid gap-2">
                        <Label htmlFor="ogImage">Graph Image</Label>
                        <Input
                            id="ogImage"
                            name="ogImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setForm((prev) => ({
                                    ...prev,
                                    ogImage: e.target.files[0],
                                }));
                            }}
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
                        onClick={() => setIsUpdateMetaData(false)}>Cancel </Button>
                    <Button
                        className="w-full"
                        type="submit">{isLoading ? "Updating..." : "Update MetaData"}</Button>
                </div>
            </form>
        </div>
    );
}
