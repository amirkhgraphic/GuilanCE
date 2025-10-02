import React, { Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EventRegistrationForm } from './EventRegistrationForm';
import { CommentSection } from './CommentSection';
import { RatingSection } from './RatingSection';
import { AURL } from '../App';

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  description_html: string;
  featured_image: string;
  absolute_featured_image_url: string;
  event_type: string;
  address: string;
  location: string;
  online_link: string;
  start_time: string;
  end_time: string;
  registration_start_date: string;
  registration_end_date: string;
  capacity: number;
  price: number;
  status: string;
  registration_count: number;
  created_at: string;
  updated_at: string;
  gallery_images: {
    id: number;
    title: string;
    description: string;
    image: string;
    absolute_image_url: string;
    markdown_url: string;
    alt_text: string;
    width: number;
    height: number;
    file_size_mb: number;
    is_public: boolean;
    created_at: string;
    uploaded_by: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      profile_picture: string | null;
    };
  }[];
}

interface EventsPageProps {
  navigate: ReturnType<typeof useNavigate>;
  params: ReturnType<typeof useParams>;
  onNavigate?: (page: string, id?: string) => void;
}

interface EventsPageState {
  searchTerm: string;
  selectedType: string;
  selectedStatus: string;
  events: Event[];
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
  isRegistrationOpen: boolean;
}

class EventsPageClass extends Component<EventsPageProps, EventsPageState> {
  state: EventsPageState = {
    searchTerm: '',
    selectedType: 'all',
    selectedStatus: 'all',
    events: [],
    loading: true,
    error: null,
    selectedEvent: null,
    isRegistrationOpen: false,
  };

  componentDidMount() {
    this.fetchEvents();
    const { slug } = this.props.params;
    if (slug) {
      this.fetchSingleEvent(slug);
    }
  }

  componentDidUpdate(prevProps: EventsPageProps) {
    const { slug } = this.props.params;
    if (slug !== prevProps.params.slug) {
      if (slug) {
        this.fetchSingleEvent(slug);
      } else {
        this.setState({ selectedEvent: null });
      }
    }
  }

  fetchEvents = async () => {
    try {
      const response = await fetch(`${AURL}api/events/?limit=20&offset=0`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data: Event[] = await response.json();
      this.setState({ events: data, loading: false });
    } catch (error) {
      this.setState({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  };

  fetchSingleEvent = async (slug: string) => {
    try {
      const response = await fetch(`${AURL}api/events/slug/${slug}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data: Event = await response.json();
      this.setState({ selectedEvent: data });
    } catch (error) {
      this.setState({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  handleTypeChange = (value: string) => {
    this.setState({ selectedType: value });
  };

  handleStatusChange = (value: string) => {
    this.setState({ selectedStatus: value });
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  getFilteredEvents = () => {
    const { events, searchTerm, selectedType, selectedStatus } = this.state;
    return events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || event.event_type === selectedType;
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  render() {
    const { navigate } = this.props;
    const { searchTerm, selectedType, selectedStatus, loading, error, selectedEvent, isRegistrationOpen } = this.state;
    const filteredEvents = this.getFilteredEvents();
    const eventTypes = [...new Set(['all', ...this.state.events.map(e => e.event_type)])];
    const eventStatuses = [...new Set(['all', ...this.state.events.map(e => e.status)])];

    if (selectedEvent) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => {
              this.setState({ selectedEvent: null });
              navigate('/events');
            }}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-4" variant={selectedEvent.status === 'draft' ? 'secondary' : 'default'}>
                  {selectedEvent.event_type} • {selectedEvent.status}
                </Badge>
                <h1 className="text-4xl mb-4">{selectedEvent.title}</h1>
                <div className="w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedEvent.absolute_featured_image_url}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="text-xl text-muted-foreground mb-6"
                  dangerouslySetInnerHTML={{ __html: selectedEvent.description_html }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(selectedEvent.start_time).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedEvent.start_time).toLocaleTimeString()} -{' '}
                        {new Date(selectedEvent.end_time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedEvent.location || selectedEvent.address}</p>
                      {selectedEvent.online_link && (
                        <Button variant="link" asChild className="p-0 h-auto">
                          <a href={selectedEvent.online_link} target="_blank" rel="noopener noreferrer">
                            Online Link <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {selectedEvent.registration_count} / {selectedEvent.capacity} registered
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Registration: {new Date(selectedEvent.registration_start_date).toLocaleDateString()} -{' '}
                        {new Date(selectedEvent.registration_end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price: {selectedEvent.price === 0 ? 'Free' : `${selectedEvent.price} IRR`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEvent.status !== 'draft' ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Available Spots</p>
                        <p className="text-2xl font-bold">{selectedEvent.capacity - selectedEvent.registration_count}</p>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => this.setState({ isRegistrationOpen: true })}
                      >
                        Register Now
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Registration is free for all students and faculty
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">This event is in draft</p>
                      <Button variant="outline" disabled>
                        Registration Not Available
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedEvent.gallery_images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEvent.gallery_images.map((image) => (
                      <div key={image.id} className="aspect-video rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={image.absolute_image_url}
                          alt={image.alt_text || image.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <CommentSection postId={selectedEvent.id.toString()} postType="event" />

            <RatingSection eventId={selectedEvent.id.toString()} canRate={selectedEvent.status !== 'draft'} />
          </div>

          <EventRegistrationForm
            isOpen={isRegistrationOpen}
            onClose={() => this.setState({ isRegistrationOpen: false })}
            eventTitle={selectedEvent.title}
            eventId={selectedEvent.id.toString()}
          />
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-4">Events</h1>
          <p className="text-xl text-muted-foreground">
            Workshops, seminars, and networking opportunities for our community
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={this.handleSearchChange}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={this.handleTypeChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={this.handleStatusChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {eventStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'all' ? 'All Events' : status === 'upcoming' ? 'Upcoming' : 'Past Events'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && <p className="text-center text-muted-foreground">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No events found matching your search criteria.</p>
          </div>
        )}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => navigate(`/event/${event.slug}`)}
              >
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={event.absolute_featured_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={event.status === 'draft' ? 'secondary' : 'default'}>{event.event_type}</Badge>
                    <Badge variant={event.status === 'draft' ? 'secondary' : 'outline'}>{event.status}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(event.start_time).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {new Date(event.start_time).toLocaleTimeString()} -{' '}
                      {new Date(event.end_time).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location || event.address}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {event.registration_count}/{event.capacity} registered
                    </div>
                    <Button className="w-full">View Details</Button>
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
function EventsPage(props: Omit<EventsPageProps, 'navigate' | 'params'>) {
  const navigate = useNavigate();
  const params = useParams();
  return <EventsPageClass {...props} navigate={navigate} params={params} />;
}

export default EventsPage;