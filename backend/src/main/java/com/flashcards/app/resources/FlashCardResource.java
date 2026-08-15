package com.flashcards.app.resources;

import com.flashcards.app.managers.FlashCardManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.FlashCardHistory;
import com.flashcards.app.models.requests.CreateFlashCardRequest;
import com.flashcards.app.models.requests.UpdateFlashCardRequest;
import io.dropwizard.auth.Auth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Optional;

@Path("api/flashcard")
@Produces(MediaType.APPLICATION_JSON)
public class FlashCardResource {

    private final FlashCardManager flashCardManager;
    private final UserValidationManager userValidationManager;

    public FlashCardResource(FlashCardManager flashCardManager, UserValidationManager userValidationManager) {
        this.flashCardManager = flashCardManager;
        this.userValidationManager = userValidationManager;
    }

    @POST
    public Response createFlashCard(@Auth User user, @NotNull @Valid CreateFlashCardRequest request) {
        userValidationManager.validateUserHasCollection(user, request.getCollectionId());
        flashCardManager.createFlashCard(request.getCollectionId(), request.getFrontText(), request.getBackText());
        return Response.accepted().build();
    }

    @GET
    @Path("/{flashCardId}")
    public Response getFlashCardHistory(@Auth User user, @PathParam("flashCardId") long flashCardId) {
        userValidationManager.validateUserHasFlashCard(user, flashCardId);
        Optional<FlashCardHistory> flashCard = flashCardManager.getFlashCardHistory(flashCardId);
        if (flashCard.isPresent()) {
            return Response.accepted(flashCard.get()).build();
        }
        return Response.status(404).build();
    }

    @PUT
    @Path("/{flashCardId}")
    public Response updateFlashCard(@Auth User user,
                                    @PathParam("flashCardId") long flashCardId,
                                    @NotNull UpdateFlashCardRequest request) {
        userValidationManager.validateUserHasFlashCard(user, flashCardId);
        flashCardManager.updateFlashCard(flashCardId, request.getFrontText(), request.getBackText());
        return Response.accepted().build();
    }

    @DELETE
    @Path("/{flashCardId}")
    public Response deleteFlashCard(@Auth User user, @PathParam("flashCardId") long flashCardId) {
        userValidationManager.validateUserHasFlashCard(user, flashCardId);
        flashCardManager.deleteFlashCard(flashCardId);
        return Response.accepted().build();
    }
}
