import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useAuth } from './AuthContext';
import { Shield, ShieldX, Search, UserCheck, UserMinus, Users, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdminManagement() {
  const { user, getAllUsers, promoteToAdmin, demoteFromAdmin, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'users' | 'admins'>('users');

  if (!user || user.role !== 'superuser') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3>Access Denied</h3>
        <p className="text-muted-foreground">
          Only superusers can access admin management features.
        </p>
      </div>
    );
  }

  const allUsers = getAllUsers();
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === 'admin');
  const regularUsers = filteredUsers.filter(u => u.role !== 'admin' && u.role !== 'superuser');

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    const success = await promoteToAdmin(userId);
    if (success) {
      toast.success(`${userName} has been promoted to admin.`);
    } else {
      toast.error('Failed to promote user to admin.');
    }
  };

  const handleDemoteFromAdmin = async (userId: string, userName: string) => {
    const success = await demoteFromAdmin(userId);
    if (success) {
      toast.success(`${userName} has been demoted from admin.`);
    } else {
      toast.error('Failed to demote user from admin.');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superuser': return 'destructive';
      case 'admin': return 'default';
      case 'faculty': return 'secondary';
      case 'student': return 'outline';
      default: return 'outline';
    }
  };

  const UserRow = ({ user: userItem, showActions = false }: { user: any, showActions?: boolean }) => (
    <TableRow key={userItem.id}>
      <TableCell>
        <div>
          <p className="font-medium">{userItem.name}</p>
          <p className="text-sm text-muted-foreground">{userItem.email}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(userItem.role)} className="capitalize">
          {userItem.role}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            {userItem.emailVerified ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            {userItem.phoneVerified ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm">{userItem.phone || 'Not provided'}</p>
      </TableCell>
      <TableCell>
        <p className="text-sm line-clamp-2">{userItem.bio || 'No bio available'}</p>
      </TableCell>
      {showActions && (
        <TableCell>
          <div className="flex space-x-2">
            {userItem.role === 'admin' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoteFromAdmin(userItem.id, userItem.name)}
                disabled={isLoading}
              >
                <UserMinus className="w-3 h-3 mr-1" />
                Demote
              </Button>
            ) : userItem.role !== 'superuser' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handlePromoteToAdmin(userItem.id, userItem.name)}
                disabled={isLoading}
              >
                <UserCheck className="w-3 h-3 mr-1" />
                Promote
              </Button>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Admin Management</h2>
          <p className="text-muted-foreground">
            Manage administrator privileges and view all users.
          </p>
        </div>
        <Badge variant="destructive">Superuser</Badge>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <Label htmlFor="search">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedTab === 'users' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            All Users ({allUsers.length})
          </Button>
          <Button
            variant={selectedTab === 'admins' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('admins')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Admins ({admins.length})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{allUsers.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Shield className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{admins.length}</p>
              <p className="text-sm text-muted-foreground">Administrators</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <UserCheck className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{allUsers.filter(u => u.role === 'faculty').length}</p>
              <p className="text-sm text-muted-foreground">Faculty</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{allUsers.filter(u => u.role === 'student').length}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {selectedTab === 'users' ? (
              <>
                <Users className="w-5 h-5" />
                <span>All Users</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Current Administrators</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            {selectedTab === 'users' 
              ? 'Manage user roles and view detailed information for all registered users.'
              : 'Current administrators and their details. You can demote admins from this view.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Bio</TableHead>
                  {selectedTab === 'users' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTab === 'users' ? (
                  filteredUsers.length > 0 ? (
                    filteredUsers.map((userItem) => (
                      <UserRow key={userItem.id} user={userItem} showActions={true} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No users found matching your search.</p>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  admins.length > 0 ? (
                    admins.map((userItem) => (
                      <UserRow key={userItem.id} user={userItem} showActions={false} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <ShieldX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No administrators found.</p>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions Card */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>
              Promote faculty members to administrators or demote existing admins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Eligible for Promotion</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Faculty members who can be promoted to admin.
                </p>
                <div className="space-y-2">
                  {regularUsers.filter(u => u.role === 'faculty').slice(0, 3).map((facultyUser) => (
                    <div key={facultyUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{facultyUser.name}</p>
                        <p className="text-sm text-muted-foreground">{facultyUser.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handlePromoteToAdmin(facultyUser.id, facultyUser.name)}
                        disabled={isLoading}
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Promote
                      </Button>
                    </div>
                  ))}
                  {regularUsers.filter(u => u.role === 'faculty').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No faculty members available for promotion.
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Current Admins</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Current administrators who can be demoted.
                </p>
                <div className="space-y-2">
                  {admins.slice(0, 3).map((adminUser) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{adminUser.name}</p>
                        <p className="text-sm text-muted-foreground">{adminUser.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemoteFromAdmin(adminUser.id, adminUser.name)}
                        disabled={isLoading}
                      >
                        <UserMinus className="w-3 h-3 mr-1" />
                        Demote
                      </Button>
                    </div>
                  ))}
                  {admins.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No administrators to manage.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}