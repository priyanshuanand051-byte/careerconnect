package com.career.connect.user.service;

import com.career.connect.user.AppUser;
import com.career.connect.user.UserRepository;
import com.career.connect.user.UserRole;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser register(
            String name,
            String email,
            String password,
            UserRole role) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "Email is already registered.");
        }

        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(UserRole.STUDENT);

        return userRepository.save(user);
    }
    
    public AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(
            () -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                "User not found"
            )
        );
    }
}