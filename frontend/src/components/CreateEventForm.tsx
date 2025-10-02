import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, CalendarIcon, Clock, MapPin, Users, Save, Send } from 'lucide-react';
// Mock date formatting function
const format = (date: Date, formatString: string) => {
  if (formatString === "PPP") {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return date.toLocaleDateString();
};

interface CreateEventFormProps {
  onNavigate: (page: string, id?: string) => void;
}

export function CreateEventForm({ onNavigate }: CreateEventFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    location: '',
    time: '',
    duration: '',
    maxAttendees: '',
    category: '',
    tags: '',
    thumbnail: '',
    requiresRegistration: true,
    isPublic: true,
    featured: false,
    registrationDeadline: '',
    contactEmail: user?.email || '',
    prerequisites: '',
    materials: ''
  });

  const eventCategories = [
    'Workshop',
    'Seminar',
    'Conference',
    'Career Fair',
    'Competition',
    'Social',
    'Academic',
    'Research'
  ];

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isDraft = false) => {
    if (!formData.title.trim() || !formData.description.trim() || !selectedDate) {
      toast.error('Please fill in the required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const eventData = {
        ...formData,
        id: Date.now().toString(),
        organizer: user?.name || 'Anonymous',
        organizerId: user?.id,
        date: selectedDate.toISOString(),
        createdAt: new Date().toISOString(),
        status: isDraft ? 'draft' : 'published',
        registrations: [],
        attendees: 0,
        rating: 0,
        reviews: []
      };

      toast.success(
        isDraft 
          ? 'Event saved as draft successfully!' 
          : 'Event published successfully!'
      );
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        longDescription: '',
        location: '',
        time: '',
        duration: '',
        maxAttendees: '',
        category: '',
        tags: '',
        thumbnail: '',
        requiresRegistration: true,
        isPublic: true,
        featured: false,
        registrationDeadline: '',
        contactEmail: user?.email || '',
        prerequisites: '',
        materials: ''
      });
      setSelectedDate(new Date());
      
      // Navigate to events page
      setTimeout(() => {
        onNavigate('events');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Cloudinary or S3
      // For demo, we'll use a placeholder URL
      const imageUrl = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop`;
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
      toast.success('Image uploaded successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Create and manage events for the ACE community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter a clear and engaging event title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the event (shown in previews)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isLoading}
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Detailed Description</Label>
              <Textarea
                id="longDescription"
                placeholder="Detailed information about the event, agenda, speakers, etc."
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                disabled={isLoading}
                className="min-h-32"
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
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
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
                  placeholder="ai, machine-learning, workshop"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Date, Time & Location */}
          <div className="space-y-4">
            <h4 className="font-medium">Date, Time & Location</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="2"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  disabled={isLoading}
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Engineering Auditorium, Room 101"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="50"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-4">
            <Label>Event Thumbnail</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {formData.thumbnail ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={formData.thumbnail}
                      alt="Event thumbnail"
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
                    Upload a thumbnail image for your event
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

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Additional Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="organizer@guilan.ac.ir"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                placeholder="Any required knowledge or skills for attendees"
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                disabled={isLoading}
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Materials Provided</Label>
              <Textarea
                id="materials"
                placeholder="What materials or resources will be provided to attendees"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                disabled={isLoading}
                className="min-h-20"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium">Event Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requires Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Attendees must register
                  </p>
                </div>
                <Switch
                  checked={formData.requiresRegistration}
                  onCheckedChange={(checked) => handleInputChange('requiresRegistration', checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Event</Label>
                  <p className="text-sm text-muted-foreground">
                    Visible to all users
                  </p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Event</Label>
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
              {isLoading ? 'Publishing...' : 'Publish Event'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onNavigate('events')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}