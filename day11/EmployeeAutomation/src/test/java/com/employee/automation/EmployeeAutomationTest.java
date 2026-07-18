package com.employee.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.BeforeClass;
import org.junit.AfterClass;
import org.openqa.selenium.Alert;
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
import java.util.List;

import static org.junit.Assert.*;

public class EmployeeAutomationTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = "http://localhost:5173";
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

    @Before
    public void setUp() {
        // Setup Chrome Driver using WebDriverManager
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-extensions");
        // Headless mode option - uncomment if running in headless environment:
        // options.addArguments("--headless=new");
        // options.addArguments("--disable-gpu");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @After
    public void tearDown() {
        if (driver != null) {
            try {
                System.out.println("==================================================");
                System.out.println("DIAGNOSTIC: Page Source on TearDown:");
                System.out.println(driver.getPageSource());
                System.out.println("==================================================");
            } catch (Exception e) {
                System.err.println("Could not print page source: " + e.getMessage());
            }
            driver.quit();
        }
    }

    @Test
    public void testEmployeeCRUDAndSearchFlow() throws InterruptedException {
        // 1. Navigate to the App
        driver.get(BASE_URL);

        // Verify login page loaded successfully
        WebElement loginHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        assertNotNull("Login page header not found", loginHeader);
        System.out.println("Step 0: Login page loaded successfully.");
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Navigate to Login Page", "Loaded login page successfully", "SUCCESS");

        // Fill credentials and log in
        WebElement emailField = driver.findElement(By.name("email"));
        WebElement passwordField = driver.findElement(By.name("password"));
        WebElement loginBtn = driver.findElement(By.className("login-submit-btn"));

        emailField.sendKeys("admin@admin.com");
        passwordField.sendKeys("admin123");
        loginBtn.click();

        // Verify page loaded successfully by checking the navbar logo
        WebElement logo = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'logo') and contains(text(), 'Employee')]")
        ));
        assertNotNull("Navbar logo not found, app may not be running", logo);
        System.out.println("Step 1: Logged in and navigated to Employee Manager successfully.");
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Admin Login", "Logged in as admin@admin.com", "SUCCESS");

        // Define test data with unique timestamp
        String uniqueId = String.valueOf(System.currentTimeMillis()).substring(8);
        String employeeName = "Auto Tester " + uniqueId;
        String position = "QA Automation Engineer";
        String department = "IT";
        String email = "auto.tester" + uniqueId + "@example.com";
        String phone = "987654" + uniqueId;
        String salary = "95000";

        // 2. Add New Employee
        System.out.println("Step 2: Adding employee: " + employeeName);
        
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

        // 3. Verify Employee Card is Added
        System.out.println("Step 3: Verifying employee card added...");
        
        // Wait for the card with the employee name to appear
        WebElement employeeCard = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + employeeName + "']]")
        ));
        assertNotNull("Employee card was not found in the grid after submission", employeeCard);
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Add Employee", "Added employee: " + employeeName + " (IT, QA Automation Engineer)", "SUCCESS");

        // Verify other details on the card
        String cardPosition = employeeCard.findElement(By.tagName("h4")).getText();
        assertEquals("Position on card mismatch", position, cardPosition);

        String cardDetails = employeeCard.findElement(By.className("info")).getText();
        assertTrue("Department mismatch on card", cardDetails.contains(department));
        assertTrue("Email mismatch on card", cardDetails.contains(email));
        assertTrue("Phone mismatch on card", cardDetails.contains(phone));
        // Note: Salary is formatted with commas (e.g., 95,000)
        assertTrue("Salary mismatch on card", cardDetails.contains("95,000") || cardDetails.contains(salary));

        // 4. Test Search Bar functionality
        System.out.println("Step 4: Testing search functionality...");
        WebElement searchInput = driver.findElement(By.xpath("//div[contains(@class, 'search-box')]/input"));
        
        // Search for the unique name -> card should still be visible
        searchInput.clear();
        searchInput.sendKeys(employeeName);
        Thread.sleep(1000); // Wait for filtering animation/effect
        
        List<WebElement> matchingCards = driver.findElements(By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + employeeName + "']]"));
        assertEquals("Should find exactly 1 matching card for search", 1, matchingCards.size());
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Search Employee", "Searched and found matching card for: " + employeeName, "SUCCESS");

        // Search for a non-existent employee -> card should disappear
        searchInput.clear();
        searchInput.sendKeys("NonExistentNameXYZ123");
        Thread.sleep(1000);
        
        List<WebElement> nonMatchingCards = driver.findElements(By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + employeeName + "']]"));
        assertEquals("Card should not be visible when searching non-matching text", 0, nonMatchingCards.size());
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Search Non-Existent Employee", "Confirmed card is hidden for query: NonExistentNameXYZ123", "SUCCESS");

        // Clear search
        searchInput.sendKeys(Keys.CONTROL + "a");
        searchInput.sendKeys(Keys.BACK_SPACE);
        Thread.sleep(1000);

        // 5. Edit Employee Details
        System.out.println("Step 5: Editing employee...");
        
        // Locate employee card again
        employeeCard = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + employeeName + "']]")
        ));
        WebElement editBtn = employeeCard.findElement(By.className("edit-btn"));
        editBtn.click();

        // Verify form changed to Edit mode
        WebElement formHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//form[contains(@class, 'employee-form')]/h2")
        ));
        assertEquals("Form title did not change to Edit Employee", "Edit Employee", formHeader.getText());

        // Update inputs
        String updatedName = employeeName + " (Updated)";
        String updatedSalary = "120000";
        String updatedPosition = "Lead E2E Engineer";
        
        nameInput = driver.findElement(By.name("name"));
        nameInput.sendKeys(Keys.CONTROL + "a");
        nameInput.sendKeys(Keys.BACK_SPACE);
        nameInput.sendKeys(updatedName);

        positionInput = driver.findElement(By.name("position"));
        positionInput.sendKeys(Keys.CONTROL + "a");
        positionInput.sendKeys(Keys.BACK_SPACE);
        positionInput.sendKeys(updatedPosition);

        Select updatedDepartmentSelect = new Select(driver.findElement(By.name("department")));
        updatedDepartmentSelect.selectByVisibleText("Finance");

        salaryInput = driver.findElement(By.name("salary"));
        salaryInput.sendKeys(Keys.CONTROL + "a");
        salaryInput.sendKeys(Keys.BACK_SPACE);
        salaryInput.sendKeys(updatedSalary);

        // Submit the update
        WebElement updateBtn = driver.findElement(By.className("submit-btn"));
        assertEquals("Submit button text should update to Update Employee", "Update Employee", updateBtn.getText());
        updateBtn.click();

        // Verify the card was updated
        WebElement updatedCard = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + updatedName + "']]")
        ));
        assertNotNull("Updated employee card was not found", updatedCard);
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Edit Employee", "Edited employee details. New Name: " + updatedName + ", Dept: Finance, Pos: Lead E2E Engineer", "SUCCESS");
        
        String updatedCardPosition = updatedCard.findElement(By.tagName("h4")).getText();
        assertEquals("Updated position on card mismatch", updatedPosition, updatedCardPosition);

        String updatedCardDetails = updatedCard.findElement(By.className("info")).getText();
        assertTrue("Updated department mismatch on card", updatedCardDetails.contains("Finance"));
        assertTrue("Updated salary mismatch on card", updatedCardDetails.contains("120,000") || updatedCardDetails.contains(updatedSalary));

        // 6. Delete Employee
        System.out.println("Step 6: Deleting employee...");
        WebElement deleteBtn = updatedCard.findElement(By.className("delete-btn"));
        deleteBtn.click();

        // Handle alert pop-up
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        assertEquals("Alert text mismatch", "Are you sure you want to delete this employee?", alert.getText());
        alert.accept();

        // Wait and verify employee card is removed
        boolean isRemoved = wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'employee-card') and h2[text()='" + updatedName + "']]")
        ));
        assertTrue("Employee card was not deleted from screen", isRemoved);
        TestHistoryLogger.logOperation("EmployeeCRUDAndSearchFlow", "Delete Employee", "Deleted employee: " + updatedName, "SUCCESS");
        System.out.println("E2E Automation test completed successfully!");
    }

    @Test
    public void testEmployeeLoginAndProfileFlow() throws InterruptedException {
        // 1. Navigate to the App
        driver.get(BASE_URL);

        // Verify login page loaded successfully
        WebElement loginHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        assertNotNull("Login page header not found", loginHeader);
        System.out.println("Step 0: Login page loaded successfully.");
        TestHistoryLogger.logOperation("EmployeeLoginAndProfileFlow", "Navigate to Login Page", "Loaded login page successfully", "SUCCESS");

        // 2. Switch to Employee Login
        WebElement employeeTab = driver.findElement(By.xpath("//button[contains(@class, 'tab-btn') and text()='Employee Login']"));
        employeeTab.click();
        Thread.sleep(500);

        // 3. Fill Employee Email (using ram kumar's email) and Password and log in
        WebElement emailField = driver.findElement(By.name("email"));
        emailField.clear();
        emailField.sendKeys("720823108011@hit.edu.in");

        WebElement passwordField = driver.findElement(By.name("password"));
        passwordField.clear();
        passwordField.sendKeys("employee123");

        WebElement loginBtn = driver.findElement(By.className("login-submit-btn"));
        loginBtn.click();

        // 4. Verify employee profile view is shown
        WebElement profileName = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'profile-card-large')]//h2[text()='ram kumar']")
        ));
        assertNotNull("Employee Profile name 'ram kumar' not displayed", profileName);
        System.out.println("Step 1: Logged in successfully as Employee.");
        TestHistoryLogger.logOperation("EmployeeLoginAndProfileFlow", "Employee Login", "Logged in as ram kumar (720823108011@hit.edu.in)", "SUCCESS");

        // Verify other profile details
        WebElement profileRole = driver.findElement(By.className("profile-role"));
        assertEquals("developer", profileRole.getText());

        // 5. Test editing contact info
        WebElement editBtn = driver.findElement(By.className("profile-edit-btn"));
        editBtn.click();

        WebElement phoneInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//form[contains(@class, 'profile-edit-form')]//input[@type='text']")
        ));
        phoneInput.sendKeys(Keys.CONTROL + "a");
        phoneInput.sendKeys(Keys.BACK_SPACE);
        phoneInput.sendKeys("4538376469");

        WebElement saveBtn = driver.findElement(By.className("save-btn"));
        saveBtn.click();

        // Verify updated contact info
        WebElement updatedPhone = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'detail-item')]/span[text()='4538376469']")
        ));
        assertNotNull("Updated phone number not displayed", updatedPhone);
        System.out.println("Step 2: Employee contact details updated successfully.");
        TestHistoryLogger.logOperation("EmployeeLoginAndProfileFlow", "Update Employee Profile", "Updated contact phone number to 4538376469", "SUCCESS");

        // 6. Logout
        WebElement logoutBtn = driver.findElement(By.className("logout-btn"));
        logoutBtn.click();

        // Verify back on login page
        WebElement loginHeaderAfterLogout = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        assertNotNull("Not redirected to Login page after logout", loginHeaderAfterLogout);
        System.out.println("Step 3: Logged out successfully.");
        TestHistoryLogger.logOperation("EmployeeLoginAndProfileFlow", "Employee Logout", "Logged out from employee account", "SUCCESS");
    }

    @Test
    public void testLeaveRequestWorkflow() throws InterruptedException {
        // 1. Navigate to the App
        driver.get(BASE_URL);

        // Verify login page loaded successfully
        WebElement loginHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        assertNotNull("Login page header not found", loginHeader);
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Navigate to Login Page", "Loaded login page successfully", "SUCCESS");

        // 2. Log in as Employee
        WebElement employeeTab = driver.findElement(By.xpath("//button[contains(@class, 'tab-btn') and text()='Employee Login']"));
        employeeTab.click();
        Thread.sleep(500);

        WebElement emailField = driver.findElement(By.name("email"));
        emailField.clear();
        emailField.sendKeys("720823108011@hit.edu.in");

        WebElement passwordField = driver.findElement(By.name("password"));
        passwordField.clear();
        passwordField.sendKeys("employee123");

        WebElement loginBtn = driver.findElement(By.className("login-submit-btn"));
        loginBtn.click();

        // Verify profile loaded
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'profile-card-large')]//h2[text()='ram kumar']")
        ));
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Employee Login", "Logged in as ram kumar (720823108011@hit.edu.in)", "SUCCESS");

        // 3. Navigate to My Leaves tab
        WebElement leavesTab = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(@class, 'tab-navigation')]/button[text()='My Leaves']")
        ));
        leavesTab.click();
        Thread.sleep(500);

        // 4. Fill and Submit Leave Request form
        Select typeSelect = new Select(driver.findElement(By.xpath("//form[contains(@class, 'leave-form-fields')]//select")));
        typeSelect.selectByVisibleText("Casual Leave");

        // Set dates using JavascriptExecutor to bypass local Chrome datepicker issues
        WebElement startInput = driver.findElement(By.xpath("(//input[@type='date'])[1]"));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "arguments[0].value='2026-07-20'; arguments[0].dispatchEvent(new Event('change'))", startInput
        );

        WebElement endInput = driver.findElement(By.xpath("(//input[@type='date'])[2]"));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "arguments[0].value='2026-07-22'; arguments[0].dispatchEvent(new Event('change'))", endInput
        );

        WebElement reasonInput = driver.findElement(By.xpath("//form[contains(@class, 'leave-form-fields')]//textarea"));
        reasonInput.sendKeys("Family Function");

        WebElement submitLeaveBtn = driver.findElement(By.xpath("//form[contains(@class, 'leave-form-fields')]//button[@type='submit']"));
        submitLeaveBtn.click();

        // 5. Verify request is listed in Employee Leaves Table with Pending status
        WebElement pendingBadge = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//table[contains(@class, 'leave-table')]/tbody/tr[td[text()='Casual Leave']]//span[contains(@class, 'status-badge') and text()='Pending']")
        ));
        assertNotNull("New leave request status not shown as Pending", pendingBadge);
        System.out.println("Step 1: Applied for leave successfully. Status is Pending.");
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Apply Leave Request", "Applied for Casual Leave from 2026-07-20 to 2026-07-22. Reason: Family Function", "SUCCESS");

        // Logout
        WebElement logoutBtn = driver.findElement(By.className("logout-btn"));
        logoutBtn.click();
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Employee Logout", "Logged out from employee account", "SUCCESS");

        // 6. Log in as Admin
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        WebElement emailFieldAdmin = driver.findElement(By.name("email"));
        WebElement passwordFieldAdmin = driver.findElement(By.name("password"));
        WebElement loginBtnAdmin = driver.findElement(By.className("login-submit-btn"));

        emailFieldAdmin.sendKeys("admin@admin.com");
        passwordFieldAdmin.sendKeys("admin123");
        loginBtnAdmin.click();
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Admin Login", "Logged in as admin@admin.com", "SUCCESS");

        // 7. Go to Leave Requests tab
        WebElement adminLeavesTab = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(@class, 'tab-navigation')]/button[text()='Leave Requests']")
        ));
        adminLeavesTab.click();
        Thread.sleep(500);

        // 8. Approve the pending request
        WebElement approveBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//table[contains(@class, 'leave-table')]/tbody/tr[td[contains(text(), 'Casual Leave')] and td/span[text()='Pending']]//button[contains(@class, 'approve-action-btn')]")
        ));
        approveBtn.click();

        // Submit the approval comment
        WebElement confirmBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//form[contains(@class, 'review-inline-form')]//button[@type='submit']")
        ));
        confirmBtn.click();

        // Verify status updates to Approved
        WebElement approvedBadgeAdmin = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//table[contains(@class, 'leave-table')]/tbody/tr[td[contains(text(), 'Casual Leave')]]//span[contains(@class, 'status-badge') and text()='Approved']")
        ));
        assertNotNull("Status not updated to Approved in admin list", approvedBadgeAdmin);
        System.out.println("Step 2: Admin successfully approved the leave request.");
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Admin Approve Leave", "Approved Casual Leave request for ram kumar", "SUCCESS");

        // Logout
        WebElement logoutBtnAdmin = driver.findElement(By.className("logout-btn"));
        logoutBtnAdmin.click();
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Admin Logout", "Logged out from admin account", "SUCCESS");

        // 9. Log back in as Employee and check status
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'login-header')]/h2[contains(text(), 'Employee')]")
        ));
        WebElement employeeTabBack = driver.findElement(By.xpath("//button[contains(@class, 'tab-btn') and text()='Employee Login']"));
        employeeTabBack.click();
        Thread.sleep(500);

        WebElement emailFieldBack = driver.findElement(By.name("email"));
        emailFieldBack.clear();
        emailFieldBack.sendKeys("720823108011@hit.edu.in");

        WebElement passwordFieldBack = driver.findElement(By.name("password"));
        passwordFieldBack.clear();
        passwordFieldBack.sendKeys("employee123");

        WebElement loginBtnBack = driver.findElement(By.className("login-submit-btn"));
        loginBtnBack.click();
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Employee Login", "Logged in as ram kumar (720823108011@hit.edu.in) to verify status", "SUCCESS");

        // Go to My Leaves tab
        WebElement employeeLeavesTab = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//div[contains(@class, 'tab-navigation')]/button[text()='My Leaves']")
        ));
        employeeLeavesTab.click();
        Thread.sleep(500);

        // Verify the leave request status is now Approved and shows approval comments
        WebElement finalApprovedBadge = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//table[contains(@class, 'leave-table')]/tbody/tr[td[text()='Casual Leave']]//span[contains(@class, 'status-badge') and text()='Approved']")
        ));
        assertNotNull("Leave request not shown as Approved on employee side", finalApprovedBadge);

        WebElement approvalComments = driver.findElement(By.xpath("//table[contains(@class, 'leave-table')]/tbody/tr[td[text()='Casual Leave']]//p[contains(@class, 'mgr-comment')]"));
        assertTrue("Approval comments mismatch", approvalComments.getText().contains("Approved to build automation testing"));
        System.out.println("Step 3: Employee verified leave request is Approved with correct comments.");
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Verify Leave Status", "Verified leave request is Approved with comment: 'Approved to build automation testing'", "SUCCESS");

        // Logout
        WebElement logoutBtnFinal = driver.findElement(By.className("logout-btn"));
        logoutBtnFinal.click();
        TestHistoryLogger.logOperation("LeaveRequestWorkflow", "Employee Logout", "Logged out from employee account (final)", "SUCCESS");
    }
}
