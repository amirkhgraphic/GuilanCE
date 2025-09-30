import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useAuth } from './AuthContext';
import { CreatePostForm } from './CreatePostForm';
import { CreateEventForm } from './CreateEventForm';
import { EventRegistrations } from './EventRegistrations';
import { AdminManagement } from './AdminManagement';
import { CreateNewsletterForm } from './CreateNewsletterForm';
import { Plus, FileText, Calendar, Users, BarChart3, TrendingUp, Shield, Mail } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

// Mock data for admin stats
const mockStats = {
  totalPosts: 24,
  totalEvents: 12,
  totalRegistrations: 156,
  activeEvents: 4,
  pendingPosts: 3,
  thisMonthViews: 2847
};

const mockRecentPosts = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    author: 'Dr. Ahmad Mohammadi',
    status: 'published',
    date: '2024-01-15',
    views: 245
  },
  {
    id: '2',
    title: 'Building Scalable Web Applications',
    author: 'Ali Rezaei',
    status: 'draft',
    date: '2024-01-14',
    views: 0
  },
  {
    id: '3',
    title: 'The Future of Quantum Computing',
    author: 'Dr. Sarah Williams',
    status: 'published',
    date: '2024-01-12',
    views: 189
  }
];

const mockRecentEvents = [
  {
    id: '1',
    title: 'AI Research Symposium 2024',
    date: '2024-02-15',
    status: 'upcoming',
    registrations: 87
  },
  {
    id: '2',
    title: 'Code Review Workshop',
    date: '2024-01-20',
    status: 'completed',
    registrations: 32
  },
  {
    id: '3',
    title: 'Industry Career Fair',
    date: '2024-03-10',
    status: 'upcoming',
    registrations: 124
  }
];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1>Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => onNavigate('home')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isSuperuser = user.role === 'superuser';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'upcoming': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content, events, and monitor site activity.
            </p>
          </div>
          <Badge variant="destructive">{isSuperuser ? 'Superuser' : 'Admin'}</Badge>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${isSuperuser ? 'grid-cols-7' : 'grid-cols-6'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="create-post">Create Post</TabsTrigger>
            <TabsTrigger value="create-event">Create Event</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {isSuperuser && <TabsTrigger value="admin-management">Admin Management</TabsTrigger>}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex items-center p-6">
                  <FileText className="w-8 h-8 text-blue-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.totalPosts}</p>
                    <p className="text-sm text-muted-foreground">Total Posts</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <Calendar className="w-8 h-8 text-green-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.totalEvents}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <Users className="w-8 h-8 text-purple-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.totalRegistrations}</p>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <TrendingUp className="w-8 h-8 text-orange-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.activeEvents}</p>
                    <p className="text-sm text-muted-foreground">Active Events</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <BarChart3 className="w-8 h-8 text-red-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.pendingPosts}</p>
                    <p className="text-sm text-muted-foreground">Pending Posts</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center p-6">
                  <TrendingUp className="w-8 h-8 text-cyan-500 mr-4" />
                  <div>
                    <p className="text-2xl font-bold">{mockStats.thisMonthViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">This Month Views</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Latest blog posts and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-sm text-muted-foreground">
                            By {post.author} • {formatDate(post.date)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusColor(post.status)} className="capitalize">
                            {post.status}
                          </Badge>
                          {post.status === 'published' && (
                            <span className="text-sm text-muted-foreground">
                              {post.views} views
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('blogs')}>
                    View All Posts
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Latest events and registration counts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(event.date)} • {event.registrations} registered
                          </p>
                        </div>
                        <Badge variant={getStatusColor(event.status)} className="capitalize">
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => onNavigate('events')}>
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isSuperuser ? '6' : '5'} gap-4`}>
                  <Button onClick={() => setActiveTab('create-post')} className="justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                  <Button onClick={() => setActiveTab('create-event')} className="justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Event
                  </Button>
                  <Button onClick={() => setActiveTab('newsletter')} className="justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Create Newsletter
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('registrations')} className="justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View Registrations
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('analytics')} className="justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  {isSuperuser && (
                    <Button variant="outline" onClick={() => setActiveTab('admin-management')} className="justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Manage Admins
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Create Post Tab */}
          <TabsContent value="create-post">
            <CreatePostForm onNavigate={onNavigate} />
          </TabsContent>
          
          {/* Create Event Tab */}
          <TabsContent value="create-event">
            <CreateEventForm onNavigate={onNavigate} />
          </TabsContent>
          
          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <CreateNewsletterForm onNavigate={onNavigate} />
          </TabsContent>
          
          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <EventRegistrations />
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Site Analytics</CardTitle>
                <CardDescription>Detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3>Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed analytics and insights will be available here.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Integration with analytics services coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Admin Management Tab */}
          {isSuperuser && (
            <TabsContent value="admin-management">
              <AdminManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}