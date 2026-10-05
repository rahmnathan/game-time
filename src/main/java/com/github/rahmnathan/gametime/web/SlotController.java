package com.github.rahmnathan.gametime.web;

import com.github.rahmnathan.gametime.service.SlotService;
import com.github.rahmnathan.gametime.web.dto.JoinRequest;
import com.github.rahmnathan.gametime.web.dto.SlotDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping
    public List<SlotDto> getUpcomingSlots() {
        return slotService.getUpcomingSlots();
    }

    @GetMapping("/{id}")
    public SlotDto getSlot(@PathVariable UUID id) {
        return slotService.getSlot(id);
    }

    @PostMapping("/{id}/join")
    public SlotDto joinSlot(@PathVariable UUID id, @Valid @RequestBody JoinRequest request) {
        return slotService.joinSlot(id, request);
    }

    @DeleteMapping("/{slotId}/participants/{participantId}")
    public SlotDto leaveSlot(@PathVariable UUID slotId, @PathVariable UUID participantId) {
        return slotService.leaveSlot(slotId, participantId);
    }
}
