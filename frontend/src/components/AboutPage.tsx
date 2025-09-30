import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Target, Award, Calendar, Mail, Phone, MapPin } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string, id?: string) => void;
}

const teamMembers = [
  {
    name: 'Dr. Ahmad Mohammadi',
    role: 'Faculty Advisor',
    department: 'Computer Engineering',
    email: 'a.mohammadi@guilan.ac.ir',
    specialization: 'Artificial Intelligence, Machine Learning'
  },
  {
    name: 'Prof. Sara Hashemi',
    role: 'Co-Advisor',
    department: 'Software Engineering',
    email: 's.hashemi@guilan.ac.ir',
    specialization: 'Software Development, Project Management'
  },
  {
    name: 'Ali Rezaei',
    role: 'President',
    department: 'Computer Engineering Student',
    email: 'ali.rezaei@student.guilan.ac.ir',
    specialization: 'Full-Stack Development, Leadership'
  },
  {
    name: 'Maryam Karimi',
    role: 'Vice President',
    department: 'Computer Engineering Student',
    email: 'maryam.karimi@student.guilan.ac.ir',
    specialization: 'Data Science, Research'
  },
  {
    name: 'Hassan Gholami',
    role: 'Technical Lead',
    department: 'Computer Engineering Student',
    email: 'hassan.gholami@student.guilan.ac.ir',
    specialization: 'System Architecture, DevOps'
  },
  {
    name: 'Zahra Alavi',
    role: 'Events Coordinator',
    department: 'Computer Engineering Student',
    email: 'zahra.alavi@student.guilan.ac.ir',
    specialization: 'Event Management, Public Relations'
  }
];

const achievements = [
  {
    year: '2024',
    title: 'Best Student Association Award',
    description: 'Recognized for outstanding contribution to student development'
  },
  {
    year: '2023',
    title: 'Research Excellence Award',
    description: 'Published 15+ research papers and organized 3 major conferences'
  },
  {
    year: '2023',
    title: 'Community Impact Recognition',
    description: 'Served over 500 students through workshops and mentoring programs'
  },
  {
    year: '2022',
    title: 'Innovation in Education',
    description: 'Pioneered new learning methodologies in computer engineering'
  }
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4">About ACE</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The Association of Computer Engineering at Guilan University is dedicated to fostering 
          innovation, knowledge sharing, and professional growth in the field of computer engineering.
        </p>
      </div>

      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Target className="mr-3 h-6 w-6 text-primary" />
              <CardTitle>Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide a platform for computer engineering students and faculty to collaborate, 
              learn, and innovate. We strive to bridge the gap between academic learning and 
              industry requirements while fostering a community of passionate technologists.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <Award className="mr-3 h-6 w-6 text-primary" />
              <CardTitle>Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the leading student organization in computer engineering, recognized for 
              excellence in education, research, and community service. We envision a future 
              where our members become leaders in technology and innovation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">250+</div>
          <p className="text-muted-foreground">Active Members</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">45</div>
          <p className="text-muted-foreground">Research Papers</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">28</div>
          <p className="text-muted-foreground">Events This Year</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">8</div>
          <p className="text-muted-foreground">Years Active</p>
        </div>
      </div>

      {/* What We Do */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>What We Do</CardTitle>
          <CardDescription>
            Our activities and services for the computer engineering community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Educational Workshops</h4>
              <p className="text-sm text-muted-foreground">
                Regular workshops on cutting-edge technologies and industry best practices
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Research Support</h4>
              <p className="text-sm text-muted-foreground">
                Guidance and resources for student research projects and publications
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Industry Connections</h4>
              <p className="text-sm text-muted-foreground">
                Networking opportunities with industry professionals and companies
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Career Development</h4>
              <p className="text-sm text-muted-foreground">
                Career counseling, resume reviews, and interview preparation
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Technical Competitions</h4>
              <p className="text-sm text-muted-foreground">
                Programming contests and hackathons to challenge and showcase skills
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Academic Support</h4>
              <p className="text-sm text-muted-foreground">
                Tutoring, study groups, and academic mentoring programs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="mb-12">
        <h2 className="text-3xl mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.name}>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <div className="space-y-2">
                  <Badge variant="outline">
                    {member.role}
                  </Badge>
                  <CardDescription>
                    {member.department}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {member.email}
                  </div>
                  <div className="text-sm">
                    <strong>Specialization:</strong> {member.specialization}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-12">
        <h2 className="text-3xl mb-6">Our Achievements</h2>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.title}>
              <CardContent className="flex items-center p-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Badge variant="secondary" className="mr-2">
                      {achievement.year}
                    </Badge>
                    <h3 className="font-semibold">{achievement.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{achievement.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Get in touch with us for more information or to join our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">ace@guilan.ac.ir</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+98 13 3369 0000</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    Engineering Faculty, Guilan University<br />
                    Rasht, Guilan Province, Iran
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-muted-foreground">
                    Sunday - Thursday: 9:00 AM - 5:00 PM<br />
                    Friday: 9:00 AM - 12:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Membership</p>
                  <p className="text-muted-foreground">
                    Open to all Computer Engineering students and faculty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}