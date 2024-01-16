package com.github.puregero.delaborio.entity;

import java.util.UUID;

public class MobileEntity extends Entity {
    private final UUID uuid = UUID.randomUUID();

    public UUID getUuid() {
        return uuid;
    }
}
