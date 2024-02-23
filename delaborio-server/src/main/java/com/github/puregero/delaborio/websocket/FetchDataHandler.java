package com.github.puregero.delaborio.websocket;

import com.github.puregero.delaborio.DelaborioServer;
import com.github.puregero.delaborio.auth.DiscordAuth;
import com.github.puregero.delaborio.util.ServerTiming;
import com.google.gson.Gson;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpUtil;
import io.netty.util.CharsetUtil;

import java.util.concurrent.CompletableFuture;

import static io.netty.handler.codec.http.HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpResponseStatus.BAD_REQUEST;
import static io.netty.handler.codec.http.HttpResponseStatus.OK;
import static io.netty.handler.codec.http.HttpResponseStatus.UNAUTHORIZED;

public class FetchDataHandler implements PageHandler {
    private final Gson gson = new Gson();

    @Override
    public CompletableFuture<FullHttpResponse> handle(DelaborioServer server, FullHttpRequest req) {
        if (req.content().readableBytes() == 0) {
            return CompletableFuture.completedFuture(new DefaultFullHttpResponse(req.protocolVersion(), BAD_REQUEST));
        }

        String body = req.content().toString(CharsetUtil.UTF_8);
        FetchDataRequest request = gson.fromJson(body, FetchDataRequest.class);

        if (request.userid == null || request.accessToken == null) {
            return CompletableFuture.completedFuture(new DefaultFullHttpResponse(req.protocolVersion(), BAD_REQUEST));
        }

        ServerTiming serverTiming = new ServerTiming("discordAuth");

        return DiscordAuth.auth(request.accessToken).thenCompose(response -> {
            if (response == null) {
                return CompletableFuture.completedFuture(new DefaultFullHttpResponse(req.protocolVersion(), UNAUTHORIZED));
            }

            serverTiming.startNew("playerData");

            return server.getPlayerDataStorage().getPlayerData(response.uuid()).thenApply(playerData -> {
                playerData.uuid = response.uuid();
                playerData.username = response.username();
                playerData.displayName = response.displayName();
                playerData.avatarUrl = response.avatarUrl();

                ByteBuf content = Unpooled.copiedBuffer(gson.toJson(playerData), CharsetUtil.UTF_8);
                FullHttpResponse res = new DefaultFullHttpResponse(req.protocolVersion(), OK, content);
                res.headers().set(CONTENT_TYPE, "application/json; charset=UTF-8");
                res.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
                res.headers().set("Server-Timing", serverTiming.toString());
                HttpUtil.setContentLength(res, content.readableBytes());
                return res;
            });
        });
    }

    private record FetchDataRequest(String userid, String accessToken) {}
}
