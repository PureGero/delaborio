package com.github.puregero.delaborio.auth;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

public record AuthResponse(UUID uuid, String username, String displayName, String avatarUrl) {

    public static UUID uuidFromId(String prefix, String id) {
        return UUID.nameUUIDFromBytes((prefix + "-" + id).getBytes(StandardCharsets.UTF_8));
    }

}
