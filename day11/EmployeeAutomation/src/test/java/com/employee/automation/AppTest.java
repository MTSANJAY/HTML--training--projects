package com.employee.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Test;
import org.junit.BeforeClass;
import org.junit.AfterClass;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.io.File;
import java.net.Socket;
import java.time.Duration;

import static org.junit.Assert.*;

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
    public void testEmployeeManagement() throws InterruptedException {
        // Setup ChromeDriver automatically
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-extensions");

        // Launch Chrome
        WebDriver driver = new ChromeDriver(options);
        
        // Setup WebDriverWait with 2 seconds timeout
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));

        // Open your React application
        driver.get("http://localhost:5173");
        TestHistoryLogger.logOperation("EmployeeManagementBasicTest", "Navigate to Homepage", "Opened React app homepage successfully", "SUCCESS");

        // Log in as admin
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("email")));
        WebElement passwordField = driver.findElement(By.name("password"));
        WebElement loginBtn = driver.findElement(By.className("login-submit-btn"));

        emailField.sendKeys("admin@admin.com");
        passwordField.sendKeys("admin123");
        loginBtn.click();
        
        // Wait for navbar logo or main form to verify login
        WebElement logo = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'logo') and contains(text(), 'Employee')]")
        ));
        assertNotNull("Navbar logo not found, login failed", logo);
        TestHistoryLogger.logOperation("EmployeeManagementBasicTest", "Admin Login", "Logged in as admin@admin.com", "SUCCESS");

        // Define employee test data
        String uniqueId = String.valueOf(System.currentTimeMillis()).substring(8);
        String employeeName = "Build Tester " + uniqueId;
        String position = "Build Automation Specialist";
        String department = "IT";
        String email = "build.tester" + uniqueId + "@example.com";
        String phone = "123456" + uniqueId;
        String salary = "99000";

        // Add New Employee
        WebElement nameInput = driver.findElement(By.name("name"));
        WebElement positionInput = driver.findElement(By.name("position"));
        Select departmentSelect = new Select(driver.findElement(By.name("department")));
        WebElement emailInput = driver.findElement(By.name("email"));
        WebElement phoneInput = driver.findElement(By.name("phone"));
        WebElement salaryInput = driver.findElement(By.name("salary"));
        WebElement submitButton = driver.findElement(By.className("submit-btn"));

        nameInput.sendKeys(employeeName);
        positionInput.sendKeys(position);
        departmentSelect.selectByVisibleText(department);
        emailInput.sendKeys(email);
        phoneInput.sendKeys(phone);
        salaryInput.sendKeys(salary);

        submitButton.click();
        
        // Wait for 2 seconds and log operation completion
        Thread.sleep(2000);
        TestHistoryLogger.logOperation("EmployeeManagementBasicTest", "Add Employee", "Added employee: " + employeeName + " (" + department + ")", "SUCCESS");

        // Close browser
        driver.quit();
        TestHistoryLogger.logOperation("EmployeeManagementBasicTest", "Close Browser", "Selenium test finished and browser closed", "SUCCESS");
    }
}