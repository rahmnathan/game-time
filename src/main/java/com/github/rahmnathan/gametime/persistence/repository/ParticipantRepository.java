package com.github.rahmnathan.gametime.persistence.repository;

import com.github.rahmnathan.gametime.persistence.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
}
