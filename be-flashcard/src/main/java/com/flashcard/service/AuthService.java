package com.flashcard.service;

import com.flashcard.dto.auth.*;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse googleAuth(GoogleAuthRequest request);
    UserResponse getCurrentUser();
    void addPassword(String password);
}
