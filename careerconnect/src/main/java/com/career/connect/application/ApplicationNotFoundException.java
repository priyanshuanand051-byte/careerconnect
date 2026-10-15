
package com.career.connect.application;

public class ApplicationNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ApplicationNotFoundException(String message) {
        super(message);
    }
}
