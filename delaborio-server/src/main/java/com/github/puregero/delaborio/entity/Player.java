package com.github.puregero.delaborio.entity;

import com.github.puregero.delaborio.net.Connection;
import com.github.puregero.delaborio.net.packet.ChatPacket;

public class Player extends MobileEntity {

    private final Connection connection;
    private final String name;

    public Player(Connection connection, String name) {
        this.connection = connection;
        this.name = name;
    }

    public void sendMessage(String message) {
        connection.sendPacket(new ChatPacket(message));
    }

    public String getName() {
        return name;
    }
}
