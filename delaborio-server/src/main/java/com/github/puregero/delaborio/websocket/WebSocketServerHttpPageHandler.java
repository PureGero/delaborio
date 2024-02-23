package com.github.puregero.delaborio.websocket;

import com.github.puregero.delaborio.DelaborioServer;
import io.netty.buffer.ByteBufUtil;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpUtil;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import static io.netty.handler.codec.http.HttpMethod.GET;
import static io.netty.handler.codec.http.HttpMethod.OPTIONS;
import static io.netty.handler.codec.http.HttpMethod.POST;
import static io.netty.handler.codec.http.HttpResponseStatus.BAD_REQUEST;
import static io.netty.handler.codec.http.HttpResponseStatus.FORBIDDEN;
import static io.netty.handler.codec.http.HttpResponseStatus.INTERNAL_SERVER_ERROR;

public class WebSocketServerHttpPageHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

    private final DelaborioServer delaborioServer;
    private final String websocketPath;

    private final Map<String, PageHandler> pageHandlers = new HashMap<>();
    private final PageHandler defaultHandler;

    public WebSocketServerHttpPageHandler(DelaborioServer delaborioServer, String websocketPath) {
        this.delaborioServer = delaborioServer;
        this.websocketPath = websocketPath;

        defaultHandler = new NotFoundHandler();
        registerPageHandler("/", new IndexHandler());
        registerPageHandler("/index.html", new IndexHandler());
        registerPageHandler("/ping", new PingHandler());
        registerPageHandler("/fetchdata", new FetchDataHandler());
    }

    private void registerPageHandler(String path, PageHandler handler) {
        pageHandlers.put(path.toLowerCase(Locale.ROOT), handler);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest req) throws Exception {
        // Handle a bad request.
        if (!req.decoderResult().isSuccess()) {
            sendHttpResponse(ctx, req, new DefaultFullHttpResponse(req.protocolVersion(), BAD_REQUEST,
                                                                   ctx.alloc().buffer(0)));
            return;
        }

        // Handle websocket upgrade request.
        if (req.headers().contains(HttpHeaderNames.UPGRADE, HttpHeaderValues.WEBSOCKET, true)) {
            ctx.fireChannelRead(req.retain());
            return;
        }

        if (OPTIONS.equals(req.method())) {
            FullHttpResponse res = new DefaultFullHttpResponse(req.protocolVersion(), HttpResponseStatus.OK);
            res.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            res.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, OPTIONS");
            res.headers().set(HttpHeaderNames.ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type");
            res.headers().set(HttpHeaderNames.ACCESS_CONTROL_MAX_AGE, "86400");
            res.headers().set(HttpHeaderNames.CONTENT_LENGTH, 0);
            sendHttpResponse(ctx, req, res);
            return;
        }

        // Allow only GET methods.
        if (!GET.equals(req.method()) && !POST.equals(req.method())) {
            sendHttpResponse(ctx, req, new DefaultFullHttpResponse(req.protocolVersion(), FORBIDDEN,
                                                                   ctx.alloc().buffer(0)));
            return;
        }

        PageHandler pageHandler = defaultHandler;

        String path = req.uri();
        if (path != null) {
            if (path.contains("?")) {
                path = path.substring(0, path.indexOf("?"));
            }

            pageHandler = pageHandlers.getOrDefault(path, defaultHandler);
        }

        pageHandler.handle(delaborioServer, req)
                .thenAccept(res -> sendHttpResponse(ctx, req, res))
                .exceptionally(cause -> {
                    cause.printStackTrace();
                    sendHttpResponse(ctx, req, new DefaultFullHttpResponse(req.protocolVersion(), INTERNAL_SERVER_ERROR,
                                                                           ctx.alloc().buffer(0)));
                    return null;
                });
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }

    private static void sendHttpResponse(ChannelHandlerContext ctx, FullHttpRequest req, FullHttpResponse res) {
        // Generate an error page if response getStatus code is not OK (200).
        HttpResponseStatus responseStatus = res.status();
        if (responseStatus.code() != 200) {
            ByteBufUtil.writeUtf8(res.content(), responseStatus.toString());
            HttpUtil.setContentLength(res, res.content().readableBytes());
        }
        // Send the response and close the connection if necessary.
        boolean keepAlive = HttpUtil.isKeepAlive(req) && responseStatus.code() == 200;
        HttpUtil.setKeepAlive(res, keepAlive);
        ChannelFuture future = ctx.writeAndFlush(res);
        if (!keepAlive) {
            future.addListener(ChannelFutureListener.CLOSE);
        }
    }
}
