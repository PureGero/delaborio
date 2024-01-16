package com.github.puregero.delaborio;

import com.github.puregero.delaborio.entity.Player;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class PlayerManager {

    private final Set<Player> players = ConcurrentHashMap.newKeySet();

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void removePlayer(Player player) {
        if (player == null) {
            return;
        }

        players.remove(player);
    }

    public void broadcastMessage(String message) {
        for (Player player : players) {
            player.sendMessage(message);
        }
    }

}
