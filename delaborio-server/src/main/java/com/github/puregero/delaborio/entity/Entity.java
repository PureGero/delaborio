package com.github.puregero.delaborio.entity;

import java.util.concurrent.CompletableFuture;

public class Entity {

    private CompletableFuture<Void> runInSync = CompletableFuture.completedFuture(null);

    public synchronized CompletableFuture<Void> run(Runnable runnable) {
        return runInSync = runInSync.thenRun(runnable);
    }

}
