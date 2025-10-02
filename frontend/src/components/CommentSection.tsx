import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Reply, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  postType: 'blog' | 'event';
  initialComments?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Ali Rezaei',
    content: 'Great post! This really helped me understand the concepts better. Looking forward to more content like this.',
    date: '2024-01-16',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: 'Sara Mohammadi',
        content: 'I agree! The examples were particularly helpful.',
        date: '2024-01-16',
        likes: 3,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    author: 'Maryam Hashemi',
    content: 'Thanks for sharing this. Could you provide more resources on this topic?',
    date: '2024-01-15',
    likes: 8,
    isLiked: true,
    replies: []
  },
  {
    id: '3',
    author: 'Hassan Karimi',
    content: 'Excellent explanation! This will definitely help students in our upcoming project.',
    date: '2024-01-15',
    likes: 15,
    isLiked: false,
    replies: []
  }
];

export function CommentSection({ postId, postType, initialComments = mockComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        isLiked: false,
        replies: []
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
      toast.success('Comment posted successfully!');
    }, 1000);
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reply: Comment = {
        id: `${parentId}-${Date.now()}`,
        author: 'You',
        content: replyContent,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        isLiked: false
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ));
      
      setReplyContent('');
      setReplyingTo(null);
      setIsSubmitting(false);
      toast.success('Reply posted successfully!');
    }, 1000);
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      isLiked: !reply.isLiked
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked
            }
          : comment
      ));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <div className="space-y-3">
          <Textarea
            placeholder={`Share your thoughts about this ${postType}...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className="h-auto p-1 space-x-1"
                    >
                      <ThumbsUp 
                        className={`h-4 w-4 ${comment.isLiked ? 'fill-current text-primary' : ''}`} 
                      />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="h-auto p-1 space-x-1"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="space-y-2 pl-4 border-l-2 border-muted">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyContent.trim() || isSubmitting}
                        >
                          {isSubmitting ? 'Replying...' : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(reply.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{reply.author}</span>
                                <span className="text-xs text-muted-foreground">{reply.date}</span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                className="h-auto p-1 space-x-1"
                              >
                                <ThumbsUp 
                                  className={`h-3 w-3 ${reply.isLiked ? 'fill-current text-primary' : ''}`} 
                                />
                                <span>{reply.likes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}