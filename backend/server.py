from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List
import uuid
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials
import re
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SDET Course API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Google Sheets Configuration
GOOGLE_SHEETS_ID = "1vsCtPUNfqb0jTJ0d8DiiXwyf7w0Acd1W3T3d79KE3Ws"

def get_google_sheets_client():
    """Initialize and return authenticated Google Sheets client using service account key"""
    try:
        # Create service account credentials programmatically for demo
        # In production, you would load from a secure JSON file
        service_account_info = {
            "type": "service_account",
            "project_id": "sdet-course-demo",
            "private_key_id": "demo_key_id",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
            "client_email": "sdet-course-service@sdet-course-demo.iam.gserviceaccount.com",
            "client_id": "123456789",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sdet-course-service%40sdet-course-demo.iam.gserviceaccount.com"
        }
        
        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive.file"
        ]
        
        # For demo purposes, we'll simulate the Google Sheets integration
        # In production, uncomment the lines below and provide real credentials
        # credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
        # client = gspread.authorize(credentials)
        # return client
        
        # Demo mode - just return None for now
        return None
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize Google Sheets client: {str(e)}"
        )

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class CourseEnrollmentForm(BaseModel):
    name: str
    email: EmailStr
    country: str
    phone_number: str
    experience_level: str = Field(..., description="Beginner, Intermediate, or Advanced")
    course_interest: str = Field(..., description="Which SDET course tracks interest them")
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name must be less than 100 characters')
        if re.search(r'[<>"\']', v):
            raise ValueError('Name contains invalid characters')
        return v.strip()
    
    @validator('country')
    def validate_country(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Country must be at least 2 characters')
        if len(v) > 50:
            raise ValueError('Country must be less than 50 characters')
        return v.strip()
    
    @validator('phone_number')
    def validate_phone(cls, v):
        cleaned = re.sub(r'[\s\-\(\)]', '', v)
        if not re.match(r'^\+?[1-9]\d{6,14}$', cleaned):
            raise ValueError('Invalid phone number format')
        return cleaned
    
    @validator('experience_level')
    def validate_experience(cls, v):
        allowed_levels = ['Beginner', 'Intermediate', 'Advanced']
        if v not in allowed_levels:
            raise ValueError(f'Experience level must be one of: {", ".join(allowed_levels)}')
        return v
    
    class Config:
        str_strip_whitespace = True
        validate_assignment = True

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()
    
    @validator('message')
    def validate_message(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters')
        return v.strip()

# Course data
COURSE_MODULES = [
    {
        "id": "1",
        "title": "Selenium WebDriver Fundamentals",
        "description": "Master the basics of Selenium WebDriver for web automation testing",
        "duration": "4 weeks",
        "level": "Beginner",
        "image": "https://images.unsplash.com/photo-1573164574472-797cdf4a583a",
        "features": ["Element locators", "WebDriver commands", "Browser automation", "Basic test scripts"]
    },
    {
        "id": "2", 
        "title": "Advanced Test Automation",
        "description": "Build robust automation frameworks with advanced testing patterns",
        "duration": "6 weeks",
        "level": "Advanced",
        "image": "https://images.unsplash.com/photo-1592609931095-54a2168ae893",
        "features": ["Page Object Model", "Data-driven testing", "Parallel execution", "CI/CD integration"]
    },
    {
        "id": "3",
        "title": "API Testing Mastery", 
        "description": "Comprehensive API testing with REST, GraphQL, and automation tools",
        "duration": "5 weeks",
        "level": "Intermediate",
        "image": "https://images.unsplash.com/photo-1573496773905-f5b17e717f05",
        "features": ["REST API testing", "Postman automation", "JSON validation", "Performance testing"]
    },
    {
        "id": "4",
        "title": "Mobile Test Automation",
        "description": "Native and hybrid mobile app testing with Appium and modern tools",
        "duration": "5 weeks", 
        "level": "Intermediate",
        "image": "https://images.unsplash.com/photo-1649451844931-57e22fc82de3",
        "features": ["Appium setup", "iOS/Android testing", "Mobile gestures", "Device cloud testing"]
    },
    {
        "id": "5",
        "title": "Performance Testing",
        "description": "Load testing, stress testing, and performance optimization strategies",
        "duration": "4 weeks",
        "level": "Advanced",
        "image": "https://images.unsplash.com/photo-1588690154757-badf4644190f",
        "features": ["JMeter mastery", "Load scenarios", "Performance metrics", "Bottleneck analysis"]
    },
    {
        "id": "6",
        "title": "Test Framework Design",
        "description": "Build scalable, maintainable test automation frameworks from scratch",
        "duration": "8 weeks",
        "level": "Advanced", 
        "image": "https://images.unsplash.com/photo-1551033406-611cf9a28f67",
        "features": ["Framework architecture", "Custom utilities", "Reporting systems", "Maintenance strategies"]
    }
]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "SDET Course API - Welcome to the future of Software Testing!"}

@api_router.get("/health")
async def health_check():
    """Health check endpoint with Google Sheets connectivity test"""
    try:
        sheets_status = "connected" if get_google_sheets_client() is not None else "demo_mode"
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "google_sheets_status": sheets_status,
            "database_status": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }

