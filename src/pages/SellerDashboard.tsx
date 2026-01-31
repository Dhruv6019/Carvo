import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, DollarSign, Plus, Edit, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { exportToCSV } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Note: assuming Textarea component exists or use standard textarea with class


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const [parts, setParts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [deliveryAgents, setDeliveryAgents] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [assigningOrder, setAssigningOrder] = useState<any>(null);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [editingPart, setEditingPart] = useState<any>(null);
    const [viewingOrder, setViewingOrder] = useState<any>(null);
    const [partsPage, setPartsPage] = useState(1);
    const [ordersPage, setOrdersPage] = useState(1);
    const itemsPerPage = 10;
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        categoryId: "",
        image_url: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isCategoryLoading, setIsCategoryLoading] = useState<number | string | null>(null);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            categoryId: "",
            image_url: ""
        });
        setEditingPart(null);
    };

    const handleAddPart = async () => {
        setIsSubmitting(true);
        try {
            const res = await api.post("/seller/parts", formData);
            setParts([...parts, res.data]);
            toast.success("Part added successfully");
            setIsAddOpen(false);
            resetForm();
        } catch (error) {
            toast.error("Failed to add part");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePart = async () => {
        if (!editingPart) return;
        setIsSubmitting(true);
        try {
            const res = await api.put(`/seller/parts/${editingPart.id}`, formData);
            setParts(parts.map(p => p.id === editingPart.id ? res.data : p));
            toast.success("Part updated successfully");
            setEditingPart(null);
        } catch (error) {
            toast.error("Failed to update part");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePart = async (id: number) => {
        if (!confirm("Are you sure you want to delete this part?")) return;
        setIsDeleting(id);
        try {
            await api.delete(`/seller/parts/${id}`);
            setParts(parts.filter(p => p.id !== id));
            toast.success("Part deleted successfully");
        } catch (error) {
            toast.error("Failed to delete part");
        } finally {
            setIsDeleting(null);
        }
    };

    const openEditPart = (part: any) => {
        setEditingPart(part);
        setFormData({
            name: part.name,
            description: part.description,
            price: part.price,
            stock_quantity: part.stock_quantity,
            categoryId: part.categoryId?.toString() || "",
            image_url: part.image_url || ""
        });
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const partsRes = await api.get("/seller/parts");
                setParts(partsRes.data);

                const ordersRes = await api.get("/seller/orders");
                setOrders(ordersRes.data);

                const agentsRes = await api.get("/seller/delivery-agents");
                setDeliveryAgents(agentsRes.data);

                const categoriesRes = await api.get("/seller/categories");
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error("Error fetching seller data", error);
                toast.error("Failed to load seller data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAssignOrder = async () => {
        if (!assigningOrder || !selectedAgent) return;
        try {
            await api.post("/seller/orders/assign", {
                orderId: assigningOrder.id,
                agentId: selectedAgent
            });
            toast.success("Order assigned to delivery agent");
            setAssigningOrder(null);
            setSelectedAgent("");
            // Refresh orders
            const ordersRes = await api.get("/seller/orders");
            setOrders(ordersRes.data);
        } catch (error) {
            toast.error("Failed to assign order");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background">
            <Navigation />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-display font-black text-foreground mb-4">
                            Seller <span className="bg-gradient-to-r from-electric-blue to-burnt-orange bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">Manage your inventory and orders</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                        </TabsList>

                        <TabsContent value="inventory" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-foreground">My Parts</h2>
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={() => exportToCSV(parts, "inventory")}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export CSV
                                    </Button>
                                    <Button className="bg-electric-blue" onClick={() => setIsAddOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Part
                                    </Button>
                                </div>
                            </div>
                            <Card className="p-6">
                                <div className="space-y-4">
                                    {parts.slice((partsPage - 1) * itemsPerPage, partsPage * itemsPerPage).map((part) => (
                                        <div key={part.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="grid grid-cols-4 gap-4 flex-1">
                                                <div>
                                                    <p className="font-medium text-foreground">{part.name}</p>
                                                    <p className="text-sm text-muted-foreground">{part.description}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">₹{part.price}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Stock: {part.stock_quantity}</p>
                                                </div>
                                                <div>
                                                    <Badge variant={part.stock_quantity > 0 ? "default" : "destructive"}>
                                                        {part.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditPart(part)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-500"
                                                    onClick={() => handleDeletePart(part.id)}
                                                    disabled={isDeleting === part.id}
                                                >
                                                    <Trash2 className={`w-4 h-4 ${isDeleting === part.id ? 'animate-spin' : ''}`} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {parts.length === 0 && <p className="text-center text-muted-foreground py-8">No parts in inventory.</p>}

                                    {parts.length > itemsPerPage && (
                                        <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPartsPage(p => Math.max(1, p - 1))}
                                                disabled={partsPage === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-1" />
                                                Previous
                                            </Button>
                                            <span className="text-sm text-muted-foreground">
                                                Page {partsPage} of {Math.ceil(parts.length / itemsPerPage)}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPartsPage(p => Math.min(Math.ceil(parts.length / itemsPerPage), p + 1))}
                                                disabled={partsPage === Math.ceil(parts.length / itemsPerPage)}
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="categories" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-foreground">Manage Categories</h2>
                                <Button
                                    className="bg-electric-blue"
                                    disabled={isCategoryLoading === 'adding'}
                                    onClick={async () => {
                                        const name = prompt("Enter category name:");
                                        if (!name) return;
                                        setIsCategoryLoading('adding');
                                        try {
                                            const res = await api.post("/seller/categories", { name });
                                            setCategories([...categories, res.data]);
                                            toast.success("Category added");
                                        } catch (err) {
                                            toast.error("Failed to add category");
                                        } finally {
                                            setIsCategoryLoading(null);
                                        }
                                    }}
                                >
                                    <Plus className={`w-4 h-4 mr-2 ${isCategoryLoading === 'adding' ? 'animate-spin' : ''}`} />
                                    {isCategoryLoading === 'adding' ? "Adding..." : "Add Category"}
                                </Button>
                            </div>
                            <Card className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <span className="font-medium">{cat.name}</span>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="sm" onClick={async () => {
                                                    const newName = prompt("Edit category name:", cat.name);
                                                    if (!newName || newName === cat.name) return;
                                                    try {
                                                        const res = await api.put(`/seller/categories/${cat.id}`, { name: newName });
                                                        setCategories(categories.map(c => c.id === cat.id ? res.data : c));
                                                        toast.success("Category updated");
                                                    } catch (err) {
                                                        toast.error("Failed to update category");
                                                    }
                                                }}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500"
                                                    disabled={isCategoryLoading === cat.id}
                                                    onClick={async () => {
                                                        if (!confirm(`Delete category "${cat.name}"?`)) return;
                                                        setIsCategoryLoading(cat.id);
                                                        try {
                                                            await api.delete(`/seller/categories/${cat.id}`);
                                                            setCategories(categories.filter(c => c.id !== cat.id));
                                                            toast.success("Category deleted");
                                                        } catch (err) {
                                                            toast.error("Failed to delete category. It might be in use.");
                                                        } finally {
                                                            setIsCategoryLoading(null);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className={`w-4 h-4 ${isCategoryLoading === cat.id ? 'animate-spin' : ''}`} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {categories.length === 0 && <p className="col-span-full text-center text-muted-foreground py-4">No categories created yet.</p>}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-foreground">Orders</h2>
                                <Button variant="outline" onClick={() => exportToCSV(orders, "orders")}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                            <Card className="p-6">
                                <div className="space-y-4">
                                    {orders.slice((ordersPage - 1) * itemsPerPage, ordersPage * itemsPerPage).map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium text-foreground">Order #{order.id}</p>
                                                <p className="text-sm font-semibold text-foreground">{order.customer?.name}</p>
                                                <p className="text-sm text-muted-foreground">Total: ₹{order.total_amount}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Status: <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" onClick={() => setViewingOrder(order)}>View Details</Button>
                                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                    <Button variant="secondary" onClick={() => setAssigningOrder(order)}>Assign Delivery</Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders yet.</p>}

                                    {orders.length > itemsPerPage && (
                                        <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                                                disabled={ordersPage === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-1" />
                                                Previous
                                            </Button>
                                            <span className="text-sm text-muted-foreground">
                                                Page {ordersPage} of {Math.ceil(orders.length / itemsPerPage)}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setOrdersPage(p => Math.min(Math.ceil(orders.length / itemsPerPage), p + 1))}
                                                disabled={ordersPage === Math.ceil(orders.length / itemsPerPage)}
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>


            {/* Add Part Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Part</DialogTitle>
                        <DialogDescription>Add a new part to your inventory.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleAddPart} disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Part"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Part Dialog */}
            <Dialog open={!!editingPart} onOpenChange={(open) => !open && setEditingPart(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Part</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPart(null)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleUpdatePart} disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Order Dialog */}
            <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Order #{viewingOrder?.id}</DialogTitle>
                        <DialogDescription>Date: {viewingOrder?.created_at && new Date(viewingOrder.created_at).toLocaleDateString()}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-semibold mb-2">Items:</p>
                        <div className="space-y-2">
                            {viewingOrder?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between border-b pb-2">
                                    <span>{item.part?.name || "Unknown Part"} (x{item.quantity})</span>
                                    <span>₹{item.price}</span>
                                </div>
                            ))}
                            {!viewingOrder?.items && <p className="text-muted-foreground">No items details available.</p>}
                        </div>
                        <div className="mt-4 flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{viewingOrder?.total_amount}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Assign Delivery Dialog */}
            <Dialog open={!!assigningOrder} onOpenChange={(open) => !open && setAssigningOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Order #{assigningOrder?.id}</DialogTitle>
                        <DialogDescription>Select a delivery agent for this order.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Delivery Agent</Label>
                        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                            <SelectTrigger className="w-full mt-2">
                                <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                {deliveryAgents.map((agent) => (
                                    <SelectItem key={agent.id} value={agent.id.toString()}>
                                        {agent.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssigningOrder(null)}>Cancel</Button>
                        <Button onClick={handleAssignOrder}>Assign</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default SellerDashboard;
