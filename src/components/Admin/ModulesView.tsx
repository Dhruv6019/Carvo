import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit } from "lucide-react";

interface ModulesViewProps {
    users: any[];
    onAddUser: () => void;
    onEditUser: (user: any) => void;
}

export const ModulesView = ({ users, onAddUser, onEditUser }: ModulesViewProps) => {
    const sellers = users.filter(u => u.role === 'seller');
    const deliveryBoys = users.filter(u => u.role === 'delivery_boy');
    const providers = users.filter(u => u.role === 'service_provider');
    const supportAgents = users.filter(u => u.role === 'support_agent');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-foreground">Modules Management</h2>
                <Button className="bg-electric-blue" onClick={onAddUser}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module Person
                </Button>
            </div>

            <Tabs defaultValue="sellers" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sellers">Sellers ({sellers.length})</TabsTrigger>
                    <TabsTrigger value="delivery">Delivery ({deliveryBoys.length})</TabsTrigger>
                    <TabsTrigger value="providers">Service Providers ({providers.length})</TabsTrigger>
                    <TabsTrigger value="support">Support ({supportAgents.length})</TabsTrigger>
                </TabsList>

                {/* Sellers Content */}
                <TabsContent value="sellers">
                    <Card className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Bank Info</TableHead>
                                    <TableHead>Tax ID</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sellers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </TableCell>
                                        <TableCell>{user.sellerProfile?.business_name || '-'}</TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                <p>{user.sellerProfile?.bank_name}</p>
                                                <p>{user.sellerProfile?.bank_account_number}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.sellerProfile?.tax_id || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{user.sellerProfile?.rating || 0} ★</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sellers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sellers found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Delivery Content */}
                <TabsContent value="delivery">
                    <Card className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Vehicle Info</TableHead>
                                    <TableHead>License</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveryBoys.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-medium">{user.deliveryProfile?.vehicle_plate_number}</p>
                                                <p className="text-xs text-muted-foreground">{user.deliveryProfile?.vehicle_model}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.deliveryProfile?.license_number || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.deliveryProfile?.is_available ? "default" : "destructive"}>
                                                {user.deliveryProfile?.is_available ? 'Online' : 'Offline'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{user.deliveryProfile?.rating || 0} ★</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {deliveryBoys.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No delivery agents found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Providers Content */}
                <TabsContent value="providers">
                    <Card className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Services</TableHead>
                                    <TableHead>Exp (Yrs)</TableHead>
                                    <TableHead>Hours</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {providers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </TableCell>
                                        <TableCell>{user.serviceProviderProfile?.company_name || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {user.serviceProviderProfile?.service_types?.map((s: string, i: number) => (
                                                    <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.serviceProviderProfile?.experience_years || '-'}</TableCell>
                                        <TableCell>{user.serviceProviderProfile?.operating_hours || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {providers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No service providers found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Support Content */}
                <TabsContent value="support">
                    <Card className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Shift</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {supportAgents.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </TableCell>
                                        <TableCell>{user.supportProfile?.employee_id || '-'}</TableCell>
                                        <TableCell>{user.supportProfile?.department || '-'}</TableCell>
                                        <TableCell>
                                            {user.supportProfile?.shift_start ? `${user.supportProfile.shift_start} - ${user.supportProfile.shift_end}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {supportAgents.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No support agents found</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
