package com.github.puregero.delaborio.util;

public class ServerTiming {

    private String timingName;
    private long startTime;

    private String pastResults = null;

    public ServerTiming(String timingName) {
        this.timingName = timingName;
        this.startTime = System.currentTimeMillis();
    }

    public void startNew(String newTimingName) {
        pastResults = this.toString();
        this.timingName = newTimingName;
        this.startTime = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        String thisResult = timingName + ";dur=" + (System.currentTimeMillis() - startTime);
        return (pastResults != null ? pastResults + ", " : "") + thisResult;
    }

}
