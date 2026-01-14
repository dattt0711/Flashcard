package com.flashcard.service.impl;

import com.flashcard.dto.auth.*;
import com.flashcard.entity.AuthIdentity;
import com.flashcard.entity.User;
import com.flashcard.enums.AuthProvider;
import com.flashcard.exception.BadRequestException;
import com.flashcard.exception.UnauthorizedException;
import com.flashcard.repository.AuthIdentityRepository;
import com.flashcard.repository.UserRepository;
import com.flashcard.security.JwtTokenProvider;
import com.flashcard.security.SecurityUtils;
import com.flashcard.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthIdentityRepository authIdentityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        User user = User.builder()
            .email(request.getEmail())
            .username(request.getUsername())
            .build();
        user = userRepository.save(user);

        AuthIdentity authIdentity = AuthIdentity.builder()
            .user(user)
            .provider(AuthProvider.LOCAL)
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .build();
        authIdentityRepository.save(authIdentity);

        String token = jwtTokenProvider.generateToken(user.getId());

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        AuthIdentity localIdentity = authIdentityRepository
            .findByProviderAndEmail(AuthProvider.LOCAL, request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), localIdentity.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId());

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .build();
    }

    @Override
    @Transactional
    public AuthResponse googleAuth(GoogleAuthRequest request) {
        // TODO: Implement Google OAuth token verification
        // For now, this is a placeholder that should verify the Google ID token
        // and extract user info (sub, email, name) from it
        throw new BadRequestException("Google authentication not yet implemented. Configure Google OAuth client.");
    }

    @Override
    public UserResponse getCurrentUser() {
        var userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .createdAt(user.getCreatedAt())
            .build();
    }

    @Override
    @Transactional
    public void addPassword(String password) {
        var userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (authIdentityRepository.existsByUserIdAndProvider(userId, AuthProvider.LOCAL)) {
            throw new BadRequestException("Password already set");
        }

        AuthIdentity authIdentity = AuthIdentity.builder()
            .user(user)
            .provider(AuthProvider.LOCAL)
            .email(user.getEmail())
            .passwordHash(passwordEncoder.encode(password))
            .build();
        authIdentityRepository.save(authIdentity);
    }
}
