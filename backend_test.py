#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class LivrariaAPITester:
    def __init__(self, base_url="https://author-marketplace-8.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.owner_token = None
        self.test_user_token = None
        self.test_book_id = None
        self.test_submission_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        return success

    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            return self.log_test("Health Check", response.status_code == 200, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Health Check", False, str(e))

    def test_owner_login(self):
        """Test owner login"""
        try:
            response = self.session.post(f"{self.base_url}/auth/login", json={
                "email": "sandro@vereler.com",
                "password": "owner123"
            }, timeout=10)
            
            if response.status_code == 200:
                # Extract token from cookies
                if 'access_token' in response.cookies:
                    self.owner_token = response.cookies['access_token']
                    return self.log_test("Owner Login", True)
                else:
                    return self.log_test("Owner Login", False, "No access token in cookies")
            else:
                return self.log_test("Owner Login", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            return self.log_test("Owner Login", False, str(e))

    def test_get_owner_info(self):
        """Test getting owner information"""
        try:
            response = self.session.get(f"{self.base_url}/owner", timeout=10)
            success = response.status_code == 200 and response.json() is not None
            return self.log_test("Get Owner Info", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Owner Info", False, str(e))

    def test_get_owner_books(self):
        """Test getting owner's books"""
        try:
            response = self.session.get(f"{self.base_url}/books?owner_only=true", timeout=10)
            if response.status_code == 200:
                books = response.json()
                success = len(books) > 0
                if success and books:
                    self.test_book_id = books[0]['id']  # Store for later tests
                return self.log_test("Get Owner Books", success, f"Found {len(books)} books")
            else:
                return self.log_test("Get Owner Books", False, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Owner Books", False, str(e))

    def test_get_book_detail(self):
        """Test getting book details"""
        if not self.test_book_id:
            return self.log_test("Get Book Detail", False, "No book ID available")
        
        try:
            response = self.session.get(f"{self.base_url}/books/{self.test_book_id}", timeout=10)
            success = response.status_code == 200
            return self.log_test("Get Book Detail", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Book Detail", False, str(e))

    def test_get_genres(self):
        """Test getting available genres"""
        try:
            response = self.session.get(f"{self.base_url}/genres", timeout=10)
            if response.status_code == 200:
                genres = response.json()
                success = len(genres) > 0
                return self.log_test("Get Genres", success, f"Found {len(genres)} genres")
            else:
                return self.log_test("Get Genres", False, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Genres", False, str(e))

    def test_user_registration(self):
        """Test user registration"""
        try:
            test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@test.com"
            response = self.session.post(f"{self.base_url}/auth/register", json={
                "email": test_email,
                "password": "testpass123",
                "name": "Test User",
                "role": "reader"
            }, timeout=10)
            
            if response.status_code == 200:
                if 'access_token' in response.cookies:
                    self.test_user_token = response.cookies['access_token']
                    return self.log_test("User Registration", True)
                else:
                    return self.log_test("User Registration", False, "No access token in cookies")
            else:
                return self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            return self.log_test("User Registration", False, str(e))

    def test_add_to_cart(self):
        """Test adding book to cart"""
        if not self.test_book_id or not self.test_user_token:
            return self.log_test("Add to Cart", False, "Missing book ID or user token")
        
        try:
            # Set the token in cookies for this request
            cookies = {'access_token': self.test_user_token}
            response = self.session.post(f"{self.base_url}/cart", 
                json={"book_id": self.test_book_id, "quantity": 1},
                cookies=cookies,
                timeout=10)
            success = response.status_code == 200
            return self.log_test("Add to Cart", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Add to Cart", False, str(e))

    def test_get_cart(self):
        """Test getting cart contents"""
        if not self.test_user_token:
            return self.log_test("Get Cart", False, "Missing user token")
        
        try:
            cookies = {'access_token': self.test_user_token}
            response = self.session.get(f"{self.base_url}/cart", cookies=cookies, timeout=10)
            success = response.status_code == 200
            return self.log_test("Get Cart", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Cart", False, str(e))

    def test_checkout(self):
        """Test checkout process"""
        if not self.test_user_token:
            return self.log_test("Checkout", False, "Missing user token")
        
        try:
            cookies = {'access_token': self.test_user_token}
            response = self.session.post(f"{self.base_url}/checkout", 
                json={},
                cookies=cookies,
                timeout=10)
            success = response.status_code == 200
            if success:
                order_data = response.json()
                pix_key_present = 'pix_key' in order_data
                return self.log_test("Checkout", success and pix_key_present, 
                    f"Status: {response.status_code}, PIX key present: {pix_key_present}")
            else:
                return self.log_test("Checkout", False, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Checkout", False, str(e))

    def test_create_submission(self):
        """Test creating a book submission"""
        if not self.test_user_token:
            return self.log_test("Create Submission", False, "Missing user token")
        
        try:
            cookies = {'access_token': self.test_user_token}
            response = self.session.post(f"{self.base_url}/submissions", 
                json={
                    "title": "Test Book Submission",
                    "synopsis": "This is a test book submission for testing purposes.",
                    "message": "Please review my book submission."
                },
                cookies=cookies,
                timeout=10)
            
            if response.status_code == 200:
                submission_data = response.json()
                self.test_submission_id = submission_data.get('id')
                return self.log_test("Create Submission", True)
            else:
                return self.log_test("Create Submission", False, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Create Submission", False, str(e))

    def test_get_submissions(self):
        """Test getting submissions"""
        if not self.owner_token:
            return self.log_test("Get Submissions", False, "Missing owner token")
        
        try:
            cookies = {'access_token': self.owner_token}
            response = self.session.get(f"{self.base_url}/submissions", cookies=cookies, timeout=10)
            success = response.status_code == 200
            return self.log_test("Get Submissions", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Submissions", False, str(e))

    def test_marketplace_books(self):
        """Test getting marketplace books"""
        try:
            response = self.session.get(f"{self.base_url}/books", timeout=10)
            if response.status_code == 200:
                books = response.json()
                success = isinstance(books, list)
                return self.log_test("Get Marketplace Books", success, f"Found {len(books)} books")
            else:
                return self.log_test("Get Marketplace Books", False, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Get Marketplace Books", False, str(e))

    def test_search_books(self):
        """Test book search functionality"""
        try:
            response = self.session.get(f"{self.base_url}/books?search=Muito", timeout=10)
            success = response.status_code == 200
            return self.log_test("Search Books", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Search Books", False, str(e))

    def test_filter_by_genre(self):
        """Test filtering books by genre"""
        try:
            response = self.session.get(f"{self.base_url}/books?genre=espiritualidade", timeout=10)
            success = response.status_code == 200
            return self.log_test("Filter by Genre", success, f"Status: {response.status_code}")
        except Exception as e:
            return self.log_test("Filter by Genre", False, str(e))

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Livraria Ver e Ler API Tests\n")
        
        # Basic tests
        self.test_health_check()
        self.test_get_owner_info()
        self.test_get_owner_books()
        self.test_get_genres()
        
        # Auth tests
        self.test_owner_login()
        self.test_user_registration()
        
        # Book tests
        self.test_get_book_detail()
        self.test_marketplace_books()
        self.test_search_books()
        self.test_filter_by_genre()
        
        # Cart and checkout tests
        self.test_add_to_cart()
        self.test_get_cart()
        self.test_checkout()
        
        # Submission tests
        self.test_create_submission()
        self.test_get_submissions()
        
        # Results
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = LivrariaAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())