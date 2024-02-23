package com.github.puregero.delaborio.database;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public interface PlayerDataStorage {

    CompletableFuture<PlayerData> getPlayerData(UUID uuid);

    CompletableFuture<Void> putPlayerData(UUID uuid, PlayerData playerData);

}
