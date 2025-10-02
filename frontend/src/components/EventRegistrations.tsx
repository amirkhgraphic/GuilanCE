import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { Search, Download, Mail, Calendar, Users, Filter, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Mock data for events and registrations
const mockEvents = [
  {
    id: '1',
    title: 'AI Research Symposium 2024',
    date: '2024-02-15',
    status: 'upcoming',
    maxAttendees: 100,
    registrations: [
      {
        id: '1',
        userId: '3',
        userName: 'Ali Rezaei',
        userEmail: 'ali.rezaei@student.guilan.ac.ir',
        userRole: 'student',
        registrationDate: '2024-01-10',
        status: 'confirmed',
        notes: 'Interested in ML research'
      },
      {
        id: '2',
        userId: '4',
        userName: 'Sara Ahmadi',
        userEmail: 'sara.ahmadi@student.guilan.ac.ir',
        userRole: 'student',
        registrationDate: '2024-01-12',
        status: 'confirmed',
        notes: ''
      },
      {
        id: '3',
        userId: '5',
        userName: 'Dr. Mehdi Karimi',
        userEmail: 'mehdi.karimi@guilan.ac.ir',
        userRole: 'faculty',
        registrationDate: '2024-01-08',
        status: 'confirmed',
        notes: 'Will present research paper'
      }
    ]
  },
  {
    id: '2',
    title: 'Code Review Best Practices Workshop',
    date: '2024-01-20',
    status: 'completed',
    maxAttendees: 30,
    registrations: [
      {
        id: '4',
        userId: '3',
        userName: 'Ali Rezaei',
        userEmail: 'ali.rezaei@student.guilan.ac.ir',
        userRole: 'student',
        registrationDate: '2024-01-05',
        status: 'attended',
        notes: ''
      },
      {
        id: '5',
        userId: '6',
        userName: 'Reza Hosseini',
        userEmail: 'reza.hosseini@student.guilan.ac.ir',
        userRole: 'student',
        registrationDate: '2024-01-06',
        status: 'no-show',
        notes: ''
      }
    ]
  },
  {
    id: '3',
    title: 'Industry Career Fair',
    date: '2024-03-10',
    status: 'upcoming',
    maxAttendees: 200,
    registrations: [
      {
        id: '6',
        userId: '3',
        userName: 'Ali Rezaei',
        userEmail: 'ali.rezaei@student.guilan.ac.ir',
        userRole: 'student',
        registrationDate: '2024-01-15',
        status: 'confirmed',
        notes: 'Looking for internship opportunities'
      }
    ]
  }
];

export function EventRegistrations() {
  const [selectedEventId, setSelectedEventId] = useState<string>(mockEvents[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const selectedEvent = mockEvents.find(event => event.id === selectedEventId);
  
  const filteredRegistrations = selectedEvent?.registrations.filter(registration => {
    const matchesSearch = 
      registration.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
    const matchesRole = roleFilter === 'all' || registration.userRole === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  }) || [];

  const handleExportRegistrations = () => {
    if (!selectedEvent) return;
    
    // In a real app, this would generate and download a CSV/Excel file
    const csvContent = [
      ['Name', 'Email', 'Role', 'Registration Date', 'Status', 'Notes'],
      ...filteredRegistrations.map(reg => [
        reg.userName,
        reg.userEmail,
        reg.userRole,
        new Date(reg.registrationDate).toLocaleDateString(),
        reg.status,
        reg.notes
      ])
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${selectedEvent.title.replace(/\s+/g, '_')}_registrations.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Registration data exported successfully!');
  };

  const handleSendEmail = (type: 'all' | 'individual', registrationId?: string) => {
    // In a real app, this would open an email composer or send emails via API
    if (type === 'all') {
      toast.success(`Email sent to all ${filteredRegistrations.length} registrants`);
    } else {
      const registration = filteredRegistrations.find(r => r.id === registrationId);
      toast.success(`Email sent to ${registration?.userName}`);
    }
  };

  const updateRegistrationStatus = (registrationId: string, newStatus: string) => {
    // In a real app, this would update the status via API
    toast.success('Registration status updated successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'attended': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'faculty': return 'default';
      case 'student': return 'secondary';
      default: return 'outline';
    }
  };

  if (!selectedEvent) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3>No Events Found</h3>
          <p className="text-muted-foreground">
            No events available to manage registrations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2>Event Registrations</h2>
          <p className="text-muted-foreground">
            Manage and track event registrations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportRegistrations}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => handleSendEmail('all')}>
            <Mail className="w-4 h-4 mr-2" />
            Email All
          </Button>
        </div>
      </div>

      {/* Event Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>Choose an event to view its registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{event.title}</span>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.registrations.length}/{event.maxAttendees}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{selectedEvent.registrations.length}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">
                {selectedEvent.registrations.filter(r => r.status === 'confirmed').length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="w-8 h-8 text-orange-500 mr-4" />
            <div>
              <p className="text-2xl font-bold">{selectedEvent.maxAttendees}</p>
              <p className="text-sm text-muted-foreground">Max Capacity</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round((selectedEvent.registrations.length / selectedEvent.maxAttendees) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Capacity Used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search registrants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setRoleFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registrations ({filteredRegistrations.length})
          </CardTitle>
          <CardDescription>
            Manage individual registrations for {selectedEvent.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3>No registrations found</h3>
              <p className="text-muted-foreground">
                No registrations match your current filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {registration.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{registration.userName}</p>
                          <p className="text-sm text-muted-foreground">{registration.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(registration.userRole)} className="capitalize">
                        {registration.userRole}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(registration.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(registration.status)} className="capitalize">
                        {registration.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="text-sm truncate" title={registration.notes}>
                        {registration.notes || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleSendEmail('individual', registration.id)}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          {registration.status === 'confirmed' && selectedEvent.status === 'completed' && (
                            <DropdownMenuItem 
                              onClick={() => updateRegistrationStatus(registration.id, 'attended')}
                            >
                              Mark as Attended
                            </DropdownMenuItem>
                          )}
                          {registration.status === 'confirmed' && selectedEvent.status === 'completed' && (
                            <DropdownMenuItem 
                              onClick={() => updateRegistrationStatus(registration.id, 'no-show')}
                            >
                              Mark as No-Show
                            </DropdownMenuItem>
                          )}
                          {registration.status !== 'cancelled' && (
                            <DropdownMenuItem 
                              onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                              className="text-destructive"
                            >
                              Cancel Registration
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}