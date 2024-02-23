package com.github.puregero.delaborio.database;

import com.google.gson.Gson;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public class S3PlayerDataStorage implements PlayerDataStorage {

    private final S3AsyncClient s3;
    private final Gson gson = new Gson();

    public S3PlayerDataStorage() {
        AwsCredentials credentials = AwsBasicCredentials.create(System.getenv("AWS_ACCESS_KEY_ID"), System.getenv("AWS_SECRET_ACCESS_KEY"));

        try {
            s3 = S3AsyncClient.builder()
                    .endpointOverride(new URL(System.getenv("AWS_S3_ENDPOINT")).toURI())
                    .region(Region.of("auto"))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();
        } catch (MalformedURLException | URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public CompletableFuture<PlayerData> getPlayerData(UUID uuid) {
        return s3.getObject(
                builder -> builder.bucket("delaborio").key(uuid + ".json").build(),
                AsyncResponseTransformer.toBytes()
        ).thenApply(
                response -> new String(response.asByteArray(), StandardCharsets.UTF_8)
        ).thenApply(
                response -> gson.fromJson(response, PlayerData.class)
        ).exceptionally(e -> {
            if (e.getCause() instanceof NoSuchKeyException) {
                return new PlayerData(uuid);
            }
            e.printStackTrace();
            return null;
        });
    }

    @Override
    public CompletableFuture<Void> putPlayerData(UUID uuid, PlayerData playerData) {
        return s3.putObject(
                builder -> builder.bucket("delaborio").key(uuid + ".json").contentType("application/json").contentEncoding("UTF-8").build(),
                AsyncRequestBody.fromBytes(gson.toJson(playerData).getBytes(StandardCharsets.UTF_8))
        ).thenRun(
                () -> {}
        ).exceptionally(e -> {
            e.printStackTrace();
            return null;
        });
    }

}
