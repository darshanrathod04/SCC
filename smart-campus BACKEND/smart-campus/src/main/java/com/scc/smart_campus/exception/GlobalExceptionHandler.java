package com.scc.smart_campus.exception;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles Field-Level Validation Failures (e.g., @NotBlank, @Email).
     * Maps to the professional Tailwind forms for real-time error display.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Protocol Failed");
        response.put("details", fieldErrors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles Entity-Not-Found scenarios (e.g., searching for a non-existent student ID).
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleGenericRuntime(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.NOT_FOUND.value());
        response.put("message", ex.getMessage());
        response.put("protocol", "Identity/Resource Resolution Failed");

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Catch-all for internal system failures.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "System Kernel Panic");
        response.put("message", "An unexpected internal error occurred.");

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @PostMapping("/api/admin/signature/upload")
public ResponseEntity<?> uploadSignature(@RequestParam("image") MultipartFile file) throws IOException {
    // Logic is now streamlined; if this fails, handleAllExceptions catches it
    String uploadDir = "src/main/resources/static/images/";
    Path path = Paths.get(uploadDir + "signature.png");
    
    Files.write(path, file.getBytes());
    
    return ResponseEntity.ok().body(Map.of("status", "success", "protocol", "SIGNATURE_SYNCED"));
}
}