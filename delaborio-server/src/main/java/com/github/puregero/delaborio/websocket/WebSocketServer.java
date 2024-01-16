package com.github.puregero.delaborio.websocket;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.epoll.Epoll;
import io.netty.channel.epoll.EpollEventLoopGroup;
import io.netty.channel.epoll.EpollServerSocketChannel;
import io.netty.channel.epoll.EpollSocketChannel;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.ServerSocketChannel;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.SelfSignedCertificate;
import io.netty.util.concurrent.DefaultThreadFactory;
import io.netty.util.concurrent.ThreadPerTaskExecutor;

import javax.net.ssl.SSLException;
import java.security.cert.CertificateException;
import java.util.concurrent.Executor;

public class WebSocketServer {

    protected EventLoopGroup eventLoopGroup;
    protected Class<? extends SocketChannel> socketChannelClass;
    protected Class<? extends ServerSocketChannel> serverSocketChannelClass;
    protected Executor eventLoopThreadFactory = new ThreadPerTaskExecutor(new DefaultThreadFactory(threadName(), daemon()));

    public SslContext createSslContext() throws CertificateException, SSLException {
        SelfSignedCertificate cert = new SelfSignedCertificate();
        return SslContextBuilder.forServer(cert.certificate(), cert.privateKey()).build();
    }

    public EventLoopGroup getEventLoopGroup() {
        if (eventLoopGroup == null) {
            if (Epoll.isAvailable()) {
                eventLoopGroup = new EpollEventLoopGroup(threadCount(), eventLoopThreadFactory);
                socketChannelClass = EpollSocketChannel.class;
                serverSocketChannelClass = EpollServerSocketChannel.class;
            } else {
                eventLoopGroup = new NioEventLoopGroup(threadCount(), eventLoopThreadFactory);
                socketChannelClass = NioSocketChannel.class;
                serverSocketChannelClass = NioServerSocketChannel.class;
            }
        }
        return eventLoopGroup;
    }

    protected ServerBootstrap createServerBootstrap(SslContext sslCtx) {
        return new ServerBootstrap()
                .group(getEventLoopGroup())
                .channel(serverSocketChannelClass)
                .childHandler(new WebSocketServerInitializer(sslCtx))
                .childOption(ChannelOption.SO_KEEPALIVE, true);
    }

    public ChannelFuture listenOn(SslContext sslContext, String address, int port) {
        return createServerBootstrap(sslContext).bind(address, port);
    }

    public ChannelFuture listenOn(SslContext sslContext, int port) {
        return createServerBootstrap(sslContext).bind(port);
    }

    public ChannelFuture listenOn(String address, int port) {
        return listenOn(null, address, port);
    }

    public ChannelFuture listenOn(int port) {
        return listenOn((SslContext) null, port);
    }


    protected int threadCount() {
        return Integer.getInteger("netty.threads", 0);
    }

    protected boolean daemon() {
        return true;
    }

    protected String threadName() {
        return "netty-ws";
    }
}
