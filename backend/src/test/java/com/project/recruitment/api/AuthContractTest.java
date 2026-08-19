package com.project.recruitment.api;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AuthContractTest {
    @Test
    void authenticationContractDeclaresRequiredEndpointsAndResponses() throws Exception {
        Path contract = Path.of("..", "specs", "002-user-auth-flows", "contracts", "auth-api.yaml");
        String content = Files.readString(contract);

        assertTrue(content.contains("/auth/register"));
        assertTrue(content.contains("/auth/login"));
        assertTrue(content.contains("/auth/session"));
        assertTrue(content.contains("/auth/logout"));
        assertTrue(content.contains("'201'"));
        assertTrue(content.contains("'401'"));
        assertTrue(content.contains("'403'"));
        assertTrue(content.contains("'409'"));
    }
}
