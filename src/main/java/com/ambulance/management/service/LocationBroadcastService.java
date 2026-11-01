package com.ambulance.management.service;

import com.ambulance.management.dto.AmbulanceResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    public LocationBroadcastService(
            SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastLocation(AmbulanceResponse ambulance) {

        messagingTemplate.convertAndSend(
                "/topic/ambulance/" + ambulance.getId(),
                ambulance
        );

        messagingTemplate.convertAndSend(
                "/topic/ambulances",
                ambulance
        );
    }
}