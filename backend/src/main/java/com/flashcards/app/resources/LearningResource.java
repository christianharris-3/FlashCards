package com.flashcards.app.resources;

import com.flashcards.app.managers.LearningManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.ContinueLearningData;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;
import com.flashcards.app.models.dao.LearningInstanceData;
import com.flashcards.app.models.requests.AddFlashCardLogRequest;
import com.flashcards.app.models.requests.CreateLearningInstanceRequest;
import com.flashcards.app.models.response.CreateLearningInstanceResponse;
import com.flashcards.app.models.response.IntValueResponse;
import io.dropwizard.auth.Auth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Optional;

@Path("api/learn")
@Produces(MediaType.APPLICATION_JSON)
public class LearningResource {

    private final LearningManager learningManager;
    private final UserValidationManager userValidationManager;

    public LearningResource(LearningManager learningManager, UserValidationManager userValidationManager) {
        this.learningManager = learningManager;
        this.userValidationManager = userValidationManager;
    }

    @POST
    @Path("/log-flashcard-use/{flashCardUseId}")
    public Response logFlashCardUse(@Auth User user,
                                    @PathParam("flashCardUseId") long flashCardUseId,
                                    @NotNull @Valid AddFlashCardLogRequest request) {
        userValidationManager.validateUserHasFlashCardUse(user, flashCardUseId);
        learningManager.logFlashCardUse(
                flashCardUseId,
                request.getTimestamp(),
                request.getTimeTakenMs(),
                request.getUserFeedback());
        return Response.accepted().build();
    }

    @GET
    @Path("/{learningInstanceId}")
    public Response loadingLearningInstanceCards(@Auth User user, @PathParam("learningInstanceId") long learningInstanceId) {
        userValidationManager.validateUserHasLearningInstance(user, learningInstanceId);
        List<FlashCardInLearningInstance> cards = learningManager.getLearningInstanceCards(learningInstanceId);
        return Response.accepted(cards).build();
    }

    @GET
    @Path("/data/{learningInstanceId}")
    public Response getLearningInstanceData(@Auth User user, @PathParam("learningInstanceId") long learningInstanceId) {
        userValidationManager.validateUserHasLearningInstance(user, learningInstanceId);
        Optional<LearningInstanceData> learningInstanceData = learningManager.getLearningInstanceData(learningInstanceId);
        if (learningInstanceData.isPresent()) {
            return Response.accepted(learningInstanceData).build();
        }
        return Response.status(400, "learning instance not found").build();
    }

    @GET
    @Path("/create/{learningType}/{collectionId}")
    public Response getLearningInstanceSize(@Auth User user,
                                           @PathParam("learningType") String learningType,
                                           @PathParam("collectionId") long collectionId
    ) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        int numCards = learningManager.getLearningInstanceSize(collectionId, learningType);
        return Response.accepted(
                new IntValueResponse(numCards)
        ).build();
    }

    @POST
    @Path("/create/{learningType}/{collectionId}")
    public Response createLearningInstance(@Auth User user,
                                           @PathParam("learningType") String learningType,
                                           @PathParam("collectionId") long collectionId,
                                           @NotNull CreateLearningInstanceRequest request
    ) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        long learningInstanceId = learningManager.createLearningInstance(collectionId, learningType,
                request.getFrontOfCard(), request.getStartIndex(), request.getEndIndex()
        );
        return Response.accepted(
                new CreateLearningInstanceResponse(learningInstanceId)
        ).build();
    }

    @GET
    public Response getContinueLearningItems(@Auth User user) {
        List<ContinueLearningData> continueLearningDataList = learningManager.getContinueLearningItems(user.getUserId());
        return Response.accepted(continueLearningDataList).build();
    }
}
