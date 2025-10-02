import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Mail, Users, Calendar, Clock, Send, Save, Eye, Plus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from './AuthContext';

interface CreateNewsletterFormProps {
  onNavigate: (page: string, id?: string) => void;
}

// Mock data for newsletters
const mockNewsletters = [
  {
    id: '1',
    subject: 'Welcome to ACE Newsletter - January 2024',
    content: 'Dear ACE members, we are excited to share the latest updates...',
    recipientGroups: ['students', 'faculty'],
    status: 'sent',
    sentDate: '2024-01-15',
    recipients: 234,
    openRate: '68%'
  },
  {
    id: '2',
    subject: 'Upcoming Events & Workshop Announcements',
    content: 'Join us for our upcoming tech symposium and machine learning workshop...',
    recipientGroups: ['all'],
    status: 'draft',
    sentDate: null,
    recipients: 0,
    openRate: null
  },
  {
    id: '3',
    subject: 'Research Opportunities & Internship Updates',
    content: 'Explore new research opportunities and internship programs...',
    recipientGroups: ['students'],
    status: 'scheduled',
    sentDate: '2024-01-25',
    recipients: 156,
    openRate: null
  }
];

export function CreateNewsletterForm({ onNavigate }: CreateNewsletterFormProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipientGroups: [] as string[],
    scheduleDate: '',
    scheduleTime: ''
  });

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const recipientOptions = [
    { value: 'all', label: 'All Subscribers', count: 342 },
    { value: 'students', label: 'Students', count: 198 },
    { value: 'faculty', label: 'Faculty', count: 87 },
    { value: 'alumni', label: 'Alumni', count: 57 }
  ];

  const handleGroupToggle = (group: string) => {
    setSelectedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const getTotalRecipients = () => {
    if (selectedGroups.includes('all')) return 342;
    return selectedGroups.reduce((total, group) => {
      const option = recipientOptions.find(opt => opt.value === group);
      return total + (option?.count || 0);
    }, 0);
  };

  const handleSaveDraft = () => {
    if (!formData.subject || !formData.content) {
      toast.error('Please fill in subject and content.');
      return;
    }
    toast.success('Newsletter saved as draft.');
    // Reset form
    setFormData({
      subject: '',
      content: '',
      recipientGroups: [],
      scheduleDate: '',
      scheduleTime: ''
    });
    setSelectedGroups([]);
  };

  const handleSendNow = () => {
    if (!formData.subject || !formData.content || selectedGroups.length === 0) {
      toast.error('Please fill in all required fields and select recipient groups.');
      return;
    }
    toast.success(`Newsletter sent successfully to ${getTotalRecipients()} recipients!`);
    // Reset form
    setFormData({
      subject: '',
      content: '',
      recipientGroups: [],
      scheduleDate: '',
      scheduleTime: ''
    });
    setSelectedGroups([]);
  };

  const handleSchedule = () => {
    if (!formData.subject || !formData.content || selectedGroups.length === 0 || !formData.scheduleDate || !formData.scheduleTime) {
      toast.error('Please fill in all fields including schedule date and time.');
      return;
    }
    toast.success(`Newsletter scheduled for ${formData.scheduleDate} at ${formData.scheduleTime}.`);
    // Reset form
    setFormData({
      subject: '',
      content: '',
      recipientGroups: [],
      scheduleDate: '',
      scheduleTime: ''
    });
    setSelectedGroups([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'draft': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'outline';
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
    return (
      <div className="text-center py-12">
        <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3>Access Denied</h3>
        <p className="text-muted-foreground">
          Only administrators can create newsletters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Newsletter Management</h2>
          <p className="text-muted-foreground">
            Create and manage newsletters for ACE subscribers.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Newsletter History
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Content</CardTitle>
                <CardDescription>Create your newsletter content and configure settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject Line *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter newsletter subject..."
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your newsletter content here..."
                    rows={12}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Newsletter</CardTitle>
                <CardDescription>Optionally schedule your newsletter for later.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduleDate">Schedule Date</Label>
                    <Input
                      id="scheduleDate"
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduleTime">Schedule Time</Label>
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipients */}
            <Card>
              <CardHeader>
                <CardTitle>Recipients *</CardTitle>
                <CardDescription>Select who will receive this newsletter.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recipientOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleGroupToggle(option.value)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedGroups.includes(option.value) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.count} subscribers</p>
                      </div>
                      {selectedGroups.includes(option.value) && (
                        <Users className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
                
                {selectedGroups.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium">
                      Total Recipients: {getTotalRecipients()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Send, save, or schedule your newsletter.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSendNow} 
                  className="w-full"
                  disabled={!formData.subject || !formData.content || selectedGroups.length === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
                <Button 
                  onClick={handleSchedule} 
                  variant="outline" 
                  className="w-full"
                  disabled={!formData.subject || !formData.content || selectedGroups.length === 0 || !formData.scheduleDate || !formData.scheduleTime}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
                <Button 
                  onClick={handleSaveDraft} 
                  variant="secondary" 
                  className="w-full"
                  disabled={!formData.subject || !formData.content}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Newsletter History */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter History</CardTitle>
              <CardDescription>View and manage past newsletters.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNewsletters.map((newsletter) => (
                  <div key={newsletter.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{newsletter.subject}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {newsletter.content}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(newsletter.status)} className="capitalize ml-4">
                        {newsletter.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {newsletter.recipients} recipients
                        </div>
                        {newsletter.sentDate && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {newsletter.sentDate}
                          </div>
                        )}
                        {newsletter.openRate && (
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {newsletter.openRate} open rate
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {newsletter.recipientGroups.join(', ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}