// File path: src/services/authService.js
const API_BASE = "http://localhost:8000/api/v1";

const mockLoginResponse = (email) => {
    // Simulate finding a supervisor test account
    if (email === "supervisor@tatapower.com" || email === "prasaddevikar@email.com") {
        return {
            access_token: "mock-supervisor-token-12345",
            token_type: "bearer",
            user_id: 2,
            role: "supervisor",
            name: "Prasad D. Devikar",
            email: "supervisor@tatapower.com"
        };
    }
    // Simulate finding a worker test account (will fail ProtectedRoute)
    if (email === "worker@tatapower.com") {
        return {
            access_token: "mock-worker-token-67890",
            token_type: "bearer",
            user_id: 3,
            role: "worker",
            name: "Amit Worker",
            email: "worker@tatapower.com"
        };
    }
    throw new Error("Invalid credentials or user not found.");
};

export async function loginUser(email, password) {
    console.log(`[AUTH] Attempting login for: ${email}`);
    
    // Use Mock Data for demonstration
    try {
        const response = mockLoginResponse(email);
        // Simulate a slight delay
        await new Promise(resolve => setTimeout(resolve, 500)); 
        return response;
    } catch (error) {
        throw new Error("Invalid Email or Password. Try supervisor@tatapower.com / Super@123");
    }

    /*
    // Real API Call Structure (uncomment in a real environment)
    // const response = await fetch(`${API_BASE}/auth/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    // });
    // if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error(error.detail || 'Login failed');
    // }
    // return response.json();
    */
}

export async function registerUser(userData) {
    // This is a placeholder as the focus is the dashboard login
    console.log(`[AUTH] Registering user: ${userData.email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Registration successful. Please login.", success: true };
    
    /*
    // Real API Call Structure
    // const response = await fetch(`${API_BASE}/auth/register`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userData)
    // });
    // ... handling
    */
}