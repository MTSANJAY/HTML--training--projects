package com.employee.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Test;
import org.junit.BeforeClass;
import org.junit.AfterClass;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import java.io.File;
import java.net.Socket;

public class AppTest {

    private static Process frontendProcess;

    @BeforeClass
    public static void startFrontendServer() {
        if (isServerRunning()) {
            System.out.println("Frontend server is already running on port 5173.");
            return;
        }
        System.out.println("Starting frontend server automatically...");
        try {
            File reactDir = new File("../EmployeeManager/react-employeemanagement");
            ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", "npm run dev");
            pb.directory(reactDir);
            pb.redirectErrorStream(true);
            
            File logFile = new File("target/frontend_server_log.txt");
            logFile.getParentFile().mkdirs();
            pb.redirectOutput(ProcessBuilder.Redirect.to(logFile));
            
            frontendProcess = pb.start();
            
            // Wait for port 5173 to be open
            long start = System.currentTimeMillis();
            boolean started = false;
            while (System.currentTimeMillis() - start < 15000) {
                if (isServerRunning()) {
                    started = true;
                    break;
                }
                Thread.sleep(500);
            }
            if (started) {
                System.out.println("Frontend server started successfully on port 5173!");
            } else {
                System.err.println("Warning: Frontend server did not start within 15 seconds. Test might fail.");
            }
        } catch (Exception e) {
            System.err.println("Failed to start frontend server: " + e.getMessage());
        }
    }

    @AfterClass
    public static void stopFrontendServer() {
        if (frontendProcess != null && frontendProcess.isAlive()) {
            System.out.println("Stopping frontend server...");
            try {
                Runtime.getRuntime().exec("taskkill /F /T /PID " + frontendProcess.pid()).waitFor();
            } catch (Exception e) {
                frontendProcess.destroyForcibly();
            }
        }
    }

    private static boolean isServerRunning() {
        try (Socket socket = new Socket("localhost", 5173)) {
            return true;
        } catch (java.io.IOException e) {
            return false;
        }
    }

    @Test
    public void testEmployeeManagement() {
        // Setup ChromeDriver automatically
        WebDriverManager.chromedriver().setup();

        // Launch Chrome
        WebDriver driver = new ChromeDriver();

        // Maximize window
        driver.manage().window().maximize();

        // Open your React application
        driver.get("http://localhost:5173");

        // Print page title
        System.out.println("Title: " + driver.getTitle());

        // Wait for 5 seconds
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Close browser
        driver.quit();
    }
}