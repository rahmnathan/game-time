package com.github.rahmnathan.gametime.persistence.repository;

import com.github.rahmnathan.gametime.persistence.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SlotRepository extends JpaRepository<Slot, UUID> {

    @Query("SELECT DISTINCT s FROM Slot s LEFT JOIN FETCH s.participants WHERE s.dateTime >= :now AND s.cancelled = false ORDER BY s.dateTime")
    List<Slot> findUpcomingSlots(OffsetDateTime now);

    @Query("SELECT s FROM Slot s LEFT JOIN FETCH s.participants WHERE s.id = :id")
    Slot findByIdWithParticipants(UUID id);
}
