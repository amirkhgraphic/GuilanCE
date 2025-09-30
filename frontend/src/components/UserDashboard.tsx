import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from './AuthContext';
import { Heart, Calendar, User, ExternalLink, MapPin, Clock } from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (page: string, id?: string) => void;
}

// Mock data for liked posts and registered events
const mockLikedPosts = [
  {
    id: '1',
    title: 'Introduction to Machine Learning in Computer Engineering',
    excerpt: 'Exploring the fundamentals of ML and its applications in modern computing systems.',
    author: 'Dr. Ahmad Mohammadi',
    date: '2024-01-15',
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Building Scalable Web Applications with React',
    excerpt: 'Best practices for developing modern web applications using React and TypeScript.',
    author: 'Ali Rezaei',
    date: '2024-01-10',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'The Future of Quantum Computing',
    excerpt: 'Understanding quantum computing principles and their potential impact on technology.',
    author: 'Dr. Sarah Williams',
    date: '2024-01-08',
    category: 'Research',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop'
  }
];

const mockRegisteredEvents = [
  {
    id: '1',
    title: 'AI Research Symposium 2024',
    description: 'Annual symposium featuring cutting-edge AI research presentations.',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Engineering Auditorium',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Code Review Best Practices Workshop',
    description: 'Interactive workshop on effective code review techniques and tools.',
    date: '2024-01-20',
    time: '02:00 PM',
    location: 'Computer Lab 3',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Industry Career Fair',
    description: 'Meet representatives from leading tech companies and explore career opportunities.',
    date: '2024-03-10',
    time: '10:00 AM',
    location: 'University Main Hall',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop'
  }
];

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1>Please log in to access your dashboard</h1>
          <Button onClick={() => onNavigate('login')} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your liked posts and event registrations.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="w-8 h-8 text-red-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{mockLikedPosts.length}</p>
                <p className="text-sm text-muted-foreground">Liked Posts</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">{mockRegisteredEvents.length}</p>
                <p className="text-sm text-muted-foreground">Registered Events</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <User className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <p className="text-2xl font-bold">
                  {mockRegisteredEvents.filter(e => e.status === 'upcoming').length}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Liked Posts</TabsTrigger>
            <TabsTrigger value="events">Registered Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>Your Liked Posts</h2>
              <Button variant="outline" onClick={() => onNavigate('blogs')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse All Posts
              </Button>
            </div>
            
            {mockLikedPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3>No liked posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring and like posts that interest you!
                  </p>
                  <Button onClick={() => onNavigate('blogs')}>
                    Browse Posts
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockLikedPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.date)}
                        </p>
                      </div>
                      <CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">By {post.author}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigate('blog', post.id)}
                        >
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>Your Registered Events</h2>
              <Button variant="outline" onClick={() => onNavigate('events')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Browse All Events
              </Button>
            </div>
            
            {mockRegisteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3>No registered events</h3>
                  <p className="text-muted-foreground mb-4">
                    Discover and register for upcoming events!
                  </p>
                  <Button onClick={() => onNavigate('events')}>
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockRegisteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-64 aspect-video lg:aspect-square bg-muted">
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={getStatusColor(event.status)} className="capitalize">
                              {event.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(event.date)}
                            </p>
                          </div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 mr-2" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                {event.location}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => onNavigate('event', event.id)}
                              >
                                View Details
                              </Button>
                              {event.status === 'upcoming' && (
                                <Button variant="destructive" size="sm">
                                  Cancel Registration
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}