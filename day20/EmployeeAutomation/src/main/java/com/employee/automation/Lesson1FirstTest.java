package com.employee.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Lesson1FirstTest {
    public static void main(String[] args) {
        // Step 1: Set up ChromeDriver using WebDriverManager
        WebDriverManager.chromedriver().setup();

        // Step 2: Initialize ChromeDriver to open Google Chrome browser
        WebDriver driver = new ChromeDriver();

        try {
            // Step 3: Maximize the browser window
            driver.manage().window().maximize();

            // Step 4: Open the URL https://www.google.com
            driver.get("https://www.google.com");

            // Step 5: Get and print the title of the web page
            String pageTitle = driver.getTitle();
            System.out.println("----------------------------------------");
            System.out.println("Successfully opened the webpage!");
            System.out.println("The page title is: " + pageTitle);
            System.out.println("----------------------------------------");

        } catch (Exception e) {
            System.err.println("An error occurred during execution: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Step 6: Close the browser and terminate the WebDriver session
            driver.quit();
        }
    }
}
