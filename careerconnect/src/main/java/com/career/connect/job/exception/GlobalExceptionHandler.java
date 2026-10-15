package com.career.connect.job.exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.career.connect.application.ApplicationNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	private static final Logger logger =
	        LoggerFactory.getLogger(GlobalExceptionHandler.class);
	
	
	 @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<Map<String, String>> handleValidationErrors(
	            MethodArgumentNotValidException ex) {

	        Map<String, String> errors = new HashMap<>();

	        ex.getBindingResult().getFieldErrors().forEach(error ->
	                errors.put(error.getField(), error.getDefaultMessage())
	        );

	        return ResponseEntity
	                .status(HttpStatus.BAD_REQUEST)
	                .body(errors);
	    }
	 
	 
	 

		@ExceptionHandler(HttpMessageNotReadableException.class)
		public ResponseEntity<Map<String, String>> handleInvalidJson(
		        HttpMessageNotReadableException ex) {
		
		    Map<String, String> error = new HashMap<>();
		    error.put("message", "Invalid or malformed JSON request.");
		
		    return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body(error);
		}

		@ExceptionHandler(JobNotFoundException.class)
		public ResponseEntity<Map<String, String>> handleJobNotFound(
		        JobNotFoundException ex) {

		    Map<String, String> error = new HashMap<>();
		    error.put("message", ex.getMessage());

		    return ResponseEntity
		            .status(HttpStatus.NOT_FOUND)
		            .body(error);
		}
		
		@ExceptionHandler(IllegalArgumentException.class)
		public ResponseEntity<Map<String, String>> handleIllegalArgument(
		        IllegalArgumentException ex) {

		    return ResponseEntity
		            .badRequest()
		            .body(Map.of("message", ex.getMessage()));
		}
		
		@ExceptionHandler(Exception.class)
		public ResponseEntity<Map<String, String>> handleGenericException(
		        Exception ex) {

		    logger.error("Unexpected error while processing request", ex);

		    return ResponseEntity
		            .status(HttpStatus.INTERNAL_SERVER_ERROR)
		            .body(Map.of("message", "An unexpected error occurred."));
		}
		
		@ExceptionHandler(IllegalStateException.class)
		public ResponseEntity<Map<String, String>> handleIllegalState(
		        IllegalStateException ex) {

		    return ResponseEntity
		            .status(HttpStatus.CONFLICT)
		            .body(Map.of("message", ex.getMessage()));
		}

		@ExceptionHandler(ApplicationNotFoundException.class)
		public ResponseEntity<Map<String, String>> handleApplicationNotFound(
		        ApplicationNotFoundException ex) {

		    return ResponseEntity
		            .status(HttpStatus.NOT_FOUND)
		            .body(Map.of("message", ex.getMessage()));
		}
}
