package com.github.rahmnathan.gametime.web;

import com.github.rahmnathan.gametime.service.SlotService;
import com.github.rahmnathan.gametime.web.dto.SlotDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Admin endpoints for managing slots.
 * TODO: Add authentication (simple token-based for MVP)
 */
@RestController
@RequestMapping("/api/admin/slots")
@RequiredArgsConstructor
public class AdminController {

    private final SlotService slotService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SlotDto createSlot(@RequestBody SlotDto request) {
        return slotService.createSlot(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelSlot(@PathVariable UUID id) {
        slotService.cancelSlot(id);
    }
}
