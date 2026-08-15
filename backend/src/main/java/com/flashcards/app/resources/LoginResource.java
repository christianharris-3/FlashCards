package com.flashcards.app.resources;

import com.flashcards.app.config.FlashCardAuthenticator;
import com.flashcards.app.models.User;
import com.flashcards.app.models.requests.LoginRequest;
import com.flashcards.app.models.response.ErrorResponse;
import com.flashcards.app.models.response.TokenResponse;
import io.dropwizard.auth.Auth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Optional;

@Path("api/auth/")
@Produces(MediaType.APPLICATION_JSON)
public class LoginResource {

    private final FlashCardAuthenticator flashCardAuthenticator;

    public LoginResource(FlashCardAuthenticator flashCardAuthenticator) {
        this.flashCardAuthenticator = flashCardAuthenticator;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("login")
    public Response login(@Valid @NotNull LoginRequest request) {
        Optional<String> token = flashCardAuthenticator.generateToken(
                request.getUsername(),
                request.getPassword()
        );
        if (token.isPresent()) {
            return Response.ok(new TokenResponse(token.get())).build();
        }
        return Response.status(401).entity(new ErrorResponse(401, "invalid username or password")).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("register")
    public Response register(@Valid @NotNull LoginRequest request) {
        if (!flashCardAuthenticator.validUsername(request.getUsername())) {
            return Response.status(406, "Username Already Used").build();
        }
        flashCardAuthenticator.register(request.getUsername(), request.getPassword());
        return Response.accepted().build();
    }

    @GET
    public Response lifelineCheck(@Auth User user) {
        return Response.ok(user).build();
    }
}