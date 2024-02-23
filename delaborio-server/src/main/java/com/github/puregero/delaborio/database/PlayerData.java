package com.github.puregero.delaborio.database;

import com.google.gson.Gson;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class PlayerData {

    public UUID uuid;
    public String username;
    public String displayName;
    public String avatarUrl;

    public double x;
    public double y;

    public int xp;
    public int level;

    public Map<UUID, String> friends = new ConcurrentHashMap<>();

    public long playTimeSeconds;
    public long lastOnlineTime;
    public String currentlyOnlineServer;

    public PlayerData(UUID uuid) {
        this.uuid = uuid;
    }

    @Override
    public String toString() {
        return new Gson().toJson(this);
    }
}
