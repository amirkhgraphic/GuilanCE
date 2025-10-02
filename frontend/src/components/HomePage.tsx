import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AURL } from '../App'; // Import AURL from App.tsx

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

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

const upcomingEvents = [
  {
    id: '1',
    title: 'Annual Tech Symposium 2024',
    description: 'Join us for presentations on cutting-edge research and industry trends.',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Main Auditorium',
    type: 'Symposium',
    thumbnail: 'https://images.unsplash.com/photo-1670382417551-d2f1ee29aea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMHByZXNlbnRhdGlvbiUyMGF1ZGllbmNlfGVufDF8fHx8MTc1NzQzNzM4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    title: 'Workshop: Machine Learning Fundamentals',
    description: 'Hands-on workshop covering the basics of machine learning for beginners.',
    date: '2024-02-10',
    time: '02:00 PM',
    location: 'Computer Lab 1',
    type: 'Workshop',
    thumbnail: 'https://images.unsplash.com/photo-1689236673934-66f8e9d9279b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGxhYiUyMHdvcmtzaG9wJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU3NDM3Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    title: 'Guest Lecture: Industry Perspectives',
    description: 'Leading industry professionals share insights on current market trends.',
    date: '2024-02-05',
    time: '04:00 PM',
    location: 'Conference Room',
    type: 'Lecture',
    thumbnail: 'https://images.unsplash.com/photo-1646579886135-068c73800308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGVjdHVyZSUyMGhhbGwlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU3NDM3Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [email, setEmail] = useState('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchBlogs();
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
              Explore Blogs
            </Button>
            <Button onClick={() => onNavigate('events')} variant="outline" size="lg" className="px-8">
              <Calendar className="mr-2 h-5 w-5" />
              View Events
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
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && blogs.length === 0 && <p className="text-center text-muted-foreground">No posts available.</p>}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
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
                      onClick={() => onNavigate('blog', blog.id.toString())}
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
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
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 relative">
                <ImageWithFallback
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{event.type}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {event.date}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => onNavigate('event', event.id)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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