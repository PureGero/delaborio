package com.github.puregero.delaborio.net;

import com.github.puregero.delaborio.DelaborioServer;
import com.github.puregero.delaborio.entity.Player;
import com.github.puregero.delaborio.net.packet.ChatPacket;
import com.github.puregero.delaborio.net.packet.LoginPacket;
import com.github.puregero.delaborio.websocket.WebSocketIndexPageHandler;
import com.google.gson.Gson;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

public class Connection extends SimpleChannelInboundHandler<WebSocketFrame> {

    private final DelaborioServer server;
    private final SocketChannel channel;
    private final Gson gson = new Gson();
    private Player player = null;

    public Connection(DelaborioServer server, SocketChannel channel) {
        this.server = server;
        this.channel = channel;
    }

    public void sendPacket(Object packet) {
        channel.writeAndFlush(new TextWebSocketFrame(packet.getClass().getSimpleName() + "\n" + gson.toJson(packet)));
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        // ping and pong frames already handled

        if (frame instanceof TextWebSocketFrame textWebSocketFrame) {
            String request = textWebSocketFrame.text();
            handleFrame(ctx, request);
        } else {
            String message = "unsupported frame type: " + frame.getClass().getName();
            throw new UnsupportedOperationException(message);
        }
    }

    private void handleFrame(ChannelHandlerContext ctx, String body) throws ClassNotFoundException {
        String type = body.substring(0, body.indexOf('\n'));
        String json = body.substring(body.indexOf('\n') + 1);

        Object packet = gson.fromJson(json, Class.forName(ChatPacket.class.getPackageName() + "." + type));

        if (packet instanceof LoginPacket loginPacket) {
            if (player != null) {
                throw new IllegalStateException("Player already logged in");
            }

            System.out.println("Player " + loginPacket.globalName() + " has logged in!");
            player = new Player(this, loginPacket.globalName());
            server.getPlayerManager().addPlayer(player);
        } else if (packet instanceof ChatPacket chatPacket) {
            System.out.println(player.getName() + ": " + chatPacket.message());
            server.getPlayerManager().broadcastMessage(player.getName() + ": " + chatPacket.message());
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        server.getPlayerManager().removePlayer(player);
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof WebSocketServerProtocolHandler.HandshakeComplete) {
            //Channel upgrade to websocket, remove WebSocketIndexPageHandler.
            ctx.pipeline().remove(WebSocketIndexPageHandler.class);
        } else {
            super.userEventTriggered(ctx, evt);
        }
    }
}