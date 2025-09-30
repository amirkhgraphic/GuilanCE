import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { navigate } from './store/navigationSlice';
import { AuthProvider } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import { Header } from './components/Header';
import BlogsPage from './components/BlogsPage.tsx';
import EventsPage from './components/EventsPage.tsx';
import { AboutPage } from './components/AboutPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProfilePage } from './components/ProfilePage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Mail } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { useState } from 'react';
import { toast } from 'sonner';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import BlogPostPage from './components/BlogPostPage.tsx';

// Export AURL for use in other components
export const AURL = "http://127.0.0.1:8000/";

// Interface for blog post data based on API response
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  featured_image: string;
  status: string;
  published_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
  tags: { id: number; name: string; slug: string }[];
  is_featured: boolean;
  created_at: string;
  reading_time: number;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  featured_image: string;
  absolute_featured_image_url: string;
  event_type: string;
  address: string;
  location: string;
  online_link: string;
  start_time: string;
  end_time: string;
  registration_start_date: string;
  registration_end_date: string;
  capacity: number;
  price: number;
  status: string;
  registration_count: number;
  created_at: string;
}

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

function HomePage({ onNavigate }: HomePageProps) {
  const [email, setEmail] = useState('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${AURL}api/blog/posts?page=1&limit=10`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data: BlogPost[] = await response.json();
        setBlogs(data);
        setLoadingBlogs(false);
      } catch (error) {
        setErrorBlogs(error instanceof Error ? error.message : 'An error occurred');
        setLoadingBlogs(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${AURL}api/events/?limit=3&offset=0`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: Event[] = await response.json();
        setEvents(data);
        setLoadingEvents(false);
      } catch (error) {
        setErrorEvents(error instanceof Error ? error.message : 'An error occurred');
        setLoadingEvents(false);
      }
    };

    fetchBlogs();
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">
            Welcome to ACE
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Association of Computer Engineering at Guilan University - Fostering innovation,
            knowledge sharing, and professional growth in the field of computer engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('blogs')} size="lg" className="px-8">
              <BookOpen className="mr-2 h-5 w-5" />
              <Link to={"/blogs"}>
              Explore Blogs
              </Link>
            </Button>
            <Button onClick={() => onNavigate('events')} variant="outline" size="lg" className="px-8">
              <Calendar className="mr-2 h-5 w-5" />
              <Link to={"/events"}>
              View Events
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">250+</div>
            <p className="text-xs text-muted-foreground">
              Students and faculty members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">45</div>
            <p className="text-xs text-muted-foreground">
              Research papers and blog posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">28</div>
            <p className="text-xs text-muted-foreground">
              Workshops and seminars this year
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Recent Blogs Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl text-foreground">Recent Blog Posts</h2>
          <Button variant="outline" onClick={() => onNavigate('blogs')}>
            <Link to={"/blogs"}> View All</Link> <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {loadingBlogs && <p className="text-center text-muted-foreground">Loading...</p>}
        {errorBlogs && <p className="text-center text-red-500">{errorBlogs}</p>}
        {!loadingBlogs && !errorBlogs && blogs.length === 0 && <p className="text-center text-muted-foreground">No posts available.</p>}
        {!loadingBlogs && !errorBlogs && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <Link to={`/blog/${blog.slug}`}>
                  <div className="h-48 relative">
                    <ImageWithFallback
                      src={`${AURL}${blog.featured_image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{blog.category.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(blog.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        By {blog.author.username}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl text-foreground">Upcoming Events</h2>
          <Button variant="outline" onClick={() => onNavigate('events')}>
           <Link to={"/Events"}> View All </Link> <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {loadingEvents && <p className="text-center text-muted-foreground">Loading...</p>}
        {errorEvents && <p className="text-center text-red-500">{errorEvents}</p>}
        {!loadingEvents && !errorEvents && events.length === 0 && <p className="text-center text-muted-foreground">No events available.</p>}
        {!loadingEvents && !errorEvents && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <Link to={`/event/${event.slug}`}>
                  <div className="h-48 relative">
                    <ImageWithFallback
                      src={event.absolute_featured_image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{event.event_type}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(event.start_time).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">📍</span>
                        {event.location || event.address}
                      </div>
                      <Button
                        className="w-full mt-4"
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Subscription Section */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl text-foreground mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter and never miss updates on events, blog posts,
                research news, and opportunities in computer engineering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1"
                />
                <Button
                  onClick={() => {
                    if (email && email.includes('@')) {
                      toast.success('Thank you for subscribing to our newsletter!');
                      setEmail('');
                    } else {
                      toast.error('Please enter a valid email address.');
                    }
                  }}
                  className="px-6"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface AppProps {
  currentPage: string;
  selectedId?: string;
  navigate: (page: string, id?: string) => void;
}

function App({ currentPage, selectedId, navigate }: AppProps) {
  const location = useLocation();

  useEffect(() => {
    // Sync Redux state with react-router-dom location
    const path = location.pathname === '/' ? '' : location.pathname.split('/')[1];
    const id = location.pathname.split('/')[2];
    if (path !== currentPage || id !== selectedId) {
      navigate(path || '', id);
    }
  }, [location, currentPage, selectedId, navigate]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-background">
          {currentPage !== 'login' && currentPage !== 'register' && (
            <Header currentPage={currentPage} onNavigate={navigate} />
          )}
          <main className={currentPage !== 'login' && currentPage !== 'register' ? 'pb-8 pt-24' : ''}>
            <Routes>
              <Route path="/" element={<HomePage onNavigate={navigate} />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blogs" element={<BlogsPage onNavigate={navigate} selectedId={selectedId} />} />
              <Route path="/event/:slug" element={<EventsPage />} />
              <Route path="/events" element={<EventsPage />} />

              <Route path="/about" element={<AboutPage onNavigate={navigate} />} />
              <Route path="/login" element={<LoginPage onNavigate={navigate} />} />
              <Route path="/register" element={<RegisterPage onNavigate={navigate} />} />
              <Route path="/profile" element={<ProfilePage onNavigate={navigate} />} />
              <Route path="/dashboard" element={<UserDashboard onNavigate={navigate} />} />
              <Route path="/admin" element={<AdminDashboard onNavigate={navigate} />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
          {currentPage !== 'login' && currentPage !== 'register' && (
            <footer className="bg-muted py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">ACE</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">ACE Guilan</h3>
                        <p className="text-sm text-muted-foreground">
                          Computer Engineering Association
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Fostering innovation and excellence in computer engineering education and research.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <div className="space-y-2">
                      <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                      <Link to="/blogs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blogs</Link>
                      <Link to="/events" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
                      <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                      <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                      <Link to="/register" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Contact</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Engineering Faculty</p>
                      <p>Guilan University</p>
                      <p>Rasht, Guilan Province</p>
                      <p>ace@guilan.ac.ir</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    © 2025 Association of Computer Engineering, Guilan University. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

const mapStateToProps = (state: RootState) => ({
  currentPage: state.navigation.currentPage,
  selectedId: state.navigation.selectedId,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  navigate: (page: string, id?: string) => dispatch(navigate({ page, id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);