import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface GalleryItem {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
    client: string;
    tags: string[] | string; // Handle both just in case
}

export const GalleryManagement = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", category: "paint", imageUrl: "", client: "", tags: "" });

    const categories = [
        { id: "paint", name: "Custom Paint" },
        { id: "wheels", name: "Alloy Wheels" },
        { id: "interior", name: "Interior" },
        { id: "performance", name: "Performance" },
        { id: "lighting", name: "LED Lighting" },
    ];

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await api.get("/gallery");
            setItems(res.data);
        } catch (error) {
            toast.error("Failed to load gallery items");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeed = async () => {
        try {
            await api.post("/gallery/seed");
            toast.success("Gallery seeded successfully!");
            fetchGallery();
        } catch (error) {
            toast.error("Failed to seed gallery");
        }
    };

    const handleAdd = async () => {
        try {
            const payload = {
                ...newItem,
                tags: newItem.tags.split(",").map(t => t.trim())
            };
            await api.post("/gallery", payload);
            toast.success("Image added successfully");
            setIsAddOpen(false);
            setNewItem({ title: "", category: "paint", imageUrl: "", client: "", tags: "" });
            fetchGallery();
        } catch (error) {
            toast.error("Failed to add image");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/gallery/${id}`);
            toast.success("Image deleted");
            setItems(items.filter(i => i.id !== id));
        } catch (error) {
            toast.error("Failed to delete image");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gallery Management</h2>
                    <p className="text-muted-foreground">Manage showcase images for the website.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSeed}>
                        Seed Defaults
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-electric-blue">
                                <Plus className="w-4 h-4 mr-2" /> Add Image
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Image</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} placeholder="e.g. Matte Black BMW" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image URL</label>
                                    <Input value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client Name</label>
                                    <Input value={newItem.client} onChange={e => setNewItem({ ...newItem, client: e.target.value })} placeholder="Client Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags (comma separated)</label>
                                    <Input value={newItem.tags} onChange={e => setNewItem({ ...newItem, tags: e.target.value })} placeholder="Matte, Wrap, Carbon" />
                                </div>
                                <Button className="w-full bg-electric-blue" onClick={handleAdd}>Add to Gallery</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden group">
                        <div className="relative aspect-video">
                            <ImageWithFallback src={item.imageUrl} alt={item.title} className="group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold truncate">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {(Array.isArray(item.tags) ? item.tags : (item.tags as string || "").split(',')).map((tag: string, idx: number) => (
                                    <span key={idx} className="bg-secondary text-secondary-foreground text-[10px] px-2 py-1 rounded">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {items.length === 0 && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
                    <p>No images found. Click "Seed Defaults" to load initial data.</p>
                </div>
            )}
        </div>
    );
};
