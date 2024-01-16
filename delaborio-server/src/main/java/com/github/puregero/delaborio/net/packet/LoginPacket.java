package com.github.puregero.delaborio.net.packet;

public record LoginPacket(String userid, String username, String avatar, String globalName, String accessToken) {

}
