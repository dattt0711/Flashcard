package com.flashcard.repository;

import com.flashcard.entity.AuthIdentity;
import com.flashcard.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthIdentityRepository extends JpaRepository<AuthIdentity, UUID> {

    Optional<AuthIdentity> findByProviderAndProviderUserId(AuthProvider provider, String providerUserId);

    Optional<AuthIdentity> findByProviderAndEmail(AuthProvider provider, String email);

    List<AuthIdentity> findByUserId(UUID userId);

    boolean existsByUserIdAndProvider(UUID userId, AuthProvider provider);
}
