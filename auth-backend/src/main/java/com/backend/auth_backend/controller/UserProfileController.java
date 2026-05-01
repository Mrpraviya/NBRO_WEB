package com.backend.auth_backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.auth_backend.model.User;
import com.backend.auth_backend.model.UserProfile;
import com.backend.auth_backend.repository.UserProfileRepository;
import com.backend.auth_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/user-profiles")
public class UserProfileController {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileController(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserProfile userProfile) {
        if (userProfile.getUserId() == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }

        Optional<User> user = userRepository.findById(userProfile.getUserId());
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid userId: user does not exist");
        }

        UserProfile saved = userProfileRepository.save(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<UserProfile>> getAll() {
        return ResponseEntity.ok(userProfileRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable UUID id) {
        return userProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<UserProfile>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userProfileRepository.findByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UserProfile request) {
        return userProfileRepository.findById(id)
                .map(existing -> {
                    if (request.getUserId() == null) {
                        return ResponseEntity.badRequest().body("userId is required");
                    }

                    Optional<User> user = userRepository.findById(request.getUserId());
                    if (user.isEmpty()) {
                        return ResponseEntity.badRequest().body("Invalid userId: user does not exist");
                    }

                    existing.setUserId(request.getUserId());
                    existing.setEmail(request.getEmail());
                    existing.setName(request.getName());
                    existing.setContactNo(request.getContactNo());
                    existing.setBuildingRef(request.getBuildingRef());
                    existing.setTimestamp(request.getTimestamp());
                    existing.setDate(request.getDate());

                    UserProfile updated = userProfileRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!userProfileRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userProfileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
