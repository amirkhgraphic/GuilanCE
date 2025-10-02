import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, Eye, Save, Send } from 'lucide-react';

interface CreatePostFormProps {
  onNavigate: (page: string, id?: string) => void;
}

export function CreatePostForm({ onNavigate }: CreatePostFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    thumbnail: '',
    publishNow: true,
    allowComments: true,
    featured: false
  });

  const categories = [
    'Technology',
    'Research', 
    'Development',
    'Academic',
    'Industry',
    'Career',
    'News'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in the required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const postData = {
        ...formData,
        id: Date.now().toString(),
        author: user?.name || 'Anonymous',
        authorId: user?.id,
        date: new Date().toISOString(),
        status: isDraft ? 'draft' : 'published',
        views: 0,
        likes: 0,
        comments: []
      };

      toast.success(
        isDraft 
          ? 'Post saved as draft successfully!' 
          : 'Post published successfully!'
      );
      
      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        thumbnail: '',
        publishNow: true,
        allowComments: true,
        featured: false
      });
      
      // Navigate to blogs page
      setTimeout(() => {
        onNavigate('blogs');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Cloudinary or S3
      // For demo, we'll use a placeholder URL
      const imageUrl = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop`;
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
      toast.success('Image uploaded successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Write and publish a new blog post for the ACE community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                placeholder="Enter an engaging title for your post"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of your post (shown in previews)"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                disabled={isLoading}
                className="min-h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <Label>Thumbnail Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {formData.thumbnail ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={formData.thumbnail}
                      alt="Post thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={() => handleInputChange('thumbnail', '')}
                      disabled={isLoading}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Upload a thumbnail image for your post
                  </p>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isLoading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" disabled={isLoading}>
                      Choose Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here. You can use markdown formatting."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={isLoading}
              className="min-h-80"
            />
            <p className="text-sm text-muted-foreground">
              Markdown formatting is supported (e.g., **bold**, *italic*, # headers)
            </p>
          </div>

          {/* Settings */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Post Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publish Now</Label>
                  <p className="text-sm text-muted-foreground">
                    Make post visible immediately
                  </p>
                </div>
                <Switch
                  checked={formData.publishNow}
                  onCheckedChange={(checked) => handleInputChange('publishNow', checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable commenting on this post
                  </p>
                </div>
                <Switch
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => handleInputChange('allowComments', checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Post</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight on homepage
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </Button>
            
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onNavigate('blogs')}
              disabled={isLoading}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}