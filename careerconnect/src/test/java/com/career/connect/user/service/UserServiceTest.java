
package com.career.connect.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.career.connect.user.AppUser;
import com.career.connect.user.UserRepository;
import com.career.connect.user.UserRole;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void register_whenEmailIsNew_registersStudent() {

        when(userRepository.existsByEmail("student@example.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("encoded-password");

        when(userRepository.save(
                org.mockito.ArgumentMatchers.any(AppUser.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppUser result = userService.register(
                "Test Student",
                "student@example.com",
                "password123",
                UserRole.RECRUITER
        );

        assertEquals("Test Student", result.getName());
        assertEquals("student@example.com", result.getEmail());
        assertEquals("encoded-password", result.getPasswordHash());

        // Registration must always assign STUDENT.
        assertEquals(UserRole.STUDENT, result.getRole());

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(
                org.mockito.ArgumentMatchers.any(AppUser.class));
    }

    @Test
    void register_whenEmailAlreadyExists_throwsException() {

        when(userRepository.existsByEmail("student@example.com"))
                .thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.register(
                        "Test Student",
                        "student@example.com",
                        "password123",
                        UserRole.STUDENT
                )
        );

        // No password encoding or saving should happen.
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void getUserByEmail_whenUserExists_returnsUser() {

        AppUser user = new AppUser();
        user.setName("Test Student");
        user.setEmail("student@example.com");
        user.setRole(UserRole.STUDENT);

        when(userRepository.findByEmail("student@example.com"))
                .thenReturn(Optional.of(user));

        AppUser result =
                userService.getUserByEmail("  STUDENT@EXAMPLE.COM  ");

        assertEquals("Test Student", result.getName());
        assertEquals("student@example.com", result.getEmail());

        verify(userRepository).findByEmail("student@example.com");
    }

    @Test
    void getUserByEmail_whenUserDoesNotExist_throwsException() {

        when(userRepository.findByEmail("unknown@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> userService.getUserByEmail("unknown@example.com")
        );
    }
}
