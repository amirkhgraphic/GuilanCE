import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Calendar, User, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { AURL } from '../App';

interface BlogAuthor {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: BlogAuthor;
  featured_image: string;
  status: string;
  published_at: string;
  category: BlogCategory;
  tags: BlogTag[];
  is_featured: boolean;
  created_at: string;
  reading_time: number;
  isLiked?: boolean;
  likes?: number;
  absolute_featured_image_url?: string;
}

interface BlogsPageProps {
  navigate: ReturnType<typeof useNavigate>;
  params: ReturnType<typeof useParams>;
}

interface BlogsPageState {
  searchTerm: string;
  selectedCategory: string;
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  selectedBlog: Blog | null;
  page: number;
  limit: number;
}

class BlogsPageClass extends Component<BlogsPageProps, BlogsPageState> {
  state: BlogsPageState = {
    searchTerm: '',
    selectedCategory: 'all',
    blogs: [],
    loading: true,
    error: null,
    selectedBlog: null,
    page: 1,
    limit: 10,
  };

  componentDidMount() {
    this.fetchBlogs();
    const { slug } = this.props.params;
    if (slug) {
      this.fetchSingleBlog(slug);
    }
  }

  componentDidUpdate(prevProps: BlogsPageProps) {
    const { slug } = this.props.params;
    if (slug !== prevProps.params.slug) {
      if (slug) {
        this.fetchSingleBlog(slug);
      } else {
        this.setState({ selectedBlog: null });
      }
    }
  }

  fetchBlogs = async () => {
    const { searchTerm, selectedCategory, page, limit } = this.state;
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
      });
      const response = await fetch(`${AURL}api/blog/posts?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data: Blog[] = await response.json();
      // Ensure absolute image URLs
      const blogsWithAbsoluteUrls = data.map(blog => ({
        ...blog,
        absolute_featured_image_url: blog.featured_image.startsWith('http')
          ? blog.featured_image
          : `${AURL}${blog.featured_image}`,
        isLiked: false,
        likes: 0,
      }));
      this.setState({ blogs: blogsWithAbsoluteUrls, loading: false });
    } catch (error) {
      this.setState({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  };

  fetchSingleBlog = async (slug: string) => {
    try {
      const response = await fetch(`${AURL}api/blog/posts/slug/${slug}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blog post details');
      }
      const data: Blog = await response.json();
      this.setState({
        selectedBlog: {
          ...data,
          absolute_featured_image_url: data.featured_image.startsWith('http')
            ? data.featured_image
            : `${AURL}${data.featured_image}`,
          isLiked: false,
          likes: 0,
        },
      });
    } catch (error) {
      this.setState({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value, loading: true }, this.fetchBlogs);
  };

  handleCategoryChange = (value: string) => {
    this.setState({ selectedCategory: value, loading: true }, this.fetchBlogs);
  };

  getFilteredBlogs = () => {
    const { blogs, searchTerm, selectedCategory } = this.state;
    return blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${blog.author.first_name} ${blog.author.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || blog.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  render() {
    const { navigate } = this.props;
    const { searchTerm, selectedCategory, blogs, loading, error, selectedBlog } = this.state;
    const filteredBlogs = this.getFilteredBlogs();
    const categories = [...new Set(['all', ...blogs.map(blog => blog.category.name)])];

    if (selectedBlog) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => {
              this.setState({ selectedBlog: null });
              navigate('/blogs');
            }}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>

          <article className="space-y-8">
            <div className="mb-8">
              <Badge className="mb-4">{selectedBlog.category.name}</Badge>
              <h1 className="text-4xl mb-4">{selectedBlog.title}</h1>
              <div className="w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedBlog.absolute_featured_image_url || selectedBlog.featured_image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {`${selectedBlog.author.first_name} ${selectedBlog.author.last_name}`}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(selectedBlog.published_at).toLocaleDateString()}
                </div>
                <span>{`${selectedBlog.reading_time} min read`}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedBlog.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-border">
                <LikeButton
                  postId={selectedBlog.id.toString()}
                  initialLikes={selectedBlog.likes || 0}
                  initialIsLiked={selectedBlog.isLiked || false}
                  showCount={true}
                />
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-6">{selectedBlog.excerpt}</p>
              <div className="space-y-4">
                <p>
                  This is a detailed blog post about {selectedBlog.title.toLowerCase()}.
                  The content would include comprehensive information, examples, and insights
                  related to the topic.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <CommentSection postId={selectedBlog.id.toString()} postType="blog" />
            </div>
          </article>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-4">Blog Posts</h1>
          <p className="text-xl text-muted-foreground">
            Insights, tutorials, and updates from our computer engineering community
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={this.handleSearchChange}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={this.handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No blogs found matching your search criteria.</p>
          </div>
        )}
        {!loading && !error && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={blog.absolute_featured_image_url || blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{blog.category.name}</Badge>
                    <span className="text-sm text-muted-foreground">{`${blog.reading_time} min read`}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{blog.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {`${blog.author.first_name} ${blog.author.last_name}`}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(blog.published_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {blog.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <LikeButton
                        postId={blog.id.toString()}
                        initialLikes={blog.likes || 0}
                        initialIsLiked={blog.isLiked || false}
                        showCount={true}
                      />
                      <Button
                        size="sm"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
}

// Wrapper component to provide navigate and params to the class component
function BlogsPage(props: Omit<BlogsPageProps, 'navigate' | 'params'>) {
  const navigate = useNavigate();
  const params = useParams();
  return <BlogsPageClass {...props} navigate={navigate} params={params} />;
}

export default BlogsPage;