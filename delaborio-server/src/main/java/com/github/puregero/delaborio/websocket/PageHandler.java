package com.github.puregero.delaborio.websocket;

import com.github.puregero.delaborio.DelaborioServer;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;

import java.util.concurrent.CompletableFuture;

public interface PageHandler {

    CompletableFuture<FullHttpResponse> handle(DelaborioServer server, FullHttpRequest req);

}
