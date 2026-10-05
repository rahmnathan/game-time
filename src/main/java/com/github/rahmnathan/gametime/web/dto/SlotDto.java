package com.github.rahmnathan.gametime.web.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record SlotDto(
        UUID id,
        OffsetDateTime dateTime,
        String location,
        String games,
        String groupChatLink,
        Boolean cancelled,
        Integer participantCount,
        List<String> participantNames
) {
}
