package com.employee.automation;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class TestHistoryLogger {

    private static final String LOG_FILE_PATH = "db.json";
    private static final String ROOT_LOG_FILE_PATH = "../db.json";
    
    // Tracks if history has been cleared in this JVM execution instance
    private static boolean clearedThisRun = false;

    public static class OperationEntry {
        private String timestamp;
        private String testCase;
        private String operation;
        private String details;
        private String status;

        public OperationEntry(String testCase, String operation, String details, String status) {
            this.timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            this.testCase = testCase;
            this.operation = operation;
            this.details = details;
            this.status = status;
        }

        public String getTimestamp() { return timestamp; }
        public String getTestCase() { return testCase; }
        public String getOperation() { return operation; }
        public String getDetails() { return details; }
        public String getStatus() { return status; }
    }

    /**
     * Log a new operation to db.json.
     * Automatically clears history once per JVM run before appending.
     */
    public static synchronized void logOperation(String testCase, String operation, String details, String status) {
        if (!clearedThisRun) {
            clearHistory();
        }
        
        List<OperationEntry> history = loadHistory(LOG_FILE_PATH);
        
        OperationEntry entry = new OperationEntry(testCase, operation, details, status);
        history.add(entry);

        saveHistory(history, LOG_FILE_PATH);
        saveHistory(history, ROOT_LOG_FILE_PATH);
        
        System.out.println("[OPERATION LOGGED] " + operation + " - Status: " + status + " - Details: " + details);
    }

    /**
     * Clear operations log history once per execution run.
     */
    public static synchronized void clearHistory() {
        if (clearedThisRun) {
            return;
        }
        List<OperationEntry> emptyList = new ArrayList<>();
        saveHistory(emptyList, LOG_FILE_PATH);
        saveHistory(emptyList, ROOT_LOG_FILE_PATH);
        clearedThisRun = true;
        System.out.println("[LOG HISTORY CLEARED FOR THIS TEST RUN]");
    }

    private static List<OperationEntry> loadHistory(String path) {
        File file = new File(path);
        if (!file.exists()) {
            return new ArrayList<>();
        }

        try (FileReader reader = new FileReader(file)) {
            Gson gson = new Gson();
            Type listType = new TypeToken<ArrayList<OperationEntry>>() {}.getType();
            List<OperationEntry> list = gson.fromJson(reader, listType);
            return list != null ? list : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Could not load history from " + path + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private static void saveHistory(List<OperationEntry> history, String path) {
        try {
            File file = new File(path);
            File parentDir = file.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }

            try (FileWriter writer = new FileWriter(file)) {
                Gson gson = new GsonBuilder().setPrettyPrinting().create();
                gson.toJson(history, writer);
            }
        } catch (Exception e) {
            System.err.println("Could not save history to " + path + ": " + e.getMessage());
        }
    }
}
