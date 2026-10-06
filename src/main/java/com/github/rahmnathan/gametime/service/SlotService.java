package com.github.rahmnathan.gametime.service;

import com.github.rahmnathan.gametime.persistence.entity.Participant;
import com.github.rahmnathan.gametime.persistence.entity.Slot;
import com.github.rahmnathan.gametime.persistence.repository.ParticipantRepository;
import com.github.rahmnathan.gametime.persistence.repository.SlotRepository;
import com.github.rahmnathan.gametime.web.dto.JoinRequest;
import com.github.rahmnathan.gametime.web.dto.SlotDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotRepository slotRepository;
    private final ParticipantRepository participantRepository;

    public List<SlotDto> getUpcomingSlots() {
        return slotRepository.findUpcomingSlots(OffsetDateTime.now())
                .stream()
                .map(this::toDto)
                .toList();
    }

    public SlotDto getSlot(UUID id) {
        Slot slot = slotRepository.findByIdWithParticipants(id);
        if (slot == null) {
            throw new EntityNotFoundException("Slot not found: " + id);
        }
        return toDto(slot);
    }

    @Transactional
    public SlotDto joinSlot(UUID slotId, JoinRequest request) {
        Slot slot = slotRepository.findByIdWithParticipants(slotId);
        if (slot == null) {
            throw new EntityNotFoundException("Slot not found: " + slotId);
        }

        if (slot.getCancelled()) {
            throw new IllegalStateException("Cannot join a cancelled slot");
        }

        Participant participant = Participant.builder()
                .slot(slot)
                .firstName(request.firstName())
                .preferredGame(request.preferredGame())
                .build();
        participantRepository.save(participant);

        log.info("Participant {} joined slot {}", request.firstName(), slotId);
        return getSlot(slotId);
    }

    @Transactional
    public SlotDto leaveSlot(UUID slotId, UUID participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new EntityNotFoundException("Participant not found: " + participantId));

        if (!participant.getSlot().getId().equals(slotId)) {
            throw new IllegalArgumentException("Participant does not belong to this slot");
        }

        participant.setCancelled(true);
        participantRepository.save(participant);

        log.info("Participant {} left slot {}", participantId, slotId);
        return getSlot(slotId);
    }

    @Transactional
    public SlotDto createSlot(SlotDto request) {
        Slot slot = Slot.builder()
                .dateTime(request.dateTime())
                .location(request.location())
                .games(request.games())
                .groupChatLink(request.groupChatLink())
                .build();

        slot = slotRepository.save(slot);
        log.info("Created slot {} for {}", slot.getId(), slot.getDateTime());
        return toDto(slot);
    }

    @Transactional
    public void cancelSlot(UUID slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new EntityNotFoundException("Slot not found: " + slotId));

        slot.setCancelled(true);
        slotRepository.save(slot);
        log.info("Cancelled slot {}", slotId);
    }

    private SlotDto toDto(Slot slot) {
        List<String> participantNames = slot.getParticipants().stream()
                .filter(p -> !p.getCancelled())
                .map(Participant::getFirstName)
                .toList();

        return new SlotDto(
                slot.getId(),
                slot.getDateTime(),
                slot.getLocation(),
                slot.getGames(),
                slot.getGroupChatLink(),
                slot.getCancelled(),
                slot.getActiveParticipantCount(),
                participantNames
        );
    }
}
