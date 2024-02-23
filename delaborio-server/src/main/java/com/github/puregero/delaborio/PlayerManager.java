package com.github.puregero.delaborio;

import com.github.puregero.delaborio.entity.Player;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class PlayerManager {

    private final Map<UUID, Player> players = new ConcurrentHashMap();

    public void addPlayer(Player player) {
        players.put(player.getUuid(), player);
    }

    public void removePlayer(Player player) {
        if (player == null) {
            return;
        }

        players.remove(player.getUuid());
    }

    public void broadcastMessage(String message) {
        for (Player player : players.values()) {
            player.sendMessage(message);
        }
    }

    public int playerCount() {
        return players.size();
    }

    public int countFriends(Map<UUID, String> friends) {
        return (int) friends.keySet().stream().filter(players::containsKey).count();
    }
}
