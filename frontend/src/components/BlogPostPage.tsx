import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AURL } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  content_html: string;
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

interface Comment {
  id: number;
  content: string;
  created_at: string;
  is_approved: boolean;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
  };
  replies: Comment[];
}

interface NewComment {
  content: string;
  parent_id?: number;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, token } = useContext(AuthContext);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`${AURL}api/blog/posts/${slug}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data: BlogPost = await response.json();
        setPost(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${AURL}api/blog/posts/${slug}/comments`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        setCommentError(error instanceof Error ? error.message : 'An error occurred');
      }
    };

    Promise.all([fetchPost(), fetchComments()]).finally(() => setLoading(false));
  }, [slug]);

  const handleCommentSubmit = async () => {
    if (!user || !token) {
      toast.error('Please log in to post a comment.');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      const payload: NewComment = { content: newComment };
      if (replyTo) payload.parent_id = replyTo;

      const response = await fetch(`${AURL}api/blog/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to post comment');
      }

      const newCommentData: Comment = await response.json();
      setComments((prev) =>
        replyTo
          ? prev.map((comment) =>
              comment.id === replyTo
                ? { ...comment, replies: [...comment.replies, newCommentData] }
                : comment
            )
          : [...prev, newCommentData]
      );
      setNewComment('');
      setReplyTo(null);
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`mt-4 ${depth > 0 ? 'ml-6 border-l-2 border-muted pl-4' : ''}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{comment.author.username}</span>
        <span>•</span>
        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>
      <p className="text-foreground">{comment.content}</p>
      {user && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
          className="text-muted-foreground"
        >
          {replyTo === comment.id ? 'Cancel Reply' : 'Reply'}
        </Button>
      )}
      {comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (loading) return <p className="text-center text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-muted-foreground">Post not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-2">
              <span>By {post.author.username}</span>
              <span>•</span>
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.reading_time} min read</span>
            </div>
            <Badge variant="secondary">{post.category.name}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {post.featured_image && (
            <ImageWithFallback
              src={`${AURL}${post.featured_image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded mb-6"
            />
          )}
          <div className="text-muted-foreground mb-4">{post.excerpt}</div>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
          {post.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Comments</h3>
            {commentError && <p className="text-red-500 mb-4">{commentError}</p>}
            {comments.length === 0 && (
              <p className="text-muted-foreground">No comments yet.</p>
            )}
            {comments.map((comment) => renderComment(comment))}
            {user ? (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {replyTo ? 'Reply to Comment' : 'Add a Comment'}
                </h4>
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="mb-4"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCommentSubmit}>Post Comment</Button>
                  {replyTo && (
                    <Button variant="outline" onClick={() => setReplyTo(null)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">
                Please log in to post a comment.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}