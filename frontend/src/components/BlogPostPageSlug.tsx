import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AURL } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // Adjust the endpoint based on your API; assuming /api/blog/posts?slug=:slug
        const response = await fetch(`${AURL}api/blog/posts?slug=${slug}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data: BlogPost = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>By {post.author.username}</span>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent>
          {post.featured_image && (
            <ImageWithFallback
              src={`${AURL}${post.featured_image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
          )}
          <p>{post.excerpt}</p>
          {/* Add full content here if available from API */}
        </CardContent>
      </Card>
    </div>
  );
}