@api_router.get("/courses")
async def get_courses():
    """Get all available SDET course modules"""
    return {
        "status": "success",
        "data": COURSE_MODULES,
        "total_courses": len(COURSE_MODULES)
    }

@api_router.get("/courses/filter")
async def filter_courses(level: str = None, duration: str = None):
    """Filter courses by level or duration"""
    filtered_courses = COURSE_MODULES
    
    if level:
        filtered_courses = [course for course in filtered_courses if course["level"].lower() == level.lower()]
    
    if duration:
        filtered_courses = [course for course in filtered_courses if duration.lower() in course["duration"].lower()]
    
    return {
        "status": "success",
        "data": filtered_courses,
        "total_courses": len(filtered_courses),
        "filters_applied": {"level": level, "duration": duration}
    }

@api_router.post("/enroll")
async def submit_enrollment(form_data: CourseEnrollmentForm):
    """Submit course enrollment form to Google Sheets"""
    try:
        # Store in MongoDB
        enrollment_data = form_data.dict()
        enrollment_data['id'] = str(uuid.uuid4())
        enrollment_data['submission_time'] = datetime.utcnow()
        
        await db.enrollments.insert_one(enrollment_data)
        
        # In production, this would write to Google Sheets
        # client = get_google_sheets_client()
        # if client:
        #     sheet = client.open_by_key(GOOGLE_SHEETS_ID).sheet1
        #     row_data = [
        #         form_data.name,
        #         form_data.email,
        #         form_data.country,
        #         form_data.phone_number,
        #         form_data.experience_level,
        #         form_data.course_interest,
        #         datetime.utcnow().isoformat()
        #     ]
        #     sheet.append_row(row_data)
        
        return {
            "status": "success",
            "message": "Enrollment submitted successfully! Our team will contact you within 24 hours.",
            "enrollment_id": enrollment_data['id']
        }
        
    except Exception as e:
        logging.error(f"Enrollment submission error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit enrollment. Please try again later."
        )

@api_router.post("/contact")
async def submit_contact(form_data: ContactForm):
    """Submit contact form"""
    try:
        contact_data = form_data.dict()
        contact_data['id'] = str(uuid.uuid4())
        contact_data['submission_time'] = datetime.utcnow()
        
        await db.contacts.insert_one(contact_data)
        
        return {
            "status": "success",
            "message": "Thank you for contacting us! We'll get back to you soon.",
            "contact_id": contact_data['id']
        }
        
    except Exception as e:
        logging.error(f"Contact submission error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to submit contact form. Please try again later."
        )

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()