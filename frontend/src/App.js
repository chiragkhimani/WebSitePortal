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
import { AlertCircle, BookOpen, Code, Users, Star, ArrowRight, CheckCircle, Clock, Target, Trophy, Zap, PlayCircle, Menu, X, Calendar, GraduationCap, MessageCircle } from 'lucide-react';
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
    course_interest: 'SDET Bootcamp'
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pricingMode, setPricingMode] = useState('onetime'); // 'monthly' or 'onetime'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        course_interest: 'SDET Bootcamp'
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
    { icon: Users, label: 'Students Trained', value: '5,000+', iconColor: 'text-blue-500', type: 'simple' },
    { icon: Trophy, label: 'Highest Package Offered', value: '$180k', iconColor: 'text-yellow-500', type: 'trophy' },
    { icon: Star, label: 'Industry Rating', value: '4.9/5', iconColor: 'text-yellow-500', type: 'stars' },
    { icon: Target, label: 'Job Placement', value: '85%', iconColor: 'text-red-500', type: 'target' }
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-slate-900/80 via-blue-900/70 to-purple-900/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Chirag Khimani</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('courses-section')}
                className="text-blue-200/80 hover:text-white hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Course Details
              </button>
              <button
                onClick={() => scrollToSection('curriculum-section')}
                className="text-blue-200/80 hover:text-white hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Course Curriculum
              </button>
              <button
                onClick={() => scrollToSection('pricing-section')}
                className="text-blue-200/80 hover:text-white hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Pricing Plans
              </button>
              <button
                onClick={() => scrollToSection('about-section')}
                className="text-blue-200/80 hover:text-white hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('enrollment-section')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Contact Us
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-blue-200 hover:text-white hover:bg-blue-500/20 p-2 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-r from-slate-900/90 to-blue-900/90 backdrop-blur-md border-t border-blue-500/20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection('courses-section')}
                  className="block w-full text-left px-3 py-2 text-blue-200/80 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200"
                >
                  Course Details
                </button>
                <button
                  onClick={() => scrollToSection('curriculum-section')}
                  className="block w-full text-left px-3 py-2 text-blue-200/80 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200"
                >
                  Course Curriculum
                </button>
                <button
                  onClick={() => scrollToSection('pricing-section')}
                  className="block w-full text-left px-3 py-2 text-blue-200/80 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200"
                >
                  Pricing Plans
                </button>
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="block w-full text-left px-3 py-2 text-blue-200/80 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection('enrollment-section')}
                  className="block w-full text-left px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md font-semibold mt-2 shadow-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Minimal Notification Banner */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border-b border-orange-500/30 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span className="text-orange-100 font-medium">Next Batch Starts 04 November 2025</span>
            <span className="text-orange-300">•</span>
            <span className="text-orange-200 text-xs">Limited Seats Available!</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            The Ultimate <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Software Testing</span> & Automation Bootcamp
          </h1>
          <div className="text-xl md:text-2xl text-blue-300 mb-8 font-semibold italic text-center">
            <span className="typewriter">A journey from Aspirant to Achievements</span>
          </div>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your career with our comprehensive SDET program. Learn cutting-edge automation frameworks, 
            API testing, AI Tools, and land your dream job at top tech companies.
          </p>
          
          <div className="mb-16 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold shadow-lg rounded-full">
              🚀 From Zero to IT Professional in 6 Months
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold shadow-lg rounded-full">
              ✨ Now with AI Tools
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-center mx-auto mb-4">
                  {stat.type === 'stars' ? (
                    <Star className="h-12 w-12 text-yellow-500 fill-current drop-shadow-lg" />
                  ) : stat.type === 'target' ? (
                    <div className="text-4xl">🎯</div>
                  ) : stat.type === 'trophy' ? (
                    <div className="text-4xl">🏆</div>
                  ) : (
                    <stat.icon className={`h-12 w-12 ${stat.iconColor}`} />
                  )}
                </div>
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

      {/* Removed Course Modules Section as requested */}

      {/* Course Details Section */}
      <section id="courses-section" className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Course Details</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive 6-month intensive SDET program designed to transform your career in software testing
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Duration & Schedule Card */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-sm col-span-2">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 mr-6">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Program Duration</h3>
                    <p className="text-blue-400 text-2xl font-bold">6 Months Intensive Training</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                      <h4 className="text-white font-bold text-lg">Weekdays</h4>
                    </div>
                    <p className="text-gray-300 mb-2">Tuesday • Wednesday • Thursday</p>
                    <p className="text-blue-400 font-bold text-xl">8:00 PM - 10:00 PM CST</p>
                    <p className="text-gray-400 text-sm mt-2">Perfect for working professionals</p>
                  </div>
                  
                  <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center mb-4">
                      <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                      <h4 className="text-white font-bold text-lg">Weekends</h4>
                    </div>
                    <p className="text-gray-300 mb-2">Saturday • Sunday</p>
                    <p className="text-purple-400 font-bold text-xl">10:00 AM - 1:00 PM CST</p>
                    <p className="text-gray-400 text-sm mt-2">Hands-on practice sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entry Level Card */}
            <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Entry Level</h3>
                  <p className="text-green-400 text-xl font-bold mb-4">No IT Background Required</p>
                  <p className="text-gray-300">Perfect for beginners and career changers looking to enter the exciting SDET field</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white text-center mb-12">What's Included in Your Journey</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: PlayCircle, title: "Online Classes", desc: "Attend from Anywhere!", color: "from-blue-500 to-indigo-500" },
                { icon: BookOpen, title: "Class Recordings", desc: "Access to the Recording of the Classes", color: "from-purple-500 to-pink-500" },
                { icon: CheckCircle, title: "Homework", desc: "Plenty of Examples for Homework", color: "from-green-500 to-teal-500" },
                { icon: Star, title: "Assessments", desc: "Bi Weekly Quizzes and Exams", color: "from-yellow-500 to-orange-500" },
                { icon: Users, title: "Mentorship", desc: "Weekly 1 to 1 Mentorship", color: "from-red-500 to-pink-500" },
                { icon: Code, title: "Real Projects", desc: "Real Time Mock Project Experience", color: "from-indigo-500 to-purple-500" },
                { icon: Trophy, title: "Rewards", desc: "Lots of Rewards to Motivate Students on Exams", color: "from-teal-500 to-cyan-500" },
                { icon: Target, title: "Interview Prep", desc: "Interview Preparation Sessions", color: "from-orange-500 to-red-500" }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <Card className="bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm h-full">
                    <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                      <div>
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-3">{feature.title}</h4>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full"
              onClick={() => document.getElementById('enrollment-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your IT Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Course Curriculum Section */}
      <section id="curriculum-section" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Course Curriculum</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master the essential technologies and tools used by SDET professionals worldwide
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Java', filename: 'Java.png', color: 'from-orange-500 to-red-500' },
              { name: 'Selenium', filename: 'Selenium.png', color: 'from-green-500 to-blue-500' },
              { name: 'Cucumber', filename: 'Cucumber.png', color: 'from-green-400 to-green-600' },
              { name: 'Object Oriented Programming', filename: 'Object Oriented Programming.png', color: 'from-purple-500 to-pink-500' },
              { name: 'TestNG', filename: 'TestNG.png', color: 'from-blue-500 to-purple-500' },
              { name: 'Framework Development', filename: 'Framework Development.png', color: 'from-indigo-500 to-blue-500' },
              { name: 'Agile Methodology', filename: 'Agile Methodology.png', color: 'from-yellow-500 to-orange-500' },
              { name: 'Mock Project', filename: 'Moc Project.png', color: 'from-red-500 to-pink-500' },
              { name: 'Interview Prep', filename: 'Interview Prep.png', color: 'from-teal-500 to-green-500' },
              { name: 'Maven', filename: 'Maven.png', color: 'from-orange-600 to-red-600' },
              { name: 'GitHub', filename: 'GitHub.png', color: 'from-gray-700 to-slate-900' },
              { name: 'Jenkins', filename: 'Jenkins.png', color: 'from-blue-600 to-indigo-600' },
              { name: 'MySQL', filename: 'mysql.png', color: 'from-blue-500 to-blue-700' },
              { name: 'Postman', filename: 'Postman.png', color: 'from-orange-500 to-red-500' },
              { name: 'Rest Assured', filename: 'Rest Assured.png', color: 'from-green-500 to-teal-500' }
            ].map((tech, index) => (
              <div key={index} className="group">
                <Card className="bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/50 transition-all duration-500 transform hover:scale-110 hover:rotate-2 backdrop-blur-sm relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="relative mb-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tech.color} p-1 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-2xl`}>
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-2">
                          <img 
                            src={`/icons/${tech.filename}`} 
                            alt={tech.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">${tech.name.charAt(0)}</div>`;
                            }}
                          />
                        </div>
                      </div>
                      <div className={`absolute -inset-2 bg-gradient-to-r ${tech.color} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-lg -z-10`}></div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                      {tech.name}
                    </h3>
                    <div className={`w-0 h-0.5 bg-gradient-to-r ${tech.color} mx-auto group-hover:w-full transition-all duration-500 rounded-full`}></div>
                  </CardContent>
                  
                  {/* Animated corner accent */}
                  <div className={`absolute top-0 right-0 w-0 h-0 group-hover:w-8 group-hover:h-8 bg-gradient-to-br ${tech.color} transition-all duration-500 opacity-60`}></div>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">Each technology is taught with hands-on projects and real-world applications</p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-600">
                <Code className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-300">Hands-on Practice</span>
              </div>
              <div className="flex items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-600">
                <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-gray-300">Industry Standards</span>
              </div>
              <div className="flex items-center bg-slate-800/50 rounded-full px-6 py-3 border border-slate-600">
                <Target className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300">Job-Ready Skills</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Pricing Plans</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan that fits your learning journey and career goals
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex justify-center">
              <div className="bg-slate-800/50 rounded-full p-1 border border-slate-600 backdrop-blur-sm">
                <div className="flex items-center">
                  <button
                    onClick={() => setPricingMode('monthly')}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      pricingMode === 'monthly' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setPricingMode('onetime')}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      pricingMode === 'onetime' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Pay All in One
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Career Consultation */}
            <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm relative hover:transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Career Consultation</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">Free</div>
                  <p className="text-gray-300">15min Zoom Session</p>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 mb-6">
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
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SDET Bootcamp - Featured */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50 backdrop-blur-sm relative transform scale-105 hover:scale-110 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-sm font-bold">
                  MOST POPULAR
                </Badge>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">SDET Bootcamp</h3>
                  <div className="text-5xl font-bold text-white mb-2">
                    {pricingMode === 'monthly' ? '$1,000' : '$5,000'}
                  </div>
                  <p className="text-gray-300">
                    {pricingMode === 'monthly' ? 'Per Month × 6 Months' : 'One Time Payment'}
                  </p>
                  {pricingMode === 'monthly' && (
                    <p className="text-blue-400 text-sm mt-2">Total: $6,000 (6-Month Program)</p>
                  )}
                </div>

                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
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
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support Session */}
            <Card className="bg-slate-800/50 border-slate-600 backdrop-blur-sm relative hover:transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Support Session</h3>
                  <div className="text-4xl font-bold text-purple-400 mb-2">Get Price</div>
                  <p className="text-gray-300">Customized Support</p>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 mb-6">
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
                      <Target className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-4 text-lg font-semibold">All plans include 24/7 support and lifetime access to course materials</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Money Back Guarantee</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Flexible Payment Options</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 text-green-400 mr-2" />Career Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-section" className="py-24 px-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">About Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming careers from non-IT backgrounds to high-demand IT professionals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Mission & Books Section */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600 backdrop-blur-sm h-full">
                <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                <div className="text-gray-300 text-lg leading-relaxed mb-8 space-y-4">
                  <p>We bridge the gap between non-IT backgrounds and high-demand IT careers.</p>
                  <p>Whether you're a <span className="text-pink-400 font-bold">housewife</span>, <span className="text-blue-400 font-bold">nurse</span>, or <span className="text-orange-400 font-bold">truck driver</span>, you can become an IT professional in just <span className="text-purple-400 font-bold">6 months</span>.</p>
                </div>
                
                {/* Books Section */}
                <div className="border-t border-slate-600 pt-6">
                  <h4 className="text-xl font-bold text-white mb-4">Published Java Resources</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a 
                      href="https://www.amazon.com/Java-Revision-Notes-Color-Coded/dp/9357017798"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 hover:from-slate-600/40 hover:to-slate-700/40 rounded-xl p-4 transition-all duration-300 border border-slate-600/50 hover:border-orange-500/50 transform hover:scale-105"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_sdet-sheet-connect/artifacts/dnvadr71_Java%20Revision%20Notes.jpg"
                          alt="Java Revision Notes"
                          className="w-16 h-20 object-cover rounded drop-shadow-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h5 className="text-orange-400 font-bold text-sm group-hover:text-orange-300 mb-1">Java Revision Notes</h5>
                          <p className="text-gray-400 text-xs mb-2">Color Coded Edition</p>
                          <p className="text-gray-300 text-xs leading-relaxed">Quick interview prep in hours, not weeks</p>
                        </div>
                      </div>
                    </a>
                    
                    <a 
                      href="https://www.amazon.com/Java-Coding-Programs-Chirag-Khimani/dp/936013662X"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-br from-slate-700/30 to-slate-800/30 hover:from-slate-600/40 hover:to-slate-700/40 rounded-xl p-4 transition-all duration-300 border border-slate-600/50 hover:border-green-500/50 transform hover:scale-105"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src="https://customer-assets.emergentagent.com/job_sdet-sheet-connect/artifacts/wxafsi10_Java%20Coding%20Program.jpeg"
                          alt="Java Coding Programs"
                          className="w-16 h-20 object-cover rounded drop-shadow-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h5 className="text-green-400 font-bold text-sm group-hover:text-green-300 mb-1">Java Coding Programs</h5>
                          <p className="text-gray-400 text-xs mb-2">Color Coded Edition</p>
                          <p className="text-gray-300 text-xs leading-relaxed">Build problem-solving mindset</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Profile Section */}
            <div>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600 backdrop-blur-sm text-center h-full flex flex-col justify-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-2xl">
                      <img 
                        src="https://customer-assets.emergentagent.com/job_sdet-sheet-connect/artifacts/lzex97p7_Untitled%20design.png" 
                        alt="Chirag Khimani - SDET Trainer" 
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Chirag Khimani</h4>
                <p className="text-blue-400 font-semibold mb-2 text-sm">SDET Trainer & QA Automation Consultant</p>
                <p className="text-gray-400 text-xs mb-4">Author • Mentor • Industry Expert</p>
                <p className="text-gray-300 text-sm">Years of hands-on experience in test automation, Java development, and mentoring students worldwide.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-600 backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The program is led by <span className="text-blue-400 font-semibold">Chirag Khimani</span>, a seasoned SDET Trainer, 
              QA Automation Consultant, and Author of two popular Java books: Java Revision Notes – Color Coded and 
              Java Coding Programs – Color Coded. With years of hands-on experience in test automation, Java development, 
              and mentoring students worldwide, Chirag combines deep technical expertise with a passion for teaching.
            </p>

            <h3 className="text-3xl font-bold text-white mb-8 text-center">What Sets Us Apart</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Foundation Building",
                  description: "Start with Java and programming logic, even if you have zero prior coding experience.",
                  icon: BookOpen,
                  color: "from-blue-500 to-indigo-500"
                },
                {
                  title: "Industry-Ready Tools",
                  description: "Learn Selenium, Playwright, Appium, RestAssured, Cucumber, TestNG, Jenkins, GitHub, Docker, and more.",
                  icon: Code,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Career Preparation",
                  description: "Resume building, LinkedIn optimization, mock interviews, and guidance to crack real job interviews.",
                  icon: Target,
                  color: "from-green-500 to-teal-500"
                },
                {
                  title: "Proven Results",
                  description: "Alumni have successfully transitioned to IT careers in the US, Canada, and India, securing high-paying automation roles.",
                  icon: Trophy,
                  color: "from-yellow-500 to-orange-500"
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-3">{feature.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                          className="bg-slate-700 border-slate-600 text-white h-12 text-lg"
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
                          className="bg-slate-700 border-slate-600 text-white h-12 text-lg"
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
                          className="bg-slate-700 border-slate-600 text-white h-12 text-lg"
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
                          className="bg-slate-700 border-slate-600 text-white h-12 text-lg"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="experience" className="text-white">Experience Level *</Label>
                        <Select value={enrollmentForm.experience_level} onValueChange={(value) => handleInputChange(enrollmentForm, setEnrollmentForm)('experience_level')(value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-12 text-lg">
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
                        <Input
                          id="course"
                          value="SDET Bootcamp"
                          readOnly
                          className="bg-slate-700 border-slate-600 text-white cursor-not-allowed h-12 text-lg"
                          placeholder="SDET Bootcamp"
                        />
                        <input type="hidden" name="course_interest" value="SDET Bootcamp" />
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

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.link/vmiqhs"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
        title="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-gray-500">
            Copyright © 2025 Chirag Khimani | All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;