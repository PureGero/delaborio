package com.github.puregero.delaborio.entity;

import com.github.puregero.delaborio.database.PlayerData;
import com.github.puregero.delaborio.net.Connection;
import com.github.puregero.delaborio.net.packet.ChatPacket;

import java.util.UUID;

public class Player extends MobileEntity {

    private final Connection connection;
    private final PlayerData playerData;

    public Player(Connection connection, PlayerData playerData) {
        this.connection = connection;
        this.playerData = playerData;
    }

    public void sendMessage(String message) {
        connection.sendPacket(new ChatPacket(message));
    }

    public String getName() {
        return playerData.displayName;
    }

    @Override
    public UUID getUuid() {
        return playerData.uuid;
    }
}
