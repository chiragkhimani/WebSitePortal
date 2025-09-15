import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { AlertCircle, BookOpen, Code, Users, Star, ArrowRight, CheckCircle, Clock, Target, Trophy, Zap, PlayCircle } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrollmentForm, setEnrollmentForm] = useState({
    name: '',
    email: '',
    country: '',
    phone_number: '',
    experience_level: '',
    course_interest: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedLevel === 'all') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(course => course.level.toLowerCase() === selectedLevel.toLowerCase()));
    }
  }, [courses, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API}/enroll`, enrollmentForm);
      setSubmitStatus({
        type: 'success',
        message: response.data.message
      });
      setEnrollmentForm({
        name: '',
        email: '',
        country: '',
        phone_number: '',
        experience_level: '',
        course_interest: ''
      });
    } catch (error) {
      let errorMessage = 'Failed to submit enrollment. Please try again.';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => err.msg).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      }
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API}/contact`, contactForm);
      setSubmitStatus({
        type: 'success',
        message: response.data.message
      });
      setContactForm({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      let errorMessage = 'Failed to submit contact form. Please try again.';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => err.msg).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        }
      }
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (form, setForm) => (field) => (value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = [
    { icon: Users, label: 'Students Trained', value: '10,000+' },
    { icon: Trophy, label: 'Success Rate', value: '95%' },
    { icon: Star, label: 'Industry Rating', value: '4.9/5' },
    { icon: Target, label: 'Job Placement', value: '85%' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior SDET at Microsoft',
      rating: 5,
      comment: 'This SDET program completely transformed my career. The hands-on approach and real-world projects prepared me perfectly for my role at Microsoft.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Ahmed Khan',
      role: 'Test Automation Lead at Google',
      rating: 5,
      comment: 'Excellent curriculum covering everything from basics to advanced automation frameworks. The instructors are industry experts with real experience.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Maria Garcia',
      role: 'QA Engineer at Amazon', 
      rating: 5,
      comment: 'The comprehensive coverage of testing tools and methodologies gave me the confidence to tackle complex automation challenges in my current role.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-lg font-semibold">
              🚀 #1 SDET Training Program
            </Badge>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
            The Ultimate <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Software Testing</span> & Automation Bootcamp
          </h1>
          <p className="text-2xl md:text-3xl text-blue-300 mb-8 font-semibold">
            A journey from Aspirant to Achievements
          </p>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your career with our comprehensive SDET program. Learn cutting-edge automation frameworks, 
            API testing, mobile testing, and land your dream job at top tech companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => document.getElementById('enrollment-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Your Journey Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
              onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Why Choose Our SDET Program?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive program is designed by industry experts to provide hands-on experience 
              with the latest testing tools and methodologies used by top tech companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3" 
                alt="Professional programming setup" 
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Industry-Relevant Curriculum</h3>
                  <p className="text-gray-300">Learn the exact skills and tools used by SDET professionals at companies like Google, Microsoft, and Amazon.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Hands-On Projects</h3>
                  <p className="text-gray-300">Build real automation frameworks and testing solutions that you can showcase in your portfolio.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Expert Mentorship</h3>
                  <p className="text-gray-300">Learn from experienced SDET professionals who provide personalized guidance and career advice.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Job Placement Support</h3>
                  <p className="text-gray-300">85% job placement rate with dedicated career support, interview preparation, and industry connections.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses-section" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Course Modules</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose from our comprehensive range of SDET courses designed to take you from beginner to expert
            </p>
            
            <div className="flex justify-center mb-8">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-64 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white">Loading courses...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl backdrop-blur-sm">
                  <CardHeader className="p-0">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {course.level}
                      </Badge>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{course.title}</CardTitle>
                    <CardDescription className="text-gray-300 mb-4">
                      {course.description}
                    </CardDescription>
                    <div className="space-y-2 mb-6">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      onClick={() => {
                        setEnrollmentForm(prev => ({ ...prev, course_interest: course.title }));
                        document.getElementById('enrollment-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Enroll Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Course Details Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Course Details</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive 6-month SDET program designed to transform your career in software testing
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Clock className="h-8 w-8 text-blue-400 mr-4" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Duration</h3>
                      <p className="text-blue-400 text-xl font-semibold">6 Months</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-white font-semibold mb-2">Weekdays Schedule</h4>
                      <p className="text-gray-300">Tuesday | Wednesday | Thursday</p>
                      <p className="text-blue-400 font-semibold">7:00 PM to 9:00 PM CST</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-white font-semibold mb-2">Weekend Schedule</h4>
                      <p className="text-gray-300">Saturday | Sunday</p>
                      <p className="text-purple-400 font-semibold">9:00 AM to 12:00 PM CST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Target className="h-8 w-8 text-green-400 mr-4" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">Entry Level</h3>
                      <p className="text-green-400 text-xl font-semibold">No IT Background Required</p>
                    </div>
                  </div>
                  <p className="text-gray-300">Perfect for beginners and career changers looking to enter the SDET field</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                  <div className="flex items-center mb-3">
                    <PlayCircle className="h-6 w-6 text-blue-400 mr-3" />
                    <h4 className="text-white font-semibold">Online Classes</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Attend from Anywhere!</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-6 w-6 text-purple-400 mr-3" />
                    <h4 className="text-white font-semibold">Class Recordings</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Access to the Recording of the Classes</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                    <h4 className="text-white font-semibold">Homework</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Plenty of Examples for Homework</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                  <div className="flex items-center mb-3">
                    <Star className="h-6 w-6 text-yellow-400 mr-3" />
                    <h4 className="text-white font-semibold">Assessments</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Bi Weekly Quizzes and Exams</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                  <div className="flex items-center mb-3">
                    <Users className="h-6 w-6 text-red-400 mr-3" />
                    <h4 className="text-white font-semibold">Mentorship</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Weekly 1 to 1 Mentorship</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
                  <div className="flex items-center mb-3">
                    <Code className="h-6 w-6 text-indigo-400 mr-3" />
                    <h4 className="text-white font-semibold">Real Projects</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Real Time Mock Project Experience</p>
                </div>

                <div className="bg-gradient-to-br from-teal-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-teal-500/20">
                  <div className="flex items-center mb-3">
                    <Trophy className="h-6 w-6 text-teal-400 mr-3" />
                    <h4 className="text-white font-semibold">Rewards</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Lots of Rewards to Motivate Students on Exams</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
                  <div className="flex items-center mb-3">
                    <Target className="h-6 w-6 text-orange-400 mr-3" />
                    <h4 className="text-white font-semibold">Interview Prep</h4>
                  </div>
                  <p className="text-gray-300 text-sm">Interview Preparation Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Course Curriculum</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the essential technologies and tools used by SDET professionals worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Java', icon: '☕', color: 'from-orange-500 to-red-500' },
              { name: 'Selenium', icon: '🌐', color: 'from-green-500 to-blue-500' },
              { name: 'Cucumber', icon: '🥒', color: 'from-green-400 to-green-600' },
              { name: 'Object Oriented Programming', icon: '🧩', color: 'from-purple-500 to-pink-500' },
              { name: 'TestNG', icon: '🧪', color: 'from-blue-500 to-purple-500' },
              { name: 'Framework Development', icon: '🏗️', color: 'from-indigo-500 to-blue-500' },
              { name: 'Agile Methodology', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
              { name: 'Mock Project', icon: '🚀', color: 'from-red-500 to-pink-500' },
              { name: 'Interview Prep', icon: '💼', color: 'from-teal-500 to-green-500' },
              { name: 'Maven', icon: '📦', color: 'from-brown-500 to-orange-500' },
              { name: 'GitHub', icon: '🐙', color: 'from-gray-700 to-gray-900' },
              { name: 'Jenkins', icon: '⚙️', color: 'from-blue-600 to-indigo-600' },
              { name: 'MySQL', icon: '🗄️', color: 'from-blue-500 to-blue-700' },
              { name: 'Postman', icon: '📮', color: 'from-orange-500 to-red-500' },
              { name: 'Rest Assured', icon: '🔒', color: 'from-green-500 to-teal-500' }
            ].map((tech, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg">{tech.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Pricing Plans</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan that fits your learning journey and career goals
            </p>
            <div className="flex justify-center mt-8">
              <div className="bg-slate-800/50 rounded-full p-1 border border-slate-600">
                <div className="flex items-center">
                  <span className="px-4 py-2 text-gray-300">Monthly</span>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 mx-2">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <span className="px-4 py-2 text-white font-semibold">Pay All in One</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Career Consultation */}
            <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm relative">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Career Consultation</h3>
                  <div className="text-4xl font-bold text-orange-500 mb-2">Free</div>
                  <p className="text-gray-300">15min Zoom Session</p>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mb-6">
                  Book A Slot
                </Button>

                <div className="space-y-4">
                  <p className="text-gray-300 mb-4">Get personalized career advice from our team on</p>
                  {[
                    'Career Selection',
                    'Questions',
                    'Roadblocks',
                    'Market Research',
                    'Resume Writing'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SDET Bootcamp - Featured */}
            <Card className="bg-gradient-to-br from-orange-100/10 to-orange-200/10 border-orange-500/50 backdrop-blur-sm relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 text-sm">
                  MOST POPULAR
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">SDET Bootcamp</h3>
                  <div className="text-5xl font-bold text-white mb-2">Check Price</div>
                  <p className="text-gray-300">One Time Payment</p>
                </div>

                <Button className="w-full bg-white text-orange-500 hover:bg-gray-100 font-semibold py-3 mb-6">
                  Get a Quote Now
                </Button>

                <div className="space-y-4">
                  <p className="text-white font-semibold mb-4">All-inclusive package</p>
                  {[
                    'Live Sessions',
                    'Interview Preparation',
                    'Resume Writing',
                    'Mock Interviews',
                    '1-1 Mentorship'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support Session */}
            <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm relative">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Support Session</h3>
                  <div className="text-4xl font-bold text-orange-500 mb-2">Get Price</div>
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 mb-6">
                  Book A Slot
                </Button>

                <div className="space-y-4">
                  <p className="text-gray-300 mb-4">Support Session On</p>
                  {[
                    'Assistance in Job',
                    'Assistance in Interview',
                    'Job Search Strategies and Tips',
                    'Mentorship',
                    'Mock Interviews'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400">All plans include 24/7 support and lifetime access to course materials</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from our graduates who have successfully transitioned into SDET roles at top companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Section */}
      <section id="enrollment-section" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Your SDET Journey?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful graduates and transform your career in software testing and automation
            </p>
          </div>

          <Tabs defaultValue="enrollment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-600">
              <TabsTrigger value="enrollment" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
                Course Enrollment
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
                Contact Us
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enrollment">
              <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Course Enrollment Form</CardTitle>
                  <CardDescription className="text-gray-300">
                    Fill out the form below and our team will contact you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus && (
                    <Alert className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className={submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {submitStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleEnrollmentSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          value={enrollmentForm.name}
                          onChange={(e) => handleInputChange(enrollmentForm, setEnrollmentForm)('name')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={enrollmentForm.email}
                          onChange={(e) => handleInputChange(enrollmentForm, setEnrollmentForm)('email')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="country" className="text-white">Country *</Label>
                        <Input
                          id="country"
                          value={enrollmentForm.country}
                          onChange={(e) => handleInputChange(enrollmentForm, setEnrollmentForm)('country')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter your country"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={enrollmentForm.phone_number}
                          onChange={(e) => handleInputChange(enrollmentForm, setEnrollmentForm)('phone_number')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="experience" className="text-white">Experience Level *</Label>
                        <Select value={enrollmentForm.experience_level} onValueChange={(value) => handleInputChange(enrollmentForm, setEnrollmentForm)('experience_level')(value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course" className="text-white">Course Interest *</Label>
                        <Select value={enrollmentForm.course_interest} onValueChange={(value) => handleInputChange(enrollmentForm, setEnrollmentForm)('course_interest')(value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.title}>{course.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Contact Us</CardTitle>
                  <CardDescription className="text-gray-300">
                    Have questions? Get in touch with our team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="contact-name" className="text-white">Name *</Label>
                        <Input
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) => handleInputChange(contactForm, setContactForm)('name')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email" className="text-white">Email *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => handleInputChange(contactForm, setContactForm)('email')(e.target.value)}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Message *</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => handleInputChange(contactForm, setContactForm)('message')(e.target.value)}
                        required
                        rows={5}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Tell us about your questions or requirements..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">SDET Mastery Program</h3>
          <p className="text-gray-400 mb-8">Transforming careers through comprehensive software testing education</p>
          <div className="text-sm text-gray-500">
            © 2024 SDET Training Program. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;