import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { toast } from "sonner";

interface AddModuleUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit?: any;
}

export const AddModuleUserModal = ({ isOpen, onClose, onSuccess, userToEdit }: AddModuleUserModalProps) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("seller");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        // Seller Fields
        business_name: "",
        tax_id: "",
        bank_name: "",
        bank_account_number: "",
        // Delivery Fields
        vehicle_plate_number: "",
        vehicle_model: "",
        license_number: "",
        // Provider Fields
        company_name: "",
        experience_years: "",
        operating_hours: "",
        certification_details: "",
        // Support Fields
        employee_id: "",
        department: "",
        shift_start: "",
        shift_end: ""
    });

    useEffect(() => {
        if (userToEdit) {
            setRole(userToEdit.role);
            setFormData({
                ...formData,
                name: userToEdit.name,
                email: userToEdit.email,
                phone: userToEdit.phone || "",
                // Load profile data if exists
                ...(userToEdit.sellerProfile || {}),
                ...(userToEdit.deliveryProfile || {}),
                ...(userToEdit.serviceProviderProfile || {}),
                ...(userToEdit.supportProfile || {}),
            });
        } else {
            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                phone: "",
                business_name: "",
                tax_id: "",
                bank_name: "",
                bank_account_number: "",
                vehicle_plate_number: "",
                vehicle_model: "",
                license_number: "",
                company_name: "",
                experience_years: "",
                operating_hours: "",
                certification_details: "",
                employee_id: "",
                department: "",
                shift_start: "",
                shift_end: ""
            });
            setRole("seller");
        }
    }, [userToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                role,
                // Ensure profile data is structured if your backend expects nested objects, 
                // OR send flat and handle in controller. 
                // Currently AdminController.createUser/updateUser expects flat fields or specific structure?
                // The current AdminController just merges req.body into User. 
                // WE NEED TO UPDATE ADMIN CONTROLLER TO HANDLE PROFILE CREATION TOO.
                // For now, let's assume we'll update the controller to handle these extra fields.
            };

            if (userToEdit) {
                await api.put(`/admin/users/${userToEdit.id}`, payload);
                toast.success("User updated successfully");
            } else {
                await api.post("/admin/users", payload);
                toast.success("User created successfully");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{userToEdit ? "Edit Module Person" : "Add Module Person"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required type="email" />
                        </div>
                        {!userToEdit && (
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required type="password" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={role} onValueChange={setRole} disabled={!!userToEdit}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seller">Seller</SelectItem>
                                    <SelectItem value="delivery_boy">Delivery Agent</SelectItem>
                                    <SelectItem value="service_provider">Service Provider</SelectItem>
                                    <SelectItem value="support_agent">Support Agent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold mb-3">Profile Details</h3>

                        {role === 'seller' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Business Name</Label>
                                    <Input value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax ID</Label>
                                    <Input value={formData.tax_id} onChange={e => setFormData({ ...formData, tax_id: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank Name</Label>
                                    <Input value={formData.bank_name} onChange={e => setFormData({ ...formData, bank_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Account Number</Label>
                                    <Input value={formData.bank_account_number} onChange={e => setFormData({ ...formData, bank_account_number: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {role === 'delivery_boy' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Vehicle Plate Number</Label>
                                    <Input value={formData.vehicle_plate_number} onChange={e => setFormData({ ...formData, vehicle_plate_number: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vehicle Model</Label>
                                    <Input value={formData.vehicle_model} onChange={e => setFormData({ ...formData, vehicle_model: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>License Number</Label>
                                    <Input value={formData.license_number} onChange={e => setFormData({ ...formData, license_number: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {role === 'service_provider' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Experience (Years)</Label>
                                    <Input type="number" value={formData.experience_years} onChange={e => setFormData({ ...formData, experience_years: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Operating Hours</Label>
                                    <Input value={formData.operating_hours} onChange={e => setFormData({ ...formData, operating_hours: e.target.value })} placeholder="9AM - 6PM" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Certifications</Label>
                                    <Input value={formData.certification_details} onChange={e => setFormData({ ...formData, certification_details: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {role === 'support_agent' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Employee ID</Label>
                                    <Input value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Shift Start</Label>
                                    <Input type="time" value={formData.shift_start} onChange={e => setFormData({ ...formData, shift_start: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Shift End</Label>
                                    <Input type="time" value={formData.shift_end} onChange={e => setFormData({ ...formData, shift_end: e.target.value })} />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button className="w-full bg-electric-blue" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Person"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
