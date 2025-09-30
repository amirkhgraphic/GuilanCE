import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Rating {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingSectionProps {
  eventId: string;
  initialRatings?: Rating[];
  canRate?: boolean;
}

const mockRatings: Rating[] = [
  {
    id: '1',
    author: 'Ali Rezaei',
    rating: 5,
    comment: 'Excellent event! Very well organized and informative. The speakers were knowledgeable and engaging.',
    date: '2024-01-29'
  },
  {
    id: '2',
    author: 'Sara Mohammadi',
    rating: 4,
    comment: 'Great content and networking opportunities. Could have been better with more hands-on sessions.',
    date: '2024-01-29'
  },
  {
    id: '3',
    author: 'Hassan Karimi',
    rating: 5,
    comment: 'Outstanding event! Learned a lot and made valuable connections. Looking forward to future events.',
    date: '2024-01-30'
  },
  {
    id: '4',
    author: 'Maryam Hashemi',
    rating: 4,
    comment: 'Very informative and well-structured. The venue was perfect and refreshments were good.',
    date: '2024-01-30'
  }
];

export function RatingSection({ eventId, initialRatings = mockRatings, canRate = true }: RatingSectionProps) {
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      distribution[rating.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!userComment.trim()) {
      toast.error('Please provide a comment');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newRating: Rating = {
        id: Date.now().toString(),
        author: 'You',
        rating: userRating,
        comment: userComment,
        date: new Date().toISOString().split('T')[0]
      };

      setRatings(prev => [newRating, ...prev]);
      setUserRating(0);
      setUserComment('');
      setHasUserRated(true);
      setIsSubmitting(false);
      toast.success('Rating submitted successfully!');
    }, 1000);
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive 
        ? starValue <= (hoveredRating || userRating)
        : starValue <= rating;
      
      return (
        <Star
          key={index}
          className={`${starSize} cursor-pointer transition-colors ${
            isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          onClick={interactive ? () => setUserRating(starValue) : undefined}
        />
      );
    });
  };

  const distribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Ratings</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(parseFloat(averageRating), false, 'sm')}
            </div>
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-sm text-muted-foreground">({ratings.length} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium">Rating Distribution</h4>
          {Array.from({ length: 5 }, (_, index) => {
            const stars = 5 - index;
            const count = distribution[stars as keyof typeof distribution];
            const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center space-x-3">
                <span className="text-sm w-8">{stars} ⭐</span>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-8">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Add Rating Form */}
        {canRate && !hasUserRated && (
          <div className="space-y-4 p-4 border border-border rounded-lg">
            <h4 className="font-medium">Rate this event</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Your rating:</span>
                <div className="flex items-center space-x-1">
                  {renderStars(userRating, true, 'lg')}
                </div>
                {userRating > 0 && (
                  <Badge variant="outline">
                    {userRating} star{userRating !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              
              <Textarea
                placeholder="Share your experience and feedback about this event..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitRating}
                  disabled={userRating === 0 || !userComment.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {hasUserRated && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              Thank you for your feedback! Your rating helps us improve future events.
            </p>
          </div>
        )}

        {/* Ratings List */}
        <div className="space-y-4">
          <h4 className="font-medium">Reviews ({ratings.length})</h4>
          
          {ratings.map((rating) => (
            <div key={rating.id} className="space-y-2 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{rating.author}</span>
                  <div className="flex items-center">
                    {renderStars(rating.rating, false, 'sm')}
                  </div>
                  <Badge variant="outline">{rating.rating}/5</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{rating.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{rating.comment}</p>
            </div>
          ))}
          
          {ratings.length === 0 && (
            <div className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No ratings yet. Be the first to rate this event!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}