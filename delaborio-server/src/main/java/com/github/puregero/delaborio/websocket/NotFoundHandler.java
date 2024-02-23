package com.github.puregero.delaborio.websocket;

import com.github.puregero.delaborio.DelaborioServer;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpUtil;
import io.netty.util.CharsetUtil;

import java.util.concurrent.CompletableFuture;

import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpResponseStatus.NOT_FOUND;

public final class NotFoundHandler implements PageHandler {

    private static ByteBuf getContent() {
        return Unpooled.copiedBuffer("404 Not Found", CharsetUtil.UTF_8);
    }

    @Override
    public CompletableFuture<FullHttpResponse> handle(DelaborioServer server, FullHttpRequest req) {
        ByteBuf content = getContent();
        FullHttpResponse res = new DefaultFullHttpResponse(req.protocolVersion(), NOT_FOUND, content);

        res.headers().set(CONTENT_TYPE, "text/html; charset=UTF-8");
        HttpUtil.setContentLength(res, content.readableBytes());

        return CompletableFuture.completedFuture(res);
    }
}
