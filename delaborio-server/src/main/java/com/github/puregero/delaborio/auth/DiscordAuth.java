package com.github.puregero.delaborio.auth;

import com.google.gson.Gson;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class DiscordAuth {
    private static final Gson gson = new Gson();

    public static CompletableFuture<AuthResponse> auth(String accessToken) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://discord.com/api/users/@me"))
                .header("authorization", "Bearer " + accessToken)
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(response -> gson.fromJson(response, DiscordAuthResponse.class))
                .thenApply(DiscordAuthResponse::toAuthResponse);
    }

    public record DiscordAuthResponse(String id, String username, String avatar, String global_name) {

        public AuthResponse toAuthResponse() {
            if (id == null) {
                // Authentication failed
                return null;
            }

            return new AuthResponse(
                    AuthResponse.uuidFromId("discord", id),
                    username,
                    global_name,
                    "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png"
            );
        }

    }
}
