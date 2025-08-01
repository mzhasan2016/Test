# Registration Guide

The EnergyExe Admin UI now includes full registration functionality with middle name support.

## 🚀 How to Register

### Option 1: Direct URL
Navigate directly to the registration page:
```
http://localhost:5173/register
```

### Option 2: From Login Page
1. Go to the login page: `http://localhost:5173/login`
2. Click on "Create one here" link at the bottom
3. You'll be redirected to the registration page

## 📝 Registration Form Fields

The registration form includes the following fields:

### Required Fields (*)
- **Username**: Must be at least 3 characters long
- **Email**: Must be a valid email address
- **Password**: Must be at least 6 characters long
- **Confirm Password**: Must match the password

### Optional Fields
- **First Name**: Your first name
- **Middle Name**: Your middle name (optional) ✨
- **Last Name**: Your last name

## 🔄 Registration Flow

1. **Fill out the form** with your information
2. **Submit the form** by clicking "Create Account"
3. **Success message** will appear
4. **Automatic redirect** to login page
5. **Login** with your new credentials

## ✨ Middle Name Support

The registration form includes full middle name support:
- Optional field in the registration form
- Properly stored in the user profile
- Displayed throughout the application using the `formatDisplayName()` utility
- Included in user selection dropdowns

## 🛡️ Validation

The form includes comprehensive validation:
- **Username**: Required, minimum 3 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Password Confirmation**: Must match password
- **Real-time validation**: Errors shown as you type

## 🎨 UI Features

- **Responsive design**: Works on all screen sizes
- **Loading states**: Button shows "Creating Account..." during submission
- **Error handling**: Clear error messages for validation and API errors
- **Success feedback**: Toast notification on successful registration
- **Navigation links**: Easy navigation between login and register pages

## 🔧 Backend Requirements

For registration to work, your backend must have:

### 1. Registration Endpoint
```python
@app.post("/auth/register")
async def register(user_data: UserCreate):
    # Create new user with middle_name support
    # Return created user data
```

### 2. User Model with Middle Name
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    middle_name = Column(String, nullable=True)  # ← Middle name support
    last_name = Column(String, nullable=True)
    hashed_password = Column(String)
    # ... other fields
```

### 3. Pydantic Schemas
```python
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    first_name: Optional[str] = None
    middle_name: Optional[str] = None  # ← Middle name support
    last_name: Optional[str] = None
```

## 🚨 Troubleshooting

### Common Issues

1. **"Registration failed" error**
   - Check if backend registration endpoint exists
   - Verify CORS settings allow frontend origin
   - Check backend logs for specific errors

2. **Validation errors**
   - Ensure all required fields are filled
   - Check password requirements (minimum 6 characters)
   - Verify email format is correct

3. **Username/Email already exists**
   - Try a different username
   - Use a different email address
   - Check if user already exists in database

### API Endpoint Testing

Test your registration endpoint directly:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "middle_name": "William",
    "last_name": "Doe"
  }'
```

## 🎯 Next Steps

After registration:
1. **Login** with your new credentials
2. **Explore the dashboard** and features
3. **Create projects** and manage data
4. **Invite other users** to collaborate

## 📱 Mobile Support

The registration form is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

---

**Note**: Make sure your backend supports the middle name field in the user model and registration endpoint for full functionality!