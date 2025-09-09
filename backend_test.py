import requests
import sys
import json
from datetime import datetime

class SDETCourseAPITester:
    def __init__(self, base_url="https://sdet-sheet-connect.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        if success:
            # Verify response structure
            if 'status' in response and response['status'] == 'healthy':
                print("   ✅ Health status is healthy")
                return True
            else:
                print("   ❌ Health status is not healthy")
                return False
        return False

    def test_get_courses(self):
        """Test get all courses endpoint"""
        success, response = self.run_test(
            "Get All Courses",
            "GET",
            "courses",
            200
        )
        if success:
            # Verify response structure and course count
            if 'data' in response and len(response['data']) == 6:
                print(f"   ✅ Found {len(response['data'])} courses as expected")
                # Verify course structure
                course = response['data'][0]
                required_fields = ['id', 'title', 'description', 'duration', 'level', 'image', 'features']
                if all(field in course for field in required_fields):
                    print("   ✅ Course structure is valid")
                    return True, response['data']
                else:
                    print("   ❌ Course structure is missing required fields")
                    return False, []
            else:
                print(f"   ❌ Expected 6 courses, got {len(response.get('data', []))}")
                return False, []
        return False, []

    def test_filter_courses(self):
        """Test course filtering by level"""
        levels = ['Beginner', 'Intermediate', 'Advanced']
        all_passed = True
        
        for level in levels:
            success, response = self.run_test(
                f"Filter Courses - {level}",
                "GET",
                "courses/filter",
                200,
                params={'level': level}
            )
            if success:
                filtered_courses = response.get('data', [])
                # Verify all courses match the filter
                if all(course['level'] == level for course in filtered_courses):
                    print(f"   ✅ All {len(filtered_courses)} courses are {level} level")
                else:
                    print(f"   ❌ Some courses don't match {level} filter")
                    all_passed = False
            else:
                all_passed = False
        
        return all_passed

    def test_enrollment_form(self):
        """Test enrollment form submission"""
        # Test valid enrollment
        valid_enrollment = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "country": "United States",
            "phone_number": "+1234567890",
            "experience_level": "Intermediate",
            "course_interest": "Selenium WebDriver Fundamentals"
        }
        
        success, response = self.run_test(
            "Valid Enrollment Submission",
            "POST",
            "enroll",
            200,
            data=valid_enrollment
        )
        
        if success:
            if 'status' in response and response['status'] == 'success':
                print("   ✅ Enrollment submitted successfully")
                enrollment_success = True
            else:
                print("   ❌ Enrollment response doesn't indicate success")
                enrollment_success = False
        else:
            enrollment_success = False

        # Test invalid enrollment (missing required fields)
        invalid_enrollment = {
            "name": "",
            "email": "invalid-email",
            "country": "",
            "phone_number": "123",
            "experience_level": "InvalidLevel",
            "course_interest": ""
        }
        
        success, response = self.run_test(
            "Invalid Enrollment Submission",
            "POST",
            "enroll",
            422,  # Validation error
            data=invalid_enrollment
        )
        
        if success:
            print("   ✅ Invalid enrollment properly rejected")
            validation_success = True
        else:
            print("   ❌ Invalid enrollment should have been rejected")
            validation_success = False

        return enrollment_success and validation_success

    def test_contact_form(self):
        """Test contact form submission"""
        # Test valid contact
        valid_contact = {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "message": "I'm interested in learning more about your SDET courses and would like to schedule a consultation."
        }
        
        success, response = self.run_test(
            "Valid Contact Submission",
            "POST",
            "contact",
            200,
            data=valid_contact
        )
        
        if success:
            if 'status' in response and response['status'] == 'success':
                print("   ✅ Contact form submitted successfully")
                contact_success = True
            else:
                print("   ❌ Contact response doesn't indicate success")
                contact_success = False
        else:
            contact_success = False

        # Test invalid contact (short message)
        invalid_contact = {
            "name": "A",
            "email": "invalid-email",
            "message": "Short"
        }
        
        success, response = self.run_test(
            "Invalid Contact Submission",
            "POST",
            "contact",
            422,  # Validation error
            data=invalid_contact
        )
        
        if success:
            print("   ✅ Invalid contact properly rejected")
            validation_success = True
        else:
            print("   ❌ Invalid contact should have been rejected")
            validation_success = False

        return contact_success and validation_success

def main():
    print("🚀 Starting SDET Course API Testing...")
    print("=" * 60)
    
    # Setup
    tester = SDETCourseAPITester()
    
    # Run all tests
    print("\n📋 Running Backend API Tests...")
    
    # 1. Health Check
    health_passed = tester.test_health_check()
    
    # 2. Get Courses
    courses_passed, courses_data = tester.test_get_courses()
    
    # 3. Filter Courses
    filter_passed = tester.test_filter_courses()
    
    # 4. Enrollment Form
    enrollment_passed = tester.test_enrollment_form()
    
    # 5. Contact Form
    contact_passed = tester.test_contact_form()
    
    # Print results
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    print(f"Total Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    # Detailed results
    print("\n📋 DETAILED RESULTS:")
    print(f"✅ Health Check: {'PASS' if health_passed else 'FAIL'}")
    print(f"✅ Get Courses: {'PASS' if courses_passed else 'FAIL'}")
    print(f"✅ Filter Courses: {'PASS' if filter_passed else 'FAIL'}")
    print(f"✅ Enrollment Form: {'PASS' if enrollment_passed else 'FAIL'}")
    print(f"✅ Contact Form: {'PASS' if contact_passed else 'FAIL'}")
    
    # Failed tests details
    if tester.failed_tests:
        print("\n❌ FAILED TESTS DETAILS:")
        for i, failed_test in enumerate(tester.failed_tests, 1):
            print(f"{i}. {failed_test['name']}")
            if 'error' in failed_test:
                print(f"   Error: {failed_test['error']}")
            else:
                print(f"   Expected: {failed_test['expected']}, Got: {failed_test['actual']}")
                print(f"   Response: {failed_test['response']}")
    
    # Return appropriate exit code
    all_critical_passed = health_passed and courses_passed and filter_passed
    return 0 if all_critical_passed else 1

if __name__ == "__main__":
    sys.exit(main())