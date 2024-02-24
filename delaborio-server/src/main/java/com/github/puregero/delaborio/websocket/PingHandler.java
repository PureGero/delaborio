package com.github.puregero.delaborio.websocket;

import com.github.puregero.delaborio.DelaborioServer;
import com.google.gson.Gson;
import com.jcabi.manifests.Manifests;
import com.sun.management.OperatingSystemMXBean;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpUtil;
import io.netty.util.CharsetUtil;

import java.lang.management.ManagementFactory;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static io.netty.handler.codec.http.HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpResponseStatus.OK;

public class PingHandler implements PageHandler {
    private final Gson gson = new Gson();

    @Override
    public CompletableFuture<FullHttpResponse> handle(DelaborioServer server, FullHttpRequest req) {
        PingRequest request =
                req.content().readableBytes() == 0 ?
                        new PingRequest(null, null, null) :
                        gson.fromJson(req.content().toString(CharsetUtil.UTF_8), PingRequest.class);

        PingResponse response = new PingResponse(
                true,
                server.getPlayerManager().playerCount(),
                request.friends == null ? 0 : server.getPlayerManager().countFriends(request.friends),
                ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class).getCpuLoad() > 0.8,
                Manifests.exists("SCM-Revision") ? Manifests.read("SCM-Revision") : "dirty"
        );

        ByteBuf content = Unpooled.copiedBuffer(gson.toJson(response), CharsetUtil.UTF_8);
        FullHttpResponse res = new DefaultFullHttpResponse(req.protocolVersion(), OK, content);
        res.headers().set(CONTENT_TYPE, "application/json; charset=UTF-8");
        res.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        HttpUtil.setContentLength(res, content.readableBytes());
        return CompletableFuture.completedFuture(res);
    }

    private record PingRequest(UUID uuid, Map<UUID, String> friends, String gitHash) {}

    private record PingResponse(boolean alive, int players, int friends, boolean full, String gitHash) {}
}
