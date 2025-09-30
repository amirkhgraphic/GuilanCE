import { useState } from 'react';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  showCount?: boolean;
}

export function LikeButton({ postId, initialLikes = 0, initialIsLiked = false, showCount = true }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : likes - 1;
      
      setIsLiked(newIsLiked);
      setLikes(newLikes);
      setIsLoading(false);
      
      if (newIsLiked) {
        toast.success('Added to favorites!');
      }
    }, 300);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={`transition-colors ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
    >
      <Heart 
        className={`h-4 w-4 mr-1 transition-all ${
          isLiked ? 'fill-current' : ''
        } ${isLoading ? 'animate-pulse' : ''}`} 
      />
      {showCount && <span>{likes}</span>}
      {!showCount && <span>{isLiked ? 'Liked' : 'Like'}</span>}
    </Button>
  );
}