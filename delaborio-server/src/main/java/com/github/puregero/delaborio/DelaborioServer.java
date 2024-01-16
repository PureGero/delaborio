package com.github.puregero.delaborio;

import com.github.puregero.delaborio.websocket.WebSocketServer;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;

public class DelaborioServer {
    private static final int PORT = Integer.parseInt(System.getProperty("port", "2052"));
    private static final int SSL_PORT = Integer.parseInt(System.getProperty("sslport", "2053"));

    private final PlayerManager playerManager = new PlayerManager();

    public static void main(String[] args) throws Exception {
        DelaborioServer server = new DelaborioServer();
        WebSocketServer webSocketServer = new WebSocketServer(server);

        try {
            ChannelFuture futuressl = webSocketServer.listenOn(webSocketServer.createSslContext(), SSL_PORT);
            ChannelFuture future = webSocketServer.listenOn(PORT);
            Channel chssl = futuressl.sync().channel();
            Channel ch = future.sync().channel();

            System.out.println("Listening on port " + PORT + " and SSL port " + SSL_PORT);

            chssl.closeFuture().sync();
            ch.closeFuture().sync();
        } finally {
            webSocketServer.getEventLoopGroup().shutdownGracefully();
        }
    }

    public PlayerManager getPlayerManager() {
        return playerManager;
    }
}
