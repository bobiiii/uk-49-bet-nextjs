"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Quill } from "react-quill-new";
import { updateNewsApiCall } from "@/lib/apis";
import { useToast } from "../ui/use-toast";
import { generateSlug, handleImageUpload } from "@/utils/functions";

// ✅ Fix list format error (register `list`)
const List = Quill.import("formats/list");
Quill.register("formats/list", List, true);

const EditNewsDialog = ({
  open,
  onOpenChange,
  article,
  onEdit,
  updateID,
  handleAddArticle,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    date: "",
    time: "",
    author: "",
    category: "",
    featured: false,
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const prevImagesRef = useRef([]);
  const quillRef = useRef();

  const { toast } = useToast();

  const checkDeletedImages = () => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const html = editor.root.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const currentImages = Array.from(doc.querySelectorAll("img")).map((img) =>
      img.getAttribute("src")
    );

    console.log("🖼️ Current images:", currentImages);

    const deletedImages = prevImagesRef.current.filter(
      (src) => !currentImages.includes(src)
    );
    console.log("🗑️ Deleted images:", deletedImages);

    deletedImages.forEach(async (src) => {
      if (src.includes("/news/")) {
        try {
          const filename = src.split("/news/")[1]; // Only extract the filename part
          await fetch("/api/news/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename }),
          });
        } catch (err) {
          console.error("❌ Failed to delete image", err);
        }
      }
    });

    prevImagesRef.current = currentImages;
  };

  useEffect(() => {
    if (!open || !quillRef.current) return;

    const editor = quillRef.current.getEditor();
    const html = editor.root.innerHTML;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const initialImages = Array.from(doc.querySelectorAll("img")).map((img) =>
      img.getAttribute("src")
    );
    prevImagesRef.current = initialImages;
  }, [open]);

  const categories = [
    "Jackpot News",
    "Analysis",
    "Winner Stories",
    "Technology",
    "General News",
    "Statistics",
    "Tips & Tricks",
  ];

  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => handleImageUpload(quillRef),
      },
    },
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "color",
    "background",
    "align",
    "script",
  ];

  useEffect(() => {


    if (article) {
      console.log('article', article);
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        // date: article.date,
        date: "2025-07-25",
        time: article.time,
        author: article.author,
        category: article.category,
        featured: article.featured,
        status: article.status,
      });
    }
  }, [article]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updateID) return;
    setIsLoading(true);
    // Filter only modified or present fields
    const payload = {};
    for (let key in formData) {
      if (
        formData[key] !== undefined &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        payload[key] = formData[key];
      }
    }

    try {
      const res = await updateNewsApiCall(payload, updateID);
      if (res.status === "Success") {
        setIsLoading(false);
        toast({
          title: "News Updated ✅",
          description: `${res.message}`,
          variant: "default",
          duration: 3000,
        });
        handleAddArticle();
        onEdit(); // notify parent to reload
        onOpenChange(false);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast({
        title: "Failed to Updated ❌",
        description: `${res.message}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "title" && !slugEdited) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  if (!article) return null;

  return (
    <>
      <style>{`
        .ql-editor {
          min-height: 300px !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          line-height: 1.6 !important;
          font-family: inherit !important;
          word-wrap: break-word !important;
          white-space: normal !important;
          width: 100% !important;
        }
        .ql-container {
          font-family: inherit !important;
          width: 800px !important;
          max-width: none !important;
        }
        .ql-toolbar {
          border-top: 1px solid #ccc !important;
          border-left: 1px solid #ccc !important;
          border-right: 1px solid #ccc !important;
          width: 800px !important;
          max-width: none !important;
        }
        .ql-container {
          border-bottom: 1px solid #ccc !important;
          border-left: 1px solid #ccc !important;
          border-right: 1px solid #ccc !important;
        }
        .quill-container-wrapper {
          width: 800px !important;
          max-width: none !important;
          overflow-x: auto !important;
        }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[900px] max-w-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Update the SEO-optimized news article information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  handleInputChange("slug", e.target.value);
                }}
                placeholder="auto-generated from title, but you can edit"
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <div className="quill-container-wrapper border rounded-md overflow-hidden">
                <ReactQuill
                  ref={quillRef}

                  theme="snow"
                  value={formData.content}
                  onChange={(value) => {
                    handleInputChange("content", value);

                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Backspace" || e.key === "Delete") {
                      setTimeout(() => {
                        checkDeletedImages();
                      }, 100); // Delay ensures DOM updates finish
                    }
                  }}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your SEO article content here..."
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Use H1, H2, H3 headings for better SEO structure. Add
                bold/italic text for emphasis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date ? formData.date.split("T")[0] : ""}

                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="14:30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isLoading ? "Updating..." : "Update Article"}{" "}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditNewsDialog;
