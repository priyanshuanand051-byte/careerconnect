package com.career.connect.user.service;

import com.career.connect.user.AppUser;
import com.career.connect.user.UserRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        AppUser appUser = userRepository.findByEmail(
                email.trim().toLowerCase()
            )
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with email: " + email
            ));

        return User.withUsername(appUser.getEmail())
            .password(appUser.getPasswordHash())
            .roles(appUser.getRole().name())
            .build();
    }
}