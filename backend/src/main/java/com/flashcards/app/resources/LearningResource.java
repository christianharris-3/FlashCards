package com.flashcards.app.resources;

import com.flashcards.app.managers.LearningManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.requests.AddFlashCardLogRequest;
import io.dropwizard.auth.Auth;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("api")
@Produces(MediaType.APPLICATION_JSON)
public class LearningResource {

    private final LearningManager learningManager;
    private final UserValidationManager userValidationManager;

    public LearningResource(LearningManager learningManager, UserValidationManager userValidationManager) {
        this.learningManager = learningManager;
        this.userValidationManager = userValidationManager;
    }

    @POST
    @Path("/log-flashcard-use/{flashCardId}")
    public Response logFlashCardUse(@Auth User user,
                                    @PathParam("flashCardId") long flashCardId,
                                    AddFlashCardLogRequest request) {
        userValidationManager.validateUserHasFlashCard(user, flashCardId);
        learningManager.addFlashCardLog(
                flashCardId,
                request.getTimestamp(),
                request.getTimeTakenMs(),
                request.getUserFeedback());
        return Response.accepted().build();
    }

    @GET
    @Path("/collection-by-priority/{collectionId}")
    public Response getFlashCardsWithPriority(@Auth User user, @PathParam("collectionId") long collectionId) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        List<FlashCardData> flashCardData = learningManager.getFlashCardsWithPriority(collectionId);
        return Response.accepted(flashCardData).build();
    }
}
