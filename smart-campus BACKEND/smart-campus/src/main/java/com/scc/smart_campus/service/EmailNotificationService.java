
package com.scc.smart_campus.service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import java.io.File;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public void sendWelcomeEmail(String recipientEmail, String fullName) {
        try {
            // 1. Context mein data set karein (HTML variables ke liye)
            Context context = new Context();
            context.setVariable("name", fullName);

            // 2. HTML template ko string mein convert karein
            String processHtml = templateEngine.process("welcome-email", context);

            // 3. Email bhejien
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("sccmainframe.nagpur@gmail.com", "SCC SECURITY COUNCIL");
            helper.setTo(recipientEmail);
            helper.setSubject("Identity Verified: Welcome to SCC, " + fullName);
            helper.setText(processHtml, true); // True ka matlab HTML content hai

            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email Logic Failed: " + e.getMessage());
        }
    }

    public void sendCertificateIssuanceEmail(String recipientEmail, String studentName, String taskName, String certId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("SCC MAINFRAME: Task Certificate Issued");
        message.setText("Greetings " + studentName + ",\n\n" +
            "Your submission for [" + taskName + "] has been verified by the Founder.\n" +
            "Your Traceable Certificate is now available in your Archive.\n\n" +
            "Certificate ID: " + certId + "\n" +
            "Access your Identity Node to download.\n\n" +
            "Regards,\n" +
            "SCC Executive Council");

        mailSender.send(message);
    }
    private final ConcurrentHashMap<String, String> otpCache = new ConcurrentHashMap<>();

public void sendPartnerOTP(String recipientEmail) {
    String otp = String.format("%06d", new Random().nextInt(999999));
    otpCache.put(recipientEmail, otp);

    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        // Yeh line Partner ke inbox mein aapka naam professional dikhayegi
        helper.setFrom("sccmainframe.nagpur@gmail.com", "SCC SECURITY COUNCIL"); 
        helper.setTo(recipientEmail);
        helper.setSubject("SCC MAINFRAME: Partner Access Code");
        helper.setText("Your authorization code is: " + otp);

        mailSender.send(message);
    } catch (Exception e) {
        e.printStackTrace();
    }
}

public boolean verifyOTP(String email, String userEnteredCode) {
    // 4. Compare the user's input with the stored code
    return userEnteredCode.equals(otpCache.get(email));
}
public void sendPartnerApprovalEmail(String email, String companyName) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("SCC MAINFRAME: Access Authorized");
    message.setText("Congratulations " + companyName + ",\n\n" +
        "Your organization has been verified by the SCC Executive Council.\n" +
        "You now have full access to the Conclave Talent Pool.\n\n" +
        "Access Link: http://localhost:5503/conclave.html\n\n" +
        "Regards,\n" +
        "SCC Mainframe Admin");
    mailSender.send(message);
}
public void sendPartnerRejectionEmail(String email, String companyName) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("SCC MAINFRAME: Application Update");
    message.setText("Hello " + companyName + ",\n\n" +
        "Thank you for your interest in the SCC Partner Network.\n" +
        "At this time, we are unable to authorize your access to the Conclave node.\n" +
        "This may be due to incomplete corporate verification.\n\n" +
        "Regards,\n" +
        "SCC Executive Council");
    mailSender.send(message);
}
public void sendJobApplication(String partnerEmail, String studentName, int studentXp, String resumePath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // 'true' enables multipart mode for attachments
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(partnerEmail);
            helper.setSubject("SCC MAINFRAME: Talent Application - " + studentName);
            helper.setText("A verified student has applied via the SCC Conclave.\n\n" +
                           "Name: " + studentName + "\n" +
                           "Verified XP: " + studentXp + "\n\n" +
                           "The resume is attached below.");

            File file = new File(resumePath);
            if (file.exists()) {
                helper.addAttachment("Resume_" + studentName.replace(" ", "_") + ".pdf", file);
            }

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        }
    }
public void sendAutoMatchAlert(String studentName, String matchedSkill, int xp) {
    SimpleMailMessage message = new SimpleMailMessage();
    // Use your own email here to receive the alert
    message.setTo("founder@scc.com"); 
    message.setSubject("🔥 MAINFRAME ALERT: High-Demand Talent Match");
    message.setText("EXECUTIVE ALERT: Market Demand Synchronized.\n\n" +
        "A student matching recent Partner search trends has just updated their node.\n\n" +
        "Student Name: " + studentName + "\n" +
        "Matched Skill: " + matchedSkill.toUpperCase() + "\n" +
        "Current XP: " + xp + "\n\n" +
        "ACTION REQUIRED: Review the Conclave to facilitate this connection.\n\n" +
        "Regards,\n" +
        "SCC Intelligence Unit");

    mailSender.send(message);
}
// Is naye method ko apne service mein add karein
public void sendOTP(String recipientEmail, String otp) {
    otpCache.put(recipientEmail, otp);
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setFrom("sccmainframe.nagpur@gmail.com", "SCC SECURITY COUNCIL"); 
        helper.setTo(recipientEmail);
        helper.setSubject("SCC MAINFRAME: Node Verification Code");
        helper.setText("Your security access code for registration is: " + otp + 
                        "\n\nThis code is valid for 5 minutes.");

        mailSender.send(message);
    } catch (Exception e) {
        throw new RuntimeException("OTP transmission failed: " + e.getMessage());
    }
}

}